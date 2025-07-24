const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lister toutes les classes avec leur emploi du temps, groupées par niveau
router.get("/", (req, res) => {
    db.query(
        `
        SELECT 
            edt.*, 
            m.nom AS matiere, 
            e.nom AS enseignant,
            c.nom AS classe_nom,
            c.niveau AS classe_niveau
        FROM emplois_du_temps edt
        JOIN matieres m ON edt.matiere_id = m.id
        JOIN enseignants e ON edt.enseignant_id = e.id
        JOIN classes c ON edt.classe_id = c.id
        ORDER BY c.niveau, c.nom, FIELD(jour_semaine, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'), heure_debut
        `,
        (err, rows) => {
            if (err) return res.status(500).json({ error: err });

            // Regrouper par niveau -> classe -> cours
            const grouped = {};

            rows.forEach((item) => {
                if (!grouped[item.classe_niveau]) {
                    grouped[item.classe_niveau] = {};
                }

                if (!grouped[item.classe_niveau][item.classe_nom]) {
                    grouped[item.classe_niveau][item.classe_nom] = [];  
                }

                grouped[item.classe_niveau][item.classe_nom].push(item);
            });

            res.json(grouped);
        }
    );
});

// Lister par classe
router.get('/classe/:id', (req, res) => {
    const classe_id = req.params.id;

    db.query(
        `
        SELECT edt.*, m.nom AS matiere, e.nom AS enseignant 
        FROM emplois_du_temps edt
        JOIN matieres m ON edt.matiere_id = m.id
        JOIN enseignants e ON edt.enseignant_id = e.id
        WHERE edt.classe_id = ?
        ORDER BY FIELD(jour_semaine, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'), heure_debut
        `,
        [classe_id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err });
            res.json(rows);
        }
    );
});

// Ajouter un cours
router.post("/", (req, res) => {
    const { classe_id, enseignant_id, matiere_id, jour_semaine, heure_debut, heure_fin, salle } = req.body;

    const sql = `
        SELECT * FROM emplois_du_temps 
        WHERE classe_id = ? AND jour_semaine = ? AND (
            (? BETWEEN heure_debut AND heure_fin)
            OR (? BETWEEN heure_debut AND heure_fin)
            OR (heure_debut BETWEEN ? AND ?)
        )
    `;

    db.query(
        sql,
        [classe_id, jour_semaine, heure_debut, heure_fin, heure_debut, heure_fin],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err });

            if (rows.length > 0) {
                return res.status(400).json({ error: "Conflit avec un autre cours" });
            }

            db.query(
                `INSERT INTO emplois_du_temps 
                (classe_id, enseignant_id, matiere_id, jour_semaine, heure_debut, heure_fin, salle)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [classe_id, enseignant_id, matiere_id, jour_semaine, heure_debut, heure_fin, salle],
                (err) => {
                    if (err) return res.status(500).json({ error: err });
                    res.status(201).json({ message: "Cours ajouté à l'emploi du temps" });
                }
            );
        }
    );
});

// Modifier un créneau
router.put("/:id", (req, res) => {
    const { enseignant_id, matiere_id, jour_semaine, heure_debut, heure_fin, salle } = req.body;

    db.query(
        `UPDATE emplois_du_temps 
         SET enseignant_id = ?, matiere_id = ?, jour_semaine = ?, heure_debut = ?, heure_fin = ?, salle = ?
         WHERE id = ?`,
        [enseignant_id, matiere_id, jour_semaine, heure_debut, heure_fin, salle, req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Modifié" });
        }
    );
});

// Supprimer un créneau
router.delete("/:id", (req, res) => {
    db.query(
        `DELETE FROM emplois_du_temps WHERE id = ?`,
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Supprimé" });
        }
    );
});

// Export
module.exports = router;
