import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createClass, getClassById, updateClass } from '../../services/classeService';
import { FaSave, FaPlus, FaArrowLeft } from 'react-icons/fa';

export default function ClasseForm() {
  const [formData, setFormData] = useState({
    nom: '',
    niveau: '',
    annee_scolaire: ''
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      getClassById(id)
        .then((res) => setFormData(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isEditing ? updateClass(id, formData) : createClass(formData);

    action
      .then(() => navigate('/admin/classes'))
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-base-100 rounded-lg shadow-lg border border-base-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">
          {isEditing ? 'Modifier une classe' : 'Ajouter une classe'}
        </h2>
        <button
          onClick={() => navigate('/admin/classes')}
          className="btn btn-ghost btn-sm gap-2 flex items-center normal-case"
        >
          <FaArrowLeft /> Retour
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="form-control w-full">
          <label htmlFor="nom" className="label">
            <span className="label-text font-semibold">Nom de la classe</span>
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            placeholder="Ex: 6ème A"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control w-full">
          <label htmlFor="niveau" className="label">
            <span className="label-text font-semibold">Niveau</span>
          </label>
          <input
            type="text"
            id="niveau"
            name="niveau"
            value={formData.niveau}
            onChange={handleChange}
            required
            placeholder="Ex: Collège"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control w-full">
          <label htmlFor="annee_scolaire" className="label">
            <span className="label-text font-semibold">Année scolaire</span>
          </label>
          <input
            type="text"
            id="annee_scolaire"
            name="annee_scolaire"
            value={formData.annee_scolaire}
            onChange={handleChange}
            required
            placeholder="2024-2025"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn btn-primary btn-block gap-2"
          >
            {isEditing ? <FaSave /> : <FaPlus />}
            {isEditing ? 'Enregistrer les modifications' : 'Ajouter la classe'}
          </button>
        </div>
      </form>
    </div>
  );
}
