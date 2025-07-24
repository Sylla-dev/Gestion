const express = require('express');
const routes = express.Router();
const db = require('../config/db');


//Lier un enseignant a plusieur matieres
routes.post('/assign', (req, res) => {
  const { enseignant_id, matiere_ids } = req.body;

  if (!Array.isArray(matiere_ids)) {
    return res.status(400).send("Le champ 'matiere_ids' doit être un tableau.");
  }

  const values = matiere_ids.map((mid) => [enseignant_id, mid]);

  db.query("DELETE FROM enseignant_matieres WHERE enseignant_id = ?", [enseignant_id], (err) => {
    if (err) return res.status(500).send(err);

    if (values.length === 0) return res.send("Aucune matière assignée");

    db.query("INSERT INTO enseignant_matieres (enseignant_id, matiere_id) VALUES ?", [values], (err2) => {
      if (err2) return res.status(500).send(err2);
      res.send("Matières assignées");
    });
  });
});


//GET matieres d'un enseignant
routes.get('/:enseignant_id', (req, res) => {
  const { enseignant_id } = req.params;

  // Validation de l'ID de l'enseignant
  if (!enseignant_id || isNaN(parseInt(enseignant_id))) {
    return res.status(400).json({ error: "ID d'enseignant invalide." });
  }

  const sql = `
    SELECT m.*
    FROM matieres m
    INNER JOIN enseignant_matieres em ON em.matiere_id = m.id
    WHERE em.enseignant_id = ?
  `;

  db.query(sql, [enseignant_id], (err, rows) => {
    if (err) {
      console.error("Erreur lors de la récupération des matières :", err);
      return res.status(500).json({ error: "Erreur serveur lors de la récupération des matières." });
    }

    res.json(rows);
  });
});

// GET /api/enseignants
routes.get('/', (req, res) => {
  db.query('SELECT id, nom, prenom FROM enseignants', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la récupération des enseignants' });
    res.json(rows);
  });
});




module.exports = routes;