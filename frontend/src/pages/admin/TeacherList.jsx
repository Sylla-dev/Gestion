import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTeachers, deleteTeacher } from '../../services/teacherService';
import { FaChalkboardTeacher, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await getTeachers();
      setTeachers(res.data || []);
    } catch (err) {
      console.error('Erreur de chargement :', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression de cet enseignant ?')) {
      await deleteTeacher(id);
      await fetchTeachers();
    }
  };

  const grouped = Array.isArray(teachers)
    ? teachers.reduce((acc, teacher) => {
        const key = teacher.specialite || 'Autres';
        acc[key] = acc[key] || [];
        acc[key].push(teacher);
        return acc;
      }, {})
    : {};

  const filteredGroups = Object.entries(grouped).filter(([specialite, enseignants]) =>
    specialite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enseignants.some((e) =>
      `${e.nom} ${e.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700">📚 Enseignants par spécialité</h2>
        <Link
          to='/admin/teachers/new'
          className='btn btn-primary gap-2'
        >
          <FaPlus />
        </Link>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="🔍 Rechercher un enseignant ou une spécialité..."
        className="input input-bordered w-full sm:w-80 mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Résultat */}
      {filteredGroups.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Aucun enseignant trouvé.</p>
      ) : (
        filteredGroups.map(([specialite, enseignants]) => (
          <div key={specialite} className="mb-10">
            <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">
              🧪 Spécialité : {specialite}
            </h3>

            {/* TABLEAU - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table table-zebra w-full min-w-[600px] text-sm">
                <thead className="bg-base-200">
                  <tr>
                    <th>Matricule</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Recruté le</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enseignants.map((t) => (
                    <tr key={t.id}>
                      <td>{t.matricule}</td>
                      <td>{t.nom}</td>
                      <td>{t.prenom}</td>
                      <td>{t.email}</td>
                      <td>{t.telephone}</td>
                      <td>{new Date(t.date_recrutement).toLocaleDateString()}</td>
                      <td>
                        <div className="flex justify-center gap-2 flex-wrap">
                          <button onClick={() => navigate(`/admin/teachers/edit/${t.id}`)} className="btn btn-sm btn-outline btn-info">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(t.id)} className="btn btn-sm btn-outline btn-error">
                            <FaTrash />
                          </button>
                          <button onClick={() => navigate(`/admin/affiche/${t.id}`)} className="btn btn-sm btn-outline">
                            <FaChalkboardTeacher />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARTES - Mobile */}
            <div className="md:hidden space-y-4">
              {enseignants.map((t) => (
                <div key={t.id} className="card shadow-md bg-base-100 border border-base-300">
                  <div className="card-body p-4 text-sm">
                    <h3 className="card-title text-base text-primary">{t.nom} {t.prenom}</h3>
                    <p><strong>Matricule:</strong> {t.matricule}</p>
                    <p><strong>Email:</strong> {t.email}</p>
                    <p><strong>Téléphone:</strong> {t.telephone}</p>
                    <p><strong>Recruté le:</strong> {new Date(t.date_recrutement).toLocaleDateString()}</p>
                    <div className="card-actions justify-end mt-2">
                      <button onClick={() => navigate(`/admin/teachers/edit/${t.id}`)} className="btn btn-sm btn-outline btn-info">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="btn btn-sm btn-outline btn-error">
                        <FaTrash />
                      </button>
                      <button onClick={() => navigate(`/admin/affiche/${t.id}`)} className="btn btn-sm btn-outline">
                        <FaChalkboardTeacher />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))
      )}
    </div>
  );
}
