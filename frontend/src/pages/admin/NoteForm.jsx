import React, { useEffect, useState } from 'react';
import { createNote } from '../../services/noteService';
import { getEleves } from '../../services/eleveService';
import { getMatieres } from '../../services/matiereService';
import { getSemestres } from '../../services/semestreService';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';

export default function NoteForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    eleve_id: '',
    matiere_id: '',
    semestre_id: '',
    type: '',
    note: '',
  });

  const [eleves, setEleves] = useState({});
  const [matieres, setMatieres] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getEleves(), getMatieres(), getSemestres()])
      .then(([resEleves, resMatieres, resSemestres]) => {
        setEleves(resEleves.data || {});
        setMatieres(resMatieres.data || []);
        setSemestres(resSemestres.data || []);
      })
      .catch((err) => {
        console.error('Erreur chargement des données :', err);
        setError('Impossible de charger les données.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    return form.eleve_id && form.matiere_id && form.semestre_id && form.type && form.note !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNote(form);
      navigate('/admin/notes');
    } catch (err) {
      console.error('Erreur création note :', err);
      setError("Erreur lors de l'enregistrement de la note.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Chargement des données...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">📝 Ajouter une Note</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Élève */}
        <div>
          <label className="block mb-1 font-semibold">Élève</label>
          <select
            name="eleve_id"
            value={form.eleve_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">-- Choisir un élève --</option>
            {Object.entries(eleves).map(([niveau, liste]) => (
              <optgroup key={niveau} label={`Niveau ${niveau}`}>
                {liste.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nom} {e.prenom} ({e.classe_nom})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Matière */}
        <div>
          <label className="block mb-1 font-semibold">Matière</label>
          <select
            name="matiere_id"
            value={form.matiere_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">-- Choisir une matière --</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Semestre */}
        <div>
          <label className="block mb-1 font-semibold">Semestre</label>
          <select
            name="semestre_id"
            value={form.semestre_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">-- Choisir un semestre --</option>
            {semestres.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nom} - {s.annee_scolaire}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Controle</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">-- Choisir --</option>
            <option value="exament">Evaluation</option>
            <option value="oral">Oral</option>
            <option value="controle">Devoire</option>
          </select>
        </div>

        {/* Note */}
        <div>
          <label className="block mb-1 font-semibold">Note (sur 20)</label>
          <input
            type="number"
            step="0.01"
            name="note"
            value={form.note}
            onChange={handleChange}
            min="0"
            max="20"
            required
            placeholder="Ex : 15.5"
            className="input input-bordered w-full"
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-full gap-2"
          disabled={!isFormValid()}
        >
          <FaSave />
          Enregistrer la note
        </button>
      </form>
    </div>
  );
}
