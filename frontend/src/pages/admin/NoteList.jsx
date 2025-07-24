import React, { useEffect, useState } from 'react';
import { getNotes, deleteNote } from '../../services/noteService';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { SiVbulletin } from 'react-icons/si';

export default function NoteList() {
  const [groupedNotes, setGroupedNotes] = useState({});
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getNotes();
      const notes = res.data;
      const groupByNiveau = notes.reduce((acc, n) => {
        const niveau = n.niveau || 'Autre';
        if (!acc[niveau]) acc[niveau] = [];
        acc[niveau].push(n);
        return acc;
      }, {});
      setGroupedNotes(groupByNiveau);
    } catch (error) {
      console.error("Erreur de chargement des notes", error);
    }
  };

  const confirmDelete = async () => {
    await deleteNote(selectedNoteId);
    setSelectedNoteId(null);
    load();
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">📊 Liste des Notes par Niveau</h1>
        <Link to="/admin/notes/new" className="btn btn-primary gap-2">
          <FaPlus /> Ajouter une note
        </Link>
      </div>

      {Object.keys(groupedNotes).map((niveau) => (
        <div key={niveau} className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
            🎓 Niveau : {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
          </h2>

          {/* TABLEAU – Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table table-zebra w-full shadow-sm text-sm">
              <thead className="bg-base-200">
                <tr>
                  <th>Élève</th>
                  <th>Matière</th>
                  <th>Semestre</th>
                  <th>Contrôle</th>
                  <th>Note</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedNotes[niveau].map((n) => (
                  <tr key={n.id}>
                    <td>{n.eleve_nom} {n.prenom}</td>
                    <td>{n.matiere_nom}</td>
                    <td>{n.semestre_nom}</td>
                    <td>{n.type}</td>
                    <td className="text-center font-bold">{n.note}</td>
                    <td className="flex justify-center gap-2">
                      <Link to={`/admin/notes/edit/${n.id}`} className="btn btn-sm btn-warning btn-outline">
                        <FaEdit />
                      </Link>
                      <button onClick={() => setSelectedNoteId(n.id)} className="btn btn-sm btn-error btn-outline">
                        <FaTrash />
                      </button>
                      <button onClick={() => navigate(`/admin/bulletin/${n.id}`)} className="btn btn-sm btn-info btn-outline">
                        <SiVbulletin />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARTES – Mobile */}
          <div className="md:hidden space-y-4">
            {groupedNotes[niveau].map((n) => (
              <div key={n.id} className="card shadow-md bg-base-100 border border-base-200">
                <div className="card-body p-4 text-sm">
                  <h3 className="font-semibold text-base text-primary">{n.eleve_nom} {n.prenom}</h3>
                  <p><span className="font-semibold">Matière :</span> {n.matiere_nom}</p>
                  <p><span className="font-semibold">Semestre :</span> {n.semestre_nom}</p>
                  <p><span className="font-semibold">Contrôle :</span> {n.type}</p>
                  <p className="font-bold text-xl text-right text-success">{n.note}</p>
                  <div className="card-actions justify-end mt-3">
                    <Link to={`/admin/notes/edit/${n.id}`} className="btn btn-sm btn-warning btn-outline">
                      <FaEdit />
                    </Link>
                    <button onClick={() => setSelectedNoteId(n.id)} className="btn btn-sm btn-error btn-outline">
                      <FaTrash />
                    </button>
                    <button onClick={() => navigate(`/admin/bulletin/${n.id}`)} className="btn btn-sm btn-info btn-outline">
                      <SiVbulletin />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal de confirmation DaisyUI */}
      <dialog id="deleteModal" className="modal" open={selectedNoteId !== null}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-red-600">Confirmation</h3>
          <p className="py-4">Voulez-vous vraiment supprimer cette note ?</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setSelectedNoteId(null)}>Annuler</button>
            <button className="btn btn-error" onClick={confirmDelete}>Supprimer</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedNoteId(null)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
