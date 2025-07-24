// Exemple dans routes/appreciation.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // adapter selon ta config

// Ajouter une appréciation (pas de modification si déjà existante)
router.post('/:eleveId', (req, res) => {
  const { eleveId } = req.params;
  const { semestre_id, appreciation } = req.body;

  try {
    // Insère si non existant
    db.query(
      'INSERT INTO appreciations (eleve_id, semestre_id, appreciation) VALUES (?, ?, ?)',
      [eleveId, semestre_id, appreciation]
    );

    res.status(201).json({ message: 'Appréciation ajoutée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l’ajout d’une appréciation :', error);
    res.status(500).json({ error: 'Erreur serveur lors de l’ajout.' });
  }
});

module.exports = router;
