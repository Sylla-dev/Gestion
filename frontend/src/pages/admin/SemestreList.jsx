import React, { useEffect, useState } from 'react';
import { getSemestres, deleteSemestre } from "../../services/semestreService";
import { Link } from 'react-router-dom';

export default function SemestreList() {
    const [semestres, setSemestres] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        getSemestres().then((res) => setSemestres(res.data));
    };

    const handleDelete = (id) => {
        if (window.confirm("Supprimer ce semestre ?")) {
            deleteSemestre(id).then(loadData);
        }
    };


  return (
    <div className='p-6'>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Liste des semestres</h1>
            <Link to="/admin/semestres/new" className='bg-blue-600 text-white px-4 py-2 rounded cursor-pointer'>
              + Ajouter
            </Link>
        </div>

       <table className='w-full border text-sm'>
        <thead className="bg-gray-100">
            <tr>
                <th className='p-2 border'>Nom</th>
                <th className='p-2 border'>Annee scolaire</th>
                <th className='p-2 border'>Actions</th>
            </tr>
        </thead>
        <tbody>
            {semestres.map((s) => (
                <tr key={s.id}>
                    <td className='p-2 border'>{s.nom}</td>
                    <td className='p-2 border'>{s.annee_scolaire}</td>
                    <td className='p-2 border'>
                        <Link to={`/admin/semestres/edit/${s.id}`} className='bg-yellow-400 px-2 py-1 rounded mr-2 text-white cursor-pointer'>
                          Modifier
                        </Link>
                        <button onClick={() => handleDelete(s.id) } className='bg-red-500 text-white px-2 py-1 rounded cursor-pointer'>
                            Supprimer
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
       </table>

    </div>
  );
}
