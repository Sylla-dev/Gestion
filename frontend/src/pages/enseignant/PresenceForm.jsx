import { api } from '../../services/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserCheck, FaUserTimes, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PresenceForm() {
  const { id } = useParams();
  const coursId = id;
  const [groupedEleves, setGroupedEleves] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        const res = await api.get(`/api/presences/${coursId}`);
        const data = res.data;
        const formatted = {};

        for (const niveau in data) {
          formatted[niveau] = data[niveau].map(e => ({
            ...e,
            present: e.present === null ? true : Boolean(e.present),
            remarque: e.remarque || '',
          }));
        }

        setGroupedEleves(formatted);
      } catch (err) {
        console.error('Erreur lors du chargement des présences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPresences();
  }, [coursId]);

  const togglePresence = (niveau, index) => {
    const updated = { ...groupedEleves };
    updated[niveau][index].present = !updated[niveau][index].present;
    setGroupedEleves(updated);
  };

  const handleChange = (niveau, index, value) => {
    const updated = { ...groupedEleves };
    updated[niveau][index].remarque = value;
    setGroupedEleves(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allPresences = Object.values(groupedEleves).flat();

    try {
      await api.post(`/api/presences/${coursId}`, {
        presences: allPresences,
      });
      alert('✅ Présences enregistrées avec succès.');
    } catch (error) {
      alert('❌ Erreur lors de l’enregistrement.');
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    Object.entries(groupedEleves).forEach(([niveau, eleves]) => {
      doc.text(`Niveau : ${niveau}`, 14, y);
      autoTable(doc, {
        startY: y + 5,
        head: [['Nom', 'Prénom', 'Présent', 'Remarque']],
        body: eleves.map(e => [
          e.nom,
          e.prenom,
          e.present ? '✔️' : '❌',
          e.remarque || '',
        ]),
      });
      y = doc.lastAutoTable.finalY + 10;
    });

    doc.save('feuille-presence.pdf');
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-lg text-gray-500">
        Chargement de la feuille de présence...
        <span className="loading loading-dots loading-md ml-2"></span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8 bg-base-100 shadow-md rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-primary">
          <FaUserCheck /> Feuille de présence
        </h2>
        <button
          type="button"
          onClick={handleExportPDF}
          className="btn btn-sm btn-error"
        >
          <FaFilePdf className="mr-2" /> Exporter PDF
        </button>
      </div>

      {Object.entries(groupedEleves).map(([niveau, eleves]) => (
        <div key={niveau}>
          <h3 className="text-lg font-semibold text-blue-600 mb-4">
            📚 Niveau : {niveau}
          </h3>

          {/* Vue TABLEAU sur grand écran */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table table-zebra w-full border border-base-300 rounded-box">
              <thead className="bg-base-200">
                <tr>
                  <th>Élève</th>
                  <th className="text-center">Présence</th>
                  <th>Remarque</th>
                </tr>
              </thead>
              <tbody>
                {eleves.map((e, index) => (
                  <tr key={e.eleve_id}>
                    <td>{e.nom} {e.prenom}</td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => togglePresence(niveau, index)}
                        className={`btn btn-sm rounded-full ${
                          e.present ? 'btn-success' : 'btn-outline btn-error'
                        }`}
                        title={e.present ? 'Présent' : 'Absent'}
                      >
                        {e.present ? <FaUserCheck /> : <FaUserTimes />}
                      </button>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input input-bordered w-full input-sm"
                        placeholder="Remarque"
                        value={e.remarque}
                        onChange={(ev) => handleChange(niveau, index, ev.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vue MOBILE en cards */}
          <div className="md:hidden space-y-4">
            {eleves.map((e, index) => (
              <div key={e.eleve_id} className="card bg-base-100 shadow border border-base-200">
                <div className="card-body p-4 space-y-2">
                  <h4 className="font-bold text-primary">{e.nom} {e.prenom}</h4>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Présence :</span>
                    <button
                      type="button"
                      onClick={() => togglePresence(niveau, index)}
                      className={`btn btn-sm ${
                        e.present ? 'btn-success' : 'btn-outline btn-error'
                      }`}
                    >
                      {e.present ? <FaUserCheck /> : <FaUserTimes />}
                    </button>
                  </div>

                  <input
                    type="text"
                    className="input input-bordered input-sm w-full"
                    placeholder="Remarque"
                    value={e.remarque}
                    onChange={(ev) => handleChange(niveau, index, ev.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-end">
        <button type="submit" className="btn btn-success">
          💾 Enregistrer les présences
        </button>
      </div>
    </form>
  );
}
