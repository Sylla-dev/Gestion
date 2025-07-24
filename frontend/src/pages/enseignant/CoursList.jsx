import React, { useEffect, useState } from 'react';
import { getCoursPaged, deleteCours, getClasses } from '../../services/courService';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrashAlt, FaEdit, FaUserMinus } from 'react-icons/fa';

export default function CoursList() {
  const [cours, setCours] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCours, setTotalCours] = useState(0);
  const navigate = useNavigate();

  const limit = 10;

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchCours();
  }, [selectedClasse, currentPage]);

  const fetchClasses = async () => {
    const res = await getClasses();
    setClasses(res.data);
  };

  const fetchCours = async () => {
    try {
      const res = await getCoursPaged({
        classe_id: selectedClasse || undefined,
        page: currentPage,
        limit,
      });
      setCours(res.data.cours);
      setTotalCours(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression du cours ?")) return;
    await deleteCours(id);
    fetchCours();
  };

  const totalPages = Math.ceil(totalCours / limit);

  const groupedCours = cours.reduce((groups, c) => {
    const niveau = c.classe_niveau || 'Sans niveau';
    if (!groups[niveau]) groups[niveau] = [];
    groups[niveau].push(c);
    return groups;
  }, {});

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">📚 Liste des Cours</h1>
        <Link to="/teachers/cours/new" className="btn btn-primary gap-2 whitespace-nowrap">
          <FaPlus />
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <label className="label-text whitespace-nowrap">Filtrer par classe :</label>
        <select
          className="select select-bordered max-w-xs w-full sm:w-auto"
          value={selectedClasse}
          onChange={(e) => {
            setCurrentPage(1);
            setSelectedClasse(e.target.value);
          }}
        >
          <option value="">Toutes les classes</option>
          {Object.entries(
            classes.reduce((grouped, cls) => {
              if (!grouped[cls.niveau]) grouped[cls.niveau] = [];
              grouped[cls.niveau].push(cls);
              return grouped;
            }, {})
          ).map(([niveau, classesDuNiveau]) => (
            <optgroup key={niveau} label={niveau}>
              {classesDuNiveau.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.nom}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {Object.keys(groupedCours).length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Aucun cours disponible.</p>
      ) : (
        Object.entries(groupedCours).map(([niveau, coursDuNiveau]) => (
          <section key={niveau} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-1">{niveau}</h2>

            {/* TABLEAU pour desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead>
                  <tr>
                    <th>Classe</th>
                    <th>Matière</th>
                    <th>Enseignant</th>
                    <th>Date</th>
                    <th>Début</th>
                    <th>Fin</th>
                    <th>Contenu</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coursDuNiveau.map((c) => (
                    <tr key={c.id}>
                      <td>{c.classe_nom} ({c.classe_niveau})</td>
                      <td>{c.matiere_nom}</td>
                      <td>{c.enseignant_nom} {c.enseignant_prenom}</td>
                      <td>{new Date(c.date_cours).toLocaleDateString()}</td>
                      <td>{c.heure_debut}</td>
                      <td>{c.heure_fin}</td>
                      <td>{c.contenu}</td>
                      <td className="flex gap-2 justify-center">
                        <button
                          onClick={() => navigate(`/teachers/cours/edit/${c.id}`)}
                          className="btn btn-sm btn-outline btn-info"
                          aria-label="Éditer"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="btn btn-sm btn-outline btn-error"
                          aria-label="Supprimer"
                        >
                          <FaTrashAlt />
                        </button>
                        <button
                          onClick={() => navigate(`/teachers/presences/${c.id}`)}
                          className="btn btn-sm btn-outline btn-success"
                          aria-label="Gérer présences"
                        >
                          <FaUserMinus />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARTES pour mobile */}
            <div className="md:hidden space-y-4">
              {coursDuNiveau.map((c) => (
                <div
                  key={c.id}
                  className="card bg-base-200 shadow-sm border border-base-300"
                  role="group"
                  aria-label={`Cours de ${c.matiere_nom} en classe ${c.classe_nom}`}
                >
                  <div className="card-body p-4">
                    <h3 className="card-title text-primary text-lg mb-2">
                      {c.matiere_nom}
                    </h3>
                    <p><strong>Classe:</strong> {c.classe_nom} ({c.classe_niveau})</p>
                    <p><strong>Enseignant:</strong> {c.enseignant_nom} {c.enseignant_prenom}</p>
                    <p><strong>Date:</strong> {new Date(c.date_cours).toLocaleDateString()}</p>
                    <p><strong>Début - Fin:</strong> {c.heure_debut} - {c.heure_fin}</p>
                    <p><strong>Contenu:</strong> {c.contenu}</p>

                    <div className="card-actions justify-end mt-3 gap-2 flex-wrap">
                      <button
                        onClick={() => navigate(`/teachers/cours/edit/${c.id}`)}
                        className="btn btn-sm btn-info"
                        aria-label="Éditer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="btn btn-sm btn-error"
                        aria-label="Supprimer"
                      >
                        <FaTrashAlt />
                      </button>
                      <button
                        onClick={() => navigate(`/teachers/presences/${c.id}`)}
                        className="btn btn-sm btn-success"
                        aria-label="Gérer présences"
                      >
                        <FaUserMinus />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
