import React, { useEffect, useState } from 'react';
import { getMoyennes } from '../../services/statistiqueService';

export default function MoyenneList() {
  const [moyennes, setMoyennes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    getMoyennes()
      .then((res) => {
        setMoyennes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setErreur("Erreur lors du chargement des moyennes.");
        setLoading(false);
        console.error(err);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📊 Moyennes par matière et semestre</h1>

      {loading && (
        <div className="text-center text-blue-500 font-medium">Chargement des données...</div>
      )}

      {erreur && (
        <div className="text-red-500 bg-red-100 p-2 rounded mb-4">{erreur}</div>
      )}

      {!loading && !erreur && (
        <div className="overflow-x-auto shadow rounded">
          <table className="w-full border-collapse text-sm text-gray-700">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3 border">Élève</th>
                <th className="p-3 border">Matière</th>
                <th className="p-3 border">Semestre</th>
                <th className="p-3 border">Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {moyennes.length > 0 ? (
                moyennes.map((m) => (
                  <tr key={`${m.id}-${m.eleve_nom}`} className="hover:bg-gray-100">
                    <td className="p-3 border">{m.eleve_nom}</td>
                    <td className="p-3 border">{m.matiere_nom}</td>
                    <td className="p-3 border">{m.semestre_nom}</td>
                    <td
                      className={`p-3 border font-semibold ${
                        m.moyenne >= 10 ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {m.moyenne.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 p-4">
                    Aucune moyenne disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
