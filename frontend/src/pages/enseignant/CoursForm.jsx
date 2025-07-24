import React, { useEffect, useState } from 'react';
import { getClasses } from '../../services/classeService';
import { getMatieres } from '../../services/matiereService';
import { getTeachers } from '../../services/teacherService';
import { useNavigate } from 'react-router-dom';
import { createCour } from '../../services/courService';
import {
  FaChalkboardTeacher, FaBook, FaUserGraduate,
  FaCalendarAlt, FaClock, FaStickyNote
} from 'react-icons/fa';

export default function CoursForm() {
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [form, setForm] = useState({
    classe_id: '',
    matiere_id: '',
    enseignant_id: '',
    date_cours: '',
    heure_debut: '',
    heure_fin: '',
    contenu: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    getClasses().then((res) => setClasses(res.data));
    getMatieres().then((res) => setMatieres(res.data));
    getTeachers().then((res) => setEnseignants(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCour(form);
    navigate('/teachers/cours');
  };

  const classesGrouped = classes.reduce((acc, c) => {
    if (!acc[c.niveau]) acc[c.niveau] = [];
    acc[c.niveau].push(c);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="card shadow-md bg-base-100 p-6 max-w-2xl mx-auto mt-8 space-y-5">
      <h2 className="text-2xl font-bold text-center">📘 Ajouter un cours</h2>

      {/* Classe */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <FaUserGraduate /> Classe
          </span>
        </label>
        <select
          name="classe_id"
          value={form.classe_id}
          onChange={handleChange}
          required
          className="select select-bordered"
        >
          <option value="">-- Choisir une classe --</option>
          {Object.entries(classesGrouped).map(([niveau, clsList]) => (
            <optgroup key={niveau} label={niveau}>
              {clsList.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Enseignant */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <FaChalkboardTeacher /> Enseignant
          </span>
        </label>
        <select
          name="enseignant_id"
          value={form.enseignant_id}
          onChange={handleChange}
          required
          className="select select-bordered"
        >
          <option value="">-- Choisir un enseignant --</option>
          {enseignants.map(e => (
            <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
          ))}
        </select>
      </div>

      {/* Matière */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <FaBook /> Matière
          </span>
        </label>
        <select
          name="matiere_id"
          value={form.matiere_id}
          onChange={handleChange}
          required
          className="select select-bordered"
        >
          <option value="">-- Choisir une matière --</option>
          {matieres.map(m => (
            <option key={m.id} value={m.id}>{m.nom}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <FaCalendarAlt /> Date du cours
          </span>
        </label>
        <input
          type="date"
          name="date_cours"
          value={form.date_cours}
          onChange={handleChange}
          required
          className="input input-bordered"
        />
      </div>

      {/* Heure début */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <FaClock /> Heure de début
          </span>
        </label>
        <input
          type="time"
          name="heure_debut"
          value={form.heure_debut}
          onChange={handleChange}
          required
          className="input input-bordered"
        />
      </div>

      {/* Heure fin */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <FaClock className="rotate-90" /> Heure de fin
          </span>
        </label>
        <input
          type="time"
          name="heure_fin"
          value={form.heure_fin}
          onChange={handleChange}
          required
          className="input input-bordered"
        />
      </div>

      {/* Contenu */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <FaStickyNote /> Contenu / thème
          </span>
        </label>
        <textarea
          name="contenu"
          value={form.contenu}
          onChange={handleChange}
          rows={3}
          placeholder="Contenu du cours"
          className="textarea textarea-bordered resize-none"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full text-lg font-semibold"
      >
        ✅ Ajouter le cours
      </button>
    </form>
  );
}
