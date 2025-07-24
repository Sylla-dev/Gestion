import React, { useEffect, useState } from 'react';
import { Eye, List, Calendar, Edit, Trash } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { api } from '../services/api';

const daysMap = {
  Lundi: 1,
  Mardi: 2,
  Mercredi: 3,
  Jeudi: 4,
  Vendredi: 5,
  Samedi: 6,
  Dimanche: 0
};

export default function EmploiDuTempsManager() {
  const [groupedClasses, setGroupedClasses] = useState({});
  const [selectedClassId, setSelectedClassId] = useState('');
  const [courses, setCourses] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/api/classes')
      .then(res => {
        const grouped = res.data.reduce((acc, classe) => {
          if (!acc[classe.niveau]) acc[classe.niveau] = [];
          acc[classe.niveau].push(classe);
          return acc;
        }, {});
        setGroupedClasses(grouped);

        const firstLevel = Object.keys(grouped)[0];
        if (firstLevel && grouped[firstLevel][0]) {
          setSelectedClassId(grouped[firstLevel][0].id);
        } else {
          setSelectedClassId('');
        }
      })
      .catch(() => setError("Erreur lors du chargement des classes."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedClassId) return setCourses([]);
    setLoading(true);
    api.get(`/api/emplois/classe/${selectedClassId}`)
      .then(res => setCourses(res.data))
      .catch(() => setError("Erreur lors du chargement des cours."))
      .finally(() => setLoading(false));
  }, [selectedClassId]);

  const getDateForDay = (dayName) => {
    const dayIndex = daysMap[dayName];
    const now = new Date();
    const diff = dayIndex - now.getDay();
    const target = new Date(now);
    target.setDate(now.getDate() + diff);
    return target.toISOString().split('T')[0];
  };

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
        <h1 className='text-2xl font-bold'>Emploi du Temps</h1>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className='select select-bordered w-full sm:w-64'
        >
          {Object.keys(groupedClasses).length === 0 && <option>Aucune classe</option>}
          {Object.entries(groupedClasses).map(([level, classes]) => (
            <optgroup label={`Niveau ${level}`} key={level}>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Boutons de vue */}
      <div className='flex gap-4'>
        <button onClick={() => setViewMode("table")} className={`btn btn-sm btn-outline ${viewMode === "table" ? "btn-primary" : ""}`}>
          <List size={18} /> Tableau
        </button>
        <button onClick={() => setViewMode("calendar")} className={`btn btn-sm btn-outline ${viewMode === "calendar" ? "btn-primary" : ""}`}>
          <Calendar size={18} /> Calendrier
        </button>
      </div>

      {/* Messages d'état */}
      {loading && <div className="text-info">Chargement...</div>}
      {error && <div className="text-error">{error}</div>}

      {/* Vue Tableau Desktop */}
      {viewMode === "table" && !loading && courses.length > 0 && (
        <>
          {/* Desktop : tableau */}
          <div className='hidden md:block overflow-auto border rounded-lg shadow'>
            <table className='table table-zebra w-full'>
              <thead className='bg-base-200 text-base-content'>
                <tr>
                  <th>Jour</th>
                  <th>Heure</th>
                  <th>Matière</th>
                  <th>Enseignant</th>
                  <th>Salle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id}>
                    <td>{c.jour_semaine}</td>
                    <td>{c.heure_debut} - {c.heure_fin}</td>
                    <td>{c.matiere}</td>
                    <td>{c.enseignant}</td>
                    <td>{c.salle}</td>
                    <td className='flex gap-2'>
                      <button className='btn btn-xs btn-primary'><Edit size={14} /></button>
                      <button className='btn btn-xs btn-error'><Trash size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile : cards */}
          <div className="md:hidden space-y-4">
            {courses.map(c => (
              <div key={c.id} className="card shadow bg-base-100 border border-base-200">
                <div className="card-body p-4 space-y-1">
                  <h2 className="card-title text-lg">{c.matiere}</h2>
                  <p><strong>Jour :</strong> {c.jour_semaine}</p>
                  <p><strong>Heure :</strong> {c.heure_debut} - {c.heure_fin}</p>
                  <p><strong>Enseignant :</strong> {c.enseignant}</p>
                  <p><strong>Salle :</strong> {c.salle}</p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button className="btn btn-xs btn-primary"><Edit size={14} /></button>
                    <button className="btn btn-xs btn-error"><Trash size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Vue calendrier */}
      {viewMode === "calendar" && !loading && courses.length > 0 && (
        <div className="bg-base-100 rounded-xl shadow overflow-hidden">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView='timeGridWeek'
            allDaySlot={false}
            events={courses.map(c => {
              const date = getDateForDay(c.jour_semaine);
              return {
                title: `${c.matiere} - ${c.enseignant}`,
                start: date ? `${date}T${c.heure_debut}` : null,
                end: date ? `${date}T${c.heure_fin}` : null,
              };
            }).filter(e => e.start)}
            height="auto"
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            locale="fr"
            nowIndicator
          />
        </div>
      )}
    </div>
  );
}
