const express = require('express')
const router = express.Router();
const db = require('../config/db');

//GET ALL
router.get('/', (req, res) => {
    db.query("SELECT * FROM matieres", (err, rows) => {
        if (err) return res.status(500).send(err);
        res.json(rows);
    });
});

//Get one
router.get('/:id', (req, res) => {
    db.query("SELECT * FROM matieres WHERE id = ?", [req.params.id], (err, rows) => {
        if (err) return res.status(500).send(err);
        if (rows.length === 0) return res.status(404).send("Not found");
        res.json(rows[0]);
    });
});

//POST
router.post('/', (req, res) => {
    const { nom, coef } = req.body;
    db.query("INSERT INTO matieres (nom, coef ) VALUES (?, ?)", [nom, coef], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({id: result.insertId });
    });
});

//PUT
router.put('/:id', (req, res) => {
    const { nom, coef } = req.body;
    db.query("UPDATE matieres SET nom = ?, coef = ? WHERE id = ?", [nom, coef, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Matiere mise a jour");
    });
});

//DELETE
router.delete('/:id', (req, res) => {
    db.query("DELETE FROM matieres WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Matiere supprimee');
    });
});

module.exports = router;