const express = require('express');
const router = express.Router();
const db = require('../config/db');

//Moyenne des notes par eleve, matiere, semestre
router.get('/moyennes', (req,res) => {
    db.query(`
        SELECT
           n.eleve_id,
           e.nom AS eleve_nom,
           e.prenom AS eleve_prenom,
           m.id AS matiere_id,
           m.nom AS matiere_nom,
           s.id AS semestre_id,
           s.nom AS semestre_nom,
           ROUND(AVG(n.note), 2) AS moyenne
           FROM notes n
           JOIN eleves e ON n.eleve_id = e.id
           JOIN matieres m ON n.matiere_id = m.id
           JOIN semestres s ON n.semestre_id = s.id
           GROUP BY n.eleve_id, m.id, s.id
           ORDER BY e.nom, m.nom;
        `, (err, rows) => {
            if(err) return res.status(500).send(err);
            res.json(rows);
        });
});

module.exports = router;