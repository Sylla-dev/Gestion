// components/BulletinParClasse.jsx
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FaPrint } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

export default function BulletinParClasse() {
  const { classeId } = useParams();
  const [data, setData] = useState([]);
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    api.get(`/api/bulletins/classe/${classeId}`)
      .then(res => {
        setData(res.data.notes);
      });
  }, [classeId]);

  useEffect(() => {
    const group = {};
    data.forEach(note => {
      if (!group[note.eleve_id]) {
        group[note.eleve_id] = {
          nom: note.eleve_nom,
          prenom: note.eleve_prenom,
          classe: note.classe_nom,
          bulletins: [],
        };
      }
      group[note.eleve_id].bulletins.push(note);
    });
    setGrouped(group);
  }, [data]);

  const print = () => window.print();

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Bulletins de la classe</h2>
      <div className="mb-4 flex gap-4">
        <button onClick={print} className='bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2'>
          <FaPrint /> Imprimer
        </button>
        {/* Pour PDF, tu peux intégrer jsPDF ou html2pdf */}
      </div>

      {Object.entries(grouped).map(([eleveId, info]) => (
        <div key={eleveId} className='mb-6 border p-4 rounded shadow'>
          <h3 className='font-semibold text-lg'>{info.nom} {info.prenom} - Classe : {info.classe}</h3>
          <table className='w-full mt-2 border table-auto'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='border p-2'>Semestre</th>
                <th className='border p-2'>Matière</th>
                <th className='border p-2'>Note</th>
              </tr>
            </thead>
            <tbody>
              {info.bulletins.map((b, i) => (
                <tr key={i}>
                  <td className='border p-2'>{b.semestre_nom}</td>
                  <td className='border p-2'>{b.matiere_nom}</td>
                  <td className='border p-2 text-center'>{b.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
