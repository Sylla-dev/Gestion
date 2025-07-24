const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Lister toutes les notes (sans filtre)
router.get("/", (req, res) => {
    const sql = `
        SELECT n.id, e.nom AS eleve_nom, e.prenom, m.nom AS matiere_nom, s.nom AS semestre_nom, type, note, c.niveau
        FROM notes n
        JOIN eleves e ON n.eleve_id = e.id
        JOIN classes c ON e.classe_id = c.id
        JOIN matieres m ON n.matiere_id = m.id
        JOIN semestres s ON n.semestre_id = s.id
    `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

// Lister les notes filtrées par niveau d'étude (ex: /api/notes/niveau/college)
router.get("/niveau/:niveau", (req, res) => {
    const niveau = req.params.niveau;
    const sql = `
        SELECT n.id, e.nom AS eleve_nom, e.prenom, m.nom AS matiere_nom, s.nom AS semestre_nom, note, c.niveau
        FROM notes n
        JOIN eleves e ON n.eleve_id = e.id
        JOIN classes c ON e.classe_id = c.id
        JOIN matieres m ON n.matiere_id = m.id
        JOIN semestres s ON n.semestre_id = s.id
        WHERE c.niveau = ?
    `;
    db.query(sql, [niveau], (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

// Ajouter une note
router.post('/', (req, res) => {
    const { eleve_id, matiere_id, semestre_id, type, note } = req.body;
    db.query(
        "INSERT INTO notes (eleve_id, matiere_id, semestre_id, type, note) VALUES (?, ?, ?, ?, ?)",
        [eleve_id, matiere_id, semestre_id, type, note],
        (err, result) => {
            if (err) return res.status(500).send('Erreur dajouter les notes',err);
            res.status(201).json({ id: result.insertId });
        }
    );
});

// Modifier une note
router.put("/:id", (req, res) => {
    const { eleve_id, matiere_id, semestre_id, type, note } = req.body;
    db.query(
        "UPDATE notes SET eleve_id = ?, matiere_id = ?, semestre_id = ?, type = ?, note = ? WHERE id = ?",
        [eleve_id, matiere_id, semestre_id, type, note, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Note mise à jour");
        }
    );
});

// Supprimer une note
router.delete("/:id", (req, res) => {
    db.query("DELETE FROM notes WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Note supprimée');
    });
});

module.exports = router;
