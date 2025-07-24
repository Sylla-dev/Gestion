import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FaLink } from 'react-icons/fa';

export default function AssignSubjectsToTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    api.get('/api/enseignants')
      .then(res => setTeachers(res.data))
      .catch(() => setMessage({ text: "Erreur lors du chargement des enseignants.", type: "error" }));

    api.get('/api/matieres')
      .then(res => setSubjects(res.data))
      .catch(() => setMessage({ text: "Erreur lors du chargement des matières.", type: "error" }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeacher || selectedSubjects.length === 0) {
      setMessage({ text: "Sélectionnez un enseignant et au moins une matière.", type: "error" });
      return;
    }

    try {
      await api.post('/api/enseignant-matieres/assign', {
        enseignant_id: selectedTeacher,
        matiere_ids: selectedSubjects,
      });

      setMessage({ text: "Matières assignées avec succès !", type: "success" });
      setSelectedSubjects([]);
      setSelectedTeacher('');
    } catch (err) {
      setMessage({ text: "Erreur lors de l’assignation.", type: "error" });
      console.error(err);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-base-100 shadow-md rounded-lg p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
          <FaLink className="text-primary" /> Assigner des matières à un enseignant
        </h2>

        {message.text && (
          <div className={`alert mb-4 ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sélection enseignant */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Enseignant :</span>
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">-- Sélectionnez un enseignant --</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nom} {t.prenom} ({t.specialite || 'Sans spécialité'})
                </option>
              ))}
            </select>
          </div>

          {/* Sélection matières */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Matières :</span>
            </label>
            <select
              multiple
              value={selectedSubjects}
              onChange={(e) =>
                setSelectedSubjects(Array.from(e.target.selectedOptions, option => option.value))
              }
              className="select select-bordered w-full h-40 md:h-48"
            >
              {subjects.map(m => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>
            <span className="label-text-alt">
              Maintenez Ctrl (Cmd) pour sélection multiple.
            </span>
          </div>

          {/* Bouton submit */}
          <button type="submit" className="btn btn-primary w-full sm:w-auto">
            Lier les matières à l'enseignant
          </button>
        </form>
      </div>
    </div>
  );
}
