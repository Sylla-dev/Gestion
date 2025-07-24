const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ➕ Ajouter un cours
router.post("/", (req, res) => {
    const { classe_id, enseignant_id, matiere_id, date_cours, heure_debut, heure_fin, contenu } = req.body;

    if (!classe_id || !enseignant_id || !matiere_id || !date_cours || !heure_debut || !heure_fin || !contenu) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    db.query(`
        INSERT INTO cours (classe_id, enseignant_id, matiere_id, date_cours, heure_debut, heure_fin, contenu)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [classe_id, enseignant_id, matiere_id, date_cours, heure_debut, heure_fin, contenu], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: "Cours ajouté", id: result.insertId });
    });
});

// 📄 Liste de tous les cours (triés + jointures)
router.get('/', (req, res) => {
    const { page = 1, limit = 10, classe_id } = req.query;
    const offset = (page - 1) * limit;

    let baseQuery = `
        SELECT c.*, cl.nom AS classe_nom, cl.niveau AS classe_niveau,
               e.nom AS enseignant_nom, e.prenom AS enseignant_prenom,
               m.nom AS matiere_nom
        FROM cours c
        JOIN classes cl ON c.classe_id = cl.id
        JOIN enseignants e ON c.enseignant_id = e.id
        JOIN matieres m ON c.matiere_id = m.id
        ${classe_id ? 'WHERE c.classe_id = ?' : ''}
        ORDER BY c.date_cours DESC
        LIMIT ? OFFSET ?
    `;

    let countQuery = `
        SELECT COUNT(*) as total FROM cours
        ${classe_id ? 'WHERE classe_id = ?' : ''}
    `;

    const params = classe_id ? [classe_id, parseInt(limit), parseInt(offset)] : [parseInt(limit), parseInt(offset)];

    db.query(baseQuery, params, (err, cours) => {
        if (err) return res.status(500).json({ error: err });

        db.query(countQuery, classe_id ? [classe_id] : [], (err2, countResult) => {
            if (err2) return res.status(500).json({ error: err2 });

            res.json({ cours, total: countResult[0].total });
        });
    });
});


// 📊 Regrouper les cours par niveau
router.get('/grouped-by-niveau', (req, res) => {
    db.query(`
        SELECT 
            cl.niveau AS niveau,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', c.id,
                    'classe', cl.nom,
                    'date', c.date_cours,
                    'heure_debut', c.heure_debut,
                    'heure_fin', c.heure_fin,
                    'matiere', m.nom,
                    'enseignant', CONCAT(e.prenom, ' ', e.nom),
                    'contenu', c.contenu
                )
            ) AS cours
        FROM cours c
        JOIN classes cl ON c.classe_id = cl.id
        JOIN enseignants e ON c.enseignant_id = e.id
        JOIN matieres m ON c.matiere_id = m.id
        GROUP BY cl.niveau
        ORDER BY cl.niveau ASC
    `, (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        
        const grouped = rows.map(row => ({
            niveau: row.niveau,
            cours: JSON.parse(row.cours)
        }));

        res.json(grouped);
    });
});

// 🗑️ Supprimer un cours
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM cours WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Cours non trouvé" });
        res.json({ message: 'Cours supprimé avec succès' });
    });
});

module.exports = router;
