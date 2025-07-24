const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if(err) return res.status(500).send('Erreur serveur');

        if(results.length === 0) return res.status(401).send('Utilisateur introuvable');

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).send('Mot de passe incorrect');

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    });
};

const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", [username, email, hashedPassword, role], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send('Erreur lors de l\'inscription');
        }
        res.status(201).send('Utilisateur cree');
    });
};

module.exports = { login, register };