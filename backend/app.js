const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const classeRoutes = require('./routes/classe');
const enseignantRoutes = require('./routes/enseignants');
const matieresRoutes = require('./routes/matieres');
const enseignantMatieresRoutes = require('./routes/enseignantMatieres');
const elevesRoutes = require('./routes/eleves');
const semestreRoutes = require('./routes/semestres');
const noteRoutes = require('./routes/notes');
const statsRoutes = require('./routes/statistiques');
const bulletinRoutes = require('./routes/bulletin');
const courRoutes = require('./routes/cours');
const presenceRoutes = require('./routes/presences');
const emploiRoutes = require('./routes/emploi');
const dashboardRouter = require("./routes/dashboard");


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/classes', classeRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/matieres', matieresRoutes);
app.use('/api/enseignant-matieres', enseignantMatieresRoutes);
app.use('/api/eleves', elevesRoutes);
app.use('/api/semestres', semestreRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/statistiques', statsRoutes);
app.use('/api/bulletins', bulletinRoutes);
app.use('/api/cours', courRoutes);
app.use('/api/presences', presenceRoutes);
app.use('/api/emplois', emploiRoutes);
app.use('/api/dashboard', dashboardRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur demarre sur le port ${PORT}`));