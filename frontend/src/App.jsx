import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./pages/Login";
import Register from './pages/Register';

import AdminDashboard from "./pages/admin/AdminDashboard";
import EleveDashboard from "./pages/eleve/EleveDashboard";
import EnseignantDashboard from "./pages/enseignant/EnseignantDashboard";

import ClassList from "./pages/admin/ClassList";
import ClasseForm from "./pages/admin/ClasseForm";

import TeacherList from "./pages/admin/TeacherList";
import TeacherForm from "./pages/admin/TeacherForm";

import MatiereForm from "./pages/admin/MatiereForm";
import MatiereList from "./pages/admin/MatiereList";

import EleveList from "./pages/admin/EleveList";
import EleveForm from "./pages/admin/EleveForm";

import SemestreList from "./pages/admin/SemestreList";
import SemestreForm from "./pages/admin/SemestreForm";

import NoteList from "./pages/admin/NoteList";
import NoteForm from "./pages/admin/NoteForm";

import MoyenneList from "./pages/admin/MoyenneList";

import BulletinSemestre from "./pages/admin/BulletinSemestre";

import CoursList from "./pages/enseignant/CoursList";
import CoursForm from "./pages/enseignant/CoursForm";

import PresenceForm from "./pages/enseignant/PresenceForm";

import EmploiDuTempsForm from "./pages/admin/EmploiDuTempsForm";

import AssignSubjectsToTeacher from "./pages/admin/AssignSubjectsToTeacher";

import TeacherSubjectsList from "./pages/admin/TeacherSubjectsList";

import BulletinEleve from "./pages/admin/BulletinEleve";

import EmploiPage from "./pages/EmploiPage";
import AdminLayout from "./layouts/AdminLayout";
import AppreciationsForm from "./components/AppreciationsForm";


function PrivateRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}

function DashboardRouter() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "enseignant") return <EnseignantDashboard />;
  if (user.role === "etudiant") return <EleveDashboard />;
  
  return <div>Rôle inconnu</div>;
}

function App() {
  return (
    
    <Router>
      <ToastContainer position="top-right" />
      <Routes>
        {/* route publique */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* routes nécessitant authentification */}
        <Route path="/" element={<PrivateRoute allowedRoles={["admin","enseignant","etudiant"]}><AdminLayout /></PrivateRoute>}>
          {/* Dashboard */}
          <Route index element={<DashboardRouter />} />

          {/* routes d'administration*/}
          <Route path="admin/classes" element={<ClassList />} />
          <Route path="admin/classes/new" element={<ClasseForm />} />
          <Route path="admin/classes/edit/:id" element={<ClasseForm />} />

          <Route path="admin/teachers" element={<TeacherList />} />
          <Route path="admin/teachers/new" element={<TeacherForm />} />
          <Route path="admin/teachers/edit/:id" element={<TeacherForm />} />

          <Route path="admin/matieres" element={<MatiereList />} />
          <Route path="admin/matieres/new" element={<MatiereForm />} />
          <Route path="admin/matieres/edit/:id" element={<MatiereForm />} />

          <Route path="admin/eleves" element={<EleveList />} />
          <Route path="admin/eleves/new" element={<EleveForm />} />
          <Route path="admin/eleves/edit/:id" element={<EleveForm />} />

          <Route path="admin/semestres" element={<SemestreList />} />
          <Route path="admin/semestres/new" element={<SemestreForm />} />
          <Route path="admin/semestres/edit/:id" element={<SemestreForm />} />

          <Route path="admin/notes" element={<NoteList />} />
          <Route path="admin/notes/new" element={<NoteForm />} />
          <Route path="admin/notes/edit/:id" element={<NoteForm />} />

          <Route path="admin/moyennes" element={<MoyenneList />} />

          <Route path="admin/bulletins/:classeId" element={<BulletinSemestre />} />

          <Route path="admin/bulletin/:id" element={<BulletinEleve />} />
          <Route path="admin/appreciations/:id" element={<AppreciationsForm />} />

          {/* routes enseignants*/}
          <Route path="teachers/cours" element={<CoursList />} />
          <Route path="teachers/cours/new" element={<CoursForm />} />

           <Route path="teachers/notes" element={<NoteList />} />

          <Route path="teachers/presences/:id" element={<PresenceForm />} />

          {/* autres*/}
          <Route path="admin/emplois" element={<EmploiDuTempsForm />} />

          <Route path="admin/assigne" element={<AssignSubjectsToTeacher />} />

          <Route path="admin/affiche/:enseignantId" element={<TeacherSubjectsList />} />

          <Route path="admin/pages" element={<EmploiPage />} />

        </Route>

        {/* route non autorisée*/}
        <Route path="/unauthorized" element={<div>Accès refusé</div>} />

      </Routes>
    </Router>
  );
}





export default App;

