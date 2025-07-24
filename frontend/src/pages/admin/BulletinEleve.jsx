import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FaAward, FaUser, FaGraduationCap } from 'react-icons/fa';

export default function BulletinEleve() {
  const [eleves, setEleves] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [bulletin, setBulletin] = useState(null);
  const [localAppreciations, setLocalAppreciations] = useState({});

  useEffect(() => {
    api.get('/api/eleves')
      .then(res => setEleves(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedId) {
      api.get(`/api/bulletins/${selectedId}`)
        .then(res => setBulletin(res.data))
        .catch(err => console.error(err));
    } else {
      setBulletin(null);
    }
  }, [selectedId]);

   // Sync avec le backend
  useEffect(() => {
    if (bulletin?.appreciations) {
      const map = {};
      bulletin.appreciations.forEach(a => {
        map[a.semestre_id] = a.appreciation;
      });
      setLocalAppreciations(map);
    }
  }, [bulletin]);

  const handleAppreciationChange = (semestreId, value) => {
    setLocalAppreciations(prev => ({
      ...prev,
      [semestreId]: value,
    }));
  };

  const saveAppreciations = async () => {
    try {
      const data = Object.entries(localAppreciations).map(([semestre, appreciation]) => ({
        semestre,
        appreciation,
      }));
      await api.post(`/api/appreciations/${selectedId}`, { appreciations: data });
      alert("✅ Appréciations mises à jour !");
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de la sauvegarde.");
    }
  };

  const groupBySemestre = (notes) => {
    return notes.reduce((acc, note) => {
      if (!acc[note.semestre_nom]) acc[note.semestre_nom] = [];
      acc[note.semestre_nom].push(note);
      return acc;
    }, {});
  };

  const tousLesEleves = Array.isArray(eleves) ? eleves : Object.values(eleves).flat();

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary">Bulletin scolaire par élève</h1>

      {/* Sélecteur élève */}
      <select
        className="select select-bordered w-full max-w-md"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">-- Sélectionnez un élève --</option>
        {tousLesEleves.map(e => (
          <option key={e.id} value={e.id}>
            {e.nom} {e.prenom}
          </option>
        ))}
      </select>

      {/* Affichage du bulletin */}
      {bulletin && (
        <div className="card bg-base-100 shadow-md border border-base-300 p-4 sm:p-6 rounded-lg print:bg-white print:border-none print:shadow-none">
          {/* Infos générales */}
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <FaUser className="text-primary" /> {bulletin.notes[0].eleve_nom} {bulletin.notes[0].eleve_prenom}
              </h2>
              <p className="flex items-center gap-2 mt-1">
                <FaGraduationCap className="text-primary" /> Classe : {bulletin.notes[0].classe_nom}
              </p>
              <p className="mt-1 text-sm text-base-content/70">
                Année scolaire : {bulletin.notes[0].annee_scolaire}
              </p>
            </div>
            <div className="text-right mt-6">
            <button onClick={saveAppreciations} className="btn btn-primary">
              💾 Sauvegarder les appréciations
            </button>
          </div>
          </div>

          {/* Notes par semestre */}
          {Object.entries(groupBySemestre(bulletin.notes)).map(([semestre, notes]) => {
            const rang = bulletin.rangs.find(r => r.semestre_id === notes[0].semestre_id);
            const appreciation = bulletin.appreciations.find(a => a.semestre_id === notes[0].semestre_id);

            return (
              <div key={semestre} className="mb-8">
                <h3 className="text-base sm:text-lg font-bold mb-3 border-b border-primary pb-1">{semestre}</h3>

                {/* Table responsive */}
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full text-sm">
                    <thead>
                      <tr>
                        <th>Matière</th>
                        <th className="text-center">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notes.map((n, idx) => (
                        <tr key={idx}>
                          <td>{n.matiere_nom}</td>
                          <td className="text-center">{n.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Résumé */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-6">
                  <p className="font-semibold">Moyenne : {rang?.moyenne ?? '—'}</p>
                  <p className="font-semibold flex items-center gap-2">
                    <FaAward className="text-yellow-500" /> Rang : {rang?.rang ?? '—'} / {rang?.total ?? '—'}
                  </p>

                  <div className="mt-2 w-full">
                    <label className="text-sm font-semibold text-base-content/80">
                      Appréciation semestre
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full mt-1"
                      rows={3}
                      value={localAppreciations[notes[0].semestre_id] || ""}
                      onChange={(e) =>
                        handleAppreciationChange(notes[0].semestre_id, e.target.value)
                      }
                    />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
