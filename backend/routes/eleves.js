const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ALL - avec regroupement par niveau
router.get('/', (req, res) => {
    db.query(
        `SELECT e.*, c.nom AS classe_nom, c.niveau
         FROM eleves e
         JOIN classes c ON e.classe_id = c.id
         ORDER BY c.niveau, c.nom, e.nom`,
        (err, rows) => {
            if (err) return res.status(500).send(err);

            // Regrouper les élèves par niveau
            const grouped = {};
            rows.forEach(eleve => {
                if (!grouped[eleve.niveau]) {
                    grouped[eleve.niveau] = [];
                }
                grouped[eleve.niveau].push(eleve);
            });

            res.json(grouped);
        }
    );
});

//GET ONE
router.get('/niveau/:niveau', (req, res) => {
    db.query(
        `SELECT e.*, c.nom AS classe_nom
         FROM eleves e
         JOIN classes c ON e.classe_id = c.id
         WHERE c.niveau = ?
         ORDER BY c.nom, e.nom`,
        [req.params.niveau],
        (err, rows) => {
            if (err) return res.status(500).send(err);
            res.json(rows);
        }
    );
});

// GET ONE
router.get('/:id', (req, res) => {
    db.query(
        `SELECT e.*, c.nom AS classe_nom, c.niveau
         FROM eleves e
         JOIN classes c ON e.classe_id = c.id
         WHERE e.id = ?`,
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).send(err);
            res.json(rows[0]);
        }
    );
});

//POST
router.post('/', (req, res) => {
    const { matricule, nom, prenom, date_naissance, sexe, classe_id } = req.body;
    db.query("INSERT INTO eleves (matricule, nom, prenom, date_naissance, sexe, classe_id) VALUES (?, ?, ?, ?, ?, ?)", [matricule, nom, prenom, date_naissance, sexe, classe_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId });
    });
});

// PUT
router.put('/:id', (req, res) => {
    const { matricule, nom, prenom, date_naissance, sexe, classe_id } = req.body;
    db.query("UPDATE eleves SET matricule = ?, nom = ?, prenom = ?, date_naissance = ?, sexe = ?, classe_id = ? WHERE id = ?", [matricule, nom, prenom, date_naissance, sexe, classe_id, req.params.id]), (err) => {
        if (err) return res.status(500).send(err);
        res.send("Eleve mis a jour");
    }
});

//Delete
router.delete('/:id', (req, res) => {
    db.query("DELETE FROM eleves WHERE id = ?", [req.params.id], (err) => {
        if(err) return res.status(500).send(err);
        res.send("Eleve supprime");
    });
});

module.exports = router;