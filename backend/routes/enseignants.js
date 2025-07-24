const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 🔹 TOUS LES ENSEIGNANTS
router.get('/', (req, res) => {
    db.query("SELECT * FROM enseignants", (err, rows) => {
        if (err) return res.status(500).json({ error: "Erreur serveur", details: err });
        res.json(rows);
    });
});

// 🔹 ENSEIGNANT PAR ID
router.get('/:id', (req, res) => {
    db.query("SELECT * FROM enseignants WHERE id = ?", [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: "Erreur serveur", details: err });
        if (rows.length === 0) return res.status(404).json({ message: "Enseignant non trouvé" });
        res.json(rows[0]);
    });
});

// 🔹 AJOUTER UN ENSEIGNANT
router.post('/', (req, res) => {
    const { matricule, nom, prenom, email, telephone, specialite, date_recrutement } = req.body;
    db.query(
        "INSERT INTO enseignants (matricule, nom, prenom, email, telephone, specialite, date_recrutement) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [matricule, nom, prenom, email, telephone, specialite, date_recrutement],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Erreur insertion", details: err });
            res.status(201).json({ message: "Enseignant ajouté", id: result.insertId });
        }
    );
});

// 🔹 MODIFIER UN ENSEIGNANT
router.put('/:id', (req, res) => {
    const { matricule, nom, prenom, email, telephone, specialite, date_recrutement } = req.body;
    db.query(
        "UPDATE enseignants SET matricule = ?, nom = ?, prenom = ?, email = ?, telephone = ?, specialite = ?, date_recrutement = ? WHERE id = ?",
        [matricule, nom, prenom, email, telephone, specialite, date_recrutement, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: "Erreur modification", details: err });
            res.json({ message: "Enseignant modifié" });
        }
    );
});

// 🔹 SUPPRIMER UN ENSEIGNANT
router.delete('/:id', (req, res) => {
    db.query("DELETE FROM enseignants WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Erreur suppression", details: err });
        res.json({ message: "Enseignant supprimé" });
    });
});

// 🔹 GROUPEMENT PAR MATIÈRE ENSEIGNÉE (specialite)
router.get('/groupes-par-specialite', (req, res) => {
    db.query(
        "SELECT specialite, JSON_ARRAYAGG(JSON_OBJECT('id', id, 'nom', nom, 'prenom', prenom, 'email', email, 'telephone', telephone, 'matricule', matricule, 'date_recrutement', date_recrutement)) AS enseignants FROM enseignants GROUP BY specialite",
        (err, rows) => {
            if (err) return res.status(500).json({ error: "Erreur regroupement", details: err });

            const formatted = rows.map(row => ({
                specialite: row.specialite,
                enseignants: JSON.parse(row.enseignants)
            }));

            res.json(formatted);
        }
    );
});

// 🔹 ENSEIGNANTS AVEC LEURS MATIÈRES ENSEIGNÉES
// Obtenir les enseignants avec leurs matières
router.get('/avec-matieres', (req, res) => {
  const sql = `
    SELECT e.id, e.nom, e.prenom, e.email, e.telephone, e.date_recrutement, e.matricule, e.specialite,
           GROUP_CONCAT(m.nom SEPARATOR ', ') AS matieres
    FROM enseignants e
    LEFT JOIN enseignant_matieres em ON e.id = em.enseignant_id
    LEFT JOIN matieres m ON em.matiere_id = m.id
    GROUP BY e.id
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const result = rows.map(row => ({
      ...row,
      matieres: row.matieres ? row.matieres.split(', ') : []
    }));

    res.json(result);
  });
});

// Groupement par matière : pour chaque matière, la liste des enseignants
router.get('/par-matiere', (req, res) => {
  const sql = `
    SELECT m.id AS matiere_id, m.nom AS matiere_nom,
           e.id AS enseignant_id, e.nom, e.prenom, e.email, e.telephone, e.matricule, e.date_recrutement, e.specialite
    FROM matieres m
    LEFT JOIN enseignant_matieres em ON em.matiere_id = m.id
    LEFT JOIN enseignants e ON em.enseignant_id = e.id
    ORDER BY m.nom, e.nom;
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const grouped = {};

    rows.forEach(row => {
      if (!grouped[row.matiere_nom]) grouped[row.matiere_nom] = [];
      if (row.enseignant_id) {
        grouped[row.matiere_nom].push({
          id: row.enseignant_id,
          nom: row.nom,
          prenom: row.prenom,
          email: row.email,
          telephone: row.telephone,
          matricule: row.matricule,
          specialite: row.specialite,
          date_recrutement: row.date_recrutement
        });
      }
    });

    res.json(grouped);
  });
});

router.get('/with-subjects', (req, res) => {
  const sql = `
    SELECT e.id, e.matricule, e.nom, e.prenom, e.email, e.telephone, e.date_recrutement, e.specialite,
           m.nom AS matiere
    FROM enseignants e
    LEFT JOIN enseignant_matieres em ON e.id = em.enseignant_id
    LEFT JOIN matieres m ON em.matiere_id = m.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur', details: err });

    const grouped = {};
    results.forEach(row => {
      if (!grouped[row.id]) {
        grouped[row.id] = {
          id: row.id,
          matricule: row.matricule,
          nom: row.nom,
          prenom: row.prenom,
          email: row.email,
          telephone: row.telephone,
          date_recrutement: row.date_recrutement,
          specialite: row.specialite,
          matieres: []
        };
      }
      if (row.matiere) grouped[row.id].matieres.push(row.matiere);
    });

    res.json(Object.values(grouped));
  });
});

module.exports = router;
