// routes/bulletins.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ Requête pour récupérer les notes avec info élève / matière / semestre
    const [notes] = await db.promise().query(`
      SELECT 
        n.eleve_id, e.nom AS eleve_nom, e.prenom AS eleve_prenom, c.nom AS classe_nom,
        m.nom AS matiere_nom, s.id AS semestre_id,
        s.nom AS semestre_nom, s.annee_scolaire, n.note
      FROM notes n
      JOIN matieres m ON n.matiere_id = m.id
      JOIN semestres s ON n.semestre_id = s.id
      JOIN eleves e ON n.eleve_id = e.id
      JOIN classes c ON e.classe_id = c.id
      WHERE n.eleve_id = ?
      ORDER BY s.id, m.nom
    `, [id]);

   // 1. Récupère toutes les moyennes des élèves par semestre
const [allMoyennes] = await db.promise().query(`
  SELECT 
    n.semestre_id,
    n.eleve_id,
    ROUND(AVG(n.note), 2) AS moyenne
  FROM notes n
  GROUP BY n.semestre_id, n.eleve_id
`);

// 2. Calcule le rang et total par programme JS
const rangs = [];

const semestres = [...new Set(allMoyennes.map(n => n.semestre_id))];

for (const semestreId of semestres) {
  const notesSemestre = allMoyennes
    .filter(n => n.semestre_id === semestreId)
    .sort((a, b) => b.moyenne - a.moyenne);

  notesSemestre.forEach((n, index) => {
    const rang = index + 1;
    const total = notesSemestre.length;
    if (n.eleve_id == id) {
      rangs.push({
        semestre_id: semestreId,
        moyenne: n.moyenne,
        rang,
        total
      });
    }
  });
}



    // 3️⃣ Appréciations par semestre
    const [appreciations] = await db.promise().query(`
      SELECT semestre_id, appreciation
      FROM appreciations
      WHERE eleve_id = ?
    `, [id]);

    // ✅ Vérification minimale
    if (notes.length === 0) {
      return res.status(404).json({ message: 'Aucune note trouvée pour cet élève.' });
    }

    res.json({ notes, rangs, appreciations });
  } catch (err) {
    console.error("Erreur serveur /bulletins/:id", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// routes/bulletins.js
router.get('/classe/:classeId', async (req, res) => {
  const { classeId } = req.params;

  try {
    // Récupère toutes les notes des élèves de la classe
    const [notes] = await db.promise().query(`
      SELECT 
        e.id AS eleve_id, e.nom AS eleve_nom, e.prenom AS eleve_prenom,
        c.nom AS classe_nom,
        m.nom AS matiere_nom, s.nom AS semestre_nom, s.id AS semestre_id,
        s.annee_scolaire, n.note
      FROM notes n
      JOIN eleves e ON n.eleve_id = e.id
      JOIN classes c ON e.classe_id = c.id
      JOIN matieres m ON n.matiere_id = m.id
      JOIN semestres s ON n.semestre_id = s.id
      WHERE c.id = ?
      ORDER BY e.id, s.id, m.nom
    `, [classeId]);

    res.json({ notes });
  } catch (err) {
    console.error("Erreur bulletins par classe :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get('/', (req, res) => {
  db.query('SELECT nom, prenom FROM eleves', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la récupération des enseignants' });
    res.json(rows);
  });
});


module.exports = router;
