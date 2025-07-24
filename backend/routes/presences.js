const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get("/:cours_id", async (req, res) => {
    const { cours_id } = req.params;

    try {
        // Obtenir le niveau à partir du cours
        const [coursResult] = await db.promise().query(`
            SELECT c.id AS classe_id, c.niveau
            FROM cours co
            JOIN classes c ON co.classe_id = c.id
            WHERE co.id = ?
        `, [cours_id]);

        if (coursResult.length === 0) {
            return res.status(404).json({ error: "Cours non trouvé." });
        }

        const { classe_id, niveau } = coursResult[0];

        // Obtenir tous les élèves de ce niveau, avec présence si dispo pour ce cours
        const [eleves] = await db.promise().query(`
            SELECT e.id AS eleve_id, e.nom, e.prenom, c.niveau,
                   p.present, p.remarque
            FROM eleves e
            JOIN classes c ON e.classe_id = c.id
            LEFT JOIN presences p ON p.eleve_id = e.id AND p.cours_id = ?
            WHERE c.niveau = ?
            ORDER BY c.nom, e.nom
        `, [cours_id, niveau]);

        // Regrouper les élèves par niveau
        const grouped = {};
        grouped[niveau] = eleves.map(e => ({
            eleve_id: e.eleve_id,
            nom: e.nom,
            prenom: e.prenom,
            present: e.present === null ? true : !!e.present,
            remarque: e.remarque || ""
        }));

        res.json(grouped);

    } catch (err) {
        console.error("Erreur récupération présences regroupées :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Enregistrer les présences pour un cours donné
router.post('/:cours_id', (req, res) => {
    const { cours_id } = req.params;
    const { presences } = req.body; // tableau [{ eleve_id, present, remarque }]

    if (!Array.isArray(presences)) {
        return res.status(400).json({ error: "Le format des présences est invalide." });
    }

    // On supprime les présences existantes pour ce cours
    db.query('DELETE FROM presences WHERE cours_id = ?', [cours_id], (err) => {
        if (err) {
            console.error('Erreur lors de la suppression des anciennes présences :', err);
            return res.status(500).json({ error: 'Erreur interne serveur' });
        }

        if (presences.length === 0) {
            return res.status(200).json({ message: "Aucune présence à enregistrer." });
        }

        const values = presences.map(p => [cours_id, p.eleve_id, p.present ? 1 : 0, p.remarque || ""]);

        const sqlInsert = `
            INSERT INTO presences (cours_id, eleve_id, present, remarque)
            VALUES ?
        `;

        db.query(sqlInsert, [values], (err) => {
            if (err) {
                console.error('Erreur lors de l’insertion des présences :', err);
                return res.status(500).json({ error: 'Erreur lors de l’enregistrement' });
            }
            res.status(200).json({ message: 'Présences enregistrées avec succès.' });
        });
    });
});


module.exports = router;