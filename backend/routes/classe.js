const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtenir toutes les classes
router.get('/', (req, res) => {
  db.query("SELECT * FROM classes ORDER BY niveau, nom", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Regrouper les classes par niveau (ex: primaire, collège, lycée)
router.get('/group-by-niveau', (req, res) => {
  db.query("SELECT * FROM classes ORDER BY niveau, nom", (err, results) => {
    if (err) return res.status(500).send(err);

    const grouped = results.reduce((acc, classe) => {
      if (!acc[classe.niveau]) acc[classe.niveau] = [];
      acc[classe.niveau].push(classe);
      return acc;
    }, {});

    res.json(grouped); // format : { "Primaire": [..], "Lycée": [..] }
  });
});

// Obtenir une classe par ID
router.get('/:id', (req, res) => {
  db.query("SELECT * FROM classes WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send("Classe non trouvée");
    res.json(results[0]);
  });
});

// Créer une classe
router.post('/', (req, res) => {
  const { nom, niveau, annee_scolaire } = req.body;
  if (!nom || !niveau || !annee_scolaire) {
    return res.status(400).send("Tous les champs sont requis");
  }

  db.query(
    "INSERT INTO classes (nom, niveau, annee_scolaire) VALUES (?, ?, ?)",
    [nom, niveau, annee_scolaire],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id: result.insertId, message: 'Classe ajoutée' });
    }
  );
});

// Mettre à jour une classe
router.put('/:id', (req, res) => {
  const { nom, niveau, annee_scolaire } = req.body;
  if (!nom || !niveau || !annee_scolaire) {
    return res.status(400).send("Tous les champs sont requis");
  }

  db.query(
    "UPDATE classes SET nom = ?, niveau = ?, annee_scolaire = ? WHERE id = ?",
    [nom, niveau, annee_scolaire, req.params.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send('Classe mise à jour');
    }
  );
});

// Supprimer une classe
router.delete('/:id', (req, res) => {
  db.query("DELETE FROM classes WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Classe supprimée');
  });
});

module.exports = router;
