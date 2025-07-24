const express = require('express');
const router = express.Router();
const db = require('../config/db');

//GET all
router.get("/", (req, res) => {
    db.query("SELECT * FROM semestres", (err, rows) => {
        if(err) return res.status(500).send(err);
        res.json(rows);
    });
});

//GET one
router.get("/:id", (req, res) => {
    db.query("SELECT * FROM semestres WHERE id = ?", [req.params.id], (err, rows) => {
        if (err) res.status(500).send(err);
        res.json(rows[0]);
    });
});

// POST
router.post("/", (req, res) => {
    const { nom, annee_scolaire } = req.body;
    db.query("INSERT INTO semestres (nom, annee_scolaire) VALUES (?, ?)", [nom, annee_scolaire], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId });
    });
});

// PUT
router.put("/:id", (req, res) => {
    const { nom, annee_scolaire } = req.body;
    db.query("UPDATE semestres SET nom = ?, annee_scolaire = ? WHERE id = ?", [nom, annee_scolaire, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Semestre mis a jour");
    });
});

// DELETE
router.delete("/:id", (req, res) => {
    db.query("DELETE FROM semestres WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Semestre supprime");
    });
});

module.exports = router;