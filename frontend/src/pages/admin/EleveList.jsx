import React, { useEffect, useState } from 'react';
import { getEleves, deleteEleve } from "../../services/eleveService";
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

export default function EleveList() {
  const [groupedEleves, setGroupedEleves] = useState({});
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({});
  const perPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getEleves().then((res) => {
      setGroupedEleves(res.data);
      const initialPagination = {};
      Object.keys(res.data).forEach(niveau => {
        initialPagination[niveau] = 1;
      });
      setPagination(initialPagination);
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      await deleteEleve(id);
      loadData();
    }
  };

  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());

  const handlePageChange = (niveau, page) =>
    setPagination(prev => ({ ...prev, [niveau]: page }));

  const filterEleves = (eleves) =>
    eleves.filter((e) =>
      `${e.nom} ${e.prenom} ${e.classe_nom}`.toLowerCase().includes(search)
    );

  return (
    <div className='p-4 sm:p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">Liste des élèves</h1>
        <Link
          to='/admin/eleves/new'
          className='btn btn-primary gap-2 text-sm sm:text-base'
        >
          <FaPlus />
        </Link>
      </div>

      {/* Barre de recherche */}
      <input
        type='text'
        placeholder='🔍 Rechercher un élève...'
        value={search}
        onChange={handleSearch}
        className='input input-bordered w-full sm:w-96 mb-8'
      />

      {/* Tableaux par niveau */}
      {Object.entries(groupedEleves).map(([niveau, eleves]) => {
        const filtered = filterEleves(eleves);
        const totalPages = Math.ceil(filtered.length / perPage);
        const currentPage = pagination[niveau] || 1;
        const startIndex = (currentPage - 1) * perPage;
        const currentEleves = filtered.slice(startIndex, startIndex + perPage);

        if (filtered.length === 0) return null;

        return (
          <div key={niveau} className="mb-6 card bg-base-100 p-4 shadow-md border">
            <h2 className="text-lg font-semibold text-primary mb-3">{niveau}</h2>

            {/* Tableau responsive */}
           {/* Vue tableau desktop */}
<div className="hidden md:block overflow-x-auto">
  <table className='table w-full text-sm'>
    <thead>
      <tr>
        <th>Matricule</th>
        <th>Nom</th>
        <th>Prénom</th>
        <th>Naissance</th>
        <th>Sexe</th>
        <th>Classe</th>
        <th className="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentEleves.map((e) => (
        <tr key={e.id} className="hover">
          <td>{e.matricule}</td>
          <td>{e.nom}</td>
          <td>{e.prenom}</td>
          <td>{new Date(e.date_naissance).toLocaleDateString()}</td>
          <td>{e.sexe}</td>
          <td>{e.classe_nom}</td>
          <td>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => navigate(`/admin/eleves/edit/${e.id}`)}
                className="btn btn-xs btn-primary"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                className="btn btn-xs btn-error"
              >
                <FaTrash />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Vue carte mobile */}
<div className="md:hidden grid grid-cols-1 gap-4">
  {currentEleves.map((e) => (
    <div key={e.id} className="card border shadow-sm bg-base-100">
      <div className="card-body p-4 text-sm">
        <h3 className="font-bold text-primary text-base">{e.nom} {e.prenom}</h3>
        <p><span className="font-semibold">Matricule :</span> {e.matricule}</p>
        <p><span className="font-semibold">Naissance :</span> {new Date(e.date_naissance).toLocaleDateString()}</p>
        <p><span className="font-semibold">Sexe :</span> {e.sexe}</p>
        <p><span className="font-semibold">Classe :</span> {e.classe_nom}</p>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => navigate(`/admin/eleves/edit/${e.id}`)}
            className="btn btn-xs btn-primary"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(e.id)}
            className="btn btn-xs btn-error"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


            {/* Pagination mobile */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => handlePageChange(niveau, n)}
                    className={`btn btn-sm ${currentPage === n ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
