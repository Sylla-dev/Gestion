import React, { useEffect, useState } from 'react';
import { createSemestre, getSemestreById, updateSemestre } from '../../services/semestreService';
import { useNavigate, useParams } from 'react-router-dom';

export default function SemestreForm() {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nom: '',
        annee_scolaire: '',
    });

    useEffect(() => {
        if (isEditing) {
            getSemestreById(id).then((res) => setForm(res.data));
        }
    }, [id]);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = isEditing ? updateSemestre(id, form) : createSemestre(form);
        action.then(() => navigate("/admin/semestres"));
    };

  return (
    <div className='p-6 max-w-xl mx-auto'>
        <h1 className="text-xl font-bold">
            {isEditing ? "Modifier un semestre" : "Ajouter un semestre"}
        </h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
            <input 
             type='text'
             name='nom'
             value={form.nom}
             onChange={handleChange}
             placeholder='Nom (ex: Semestre 1)'
             required
             className='w-full border px-3 py-2 rounded'
           />  
            <input 
             type='text'
             name='annee_scolaire'
             value={form.annee_scolaire}
             placeholder='Annee scolaire (ex: 2024-2025)'
             onChange={handleChange}
             required
             className='w-full border px-3 py-2 rounded'
           />
           <button type='submit' className='bg-green-600 text-white px-4 py-2 rounded cursor-pointer'>
            {isEditing ? "Mettre a jour" : "Ajouter"}
           </button>
        </form>
    </div>
  );
}
