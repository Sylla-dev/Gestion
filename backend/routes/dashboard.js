// routes/dashboard.js
const express = require("express");

const router = express.Router();
const db = require("../config/db"); // ton pool ou connexion MySQL

// Route pour récupérer les statistiques
router.get('/stats', (req, res) => {
  // On va lancer toutes les demandes en même temps
  const elevesQuery = "SELECT COUNT(*) AS count FROM eleves";
  const enseignantsQuery = "SELECT COUNT(*) AS count FROM enseignants";
  const matieresQuery = "SELECT COUNT(*) AS count FROM matieres";
  const classesQuery = "SELECT COUNT(*) AS count FROM classes";

  db.query(elevesQuery, (err, eleveResult) => {
    if (err) return res.status(500).json({error:err});
    db.query(enseignantsQuery, (err, enseignantResult) => {
      if (err) return res.status(500).json({error:err});
      db.query(matieresQuery, (err, matiereResult) => {
        if (err) return res.status(500).json({error:err});
        db.query(classesQuery, (err, classeResult) => {
          if (err) return res.status(500).json({error:err});

// On retourne toutes les données
          res.json({ 
            eleves: eleveResult[0].count,
            enseignants: enseignantResult[0].count,
            matieres: matiereResult[0].count,
            classes: classeResult[0].count
          });
        });
      });
    });
  });
});

// Export de la route
module.exports = router;

