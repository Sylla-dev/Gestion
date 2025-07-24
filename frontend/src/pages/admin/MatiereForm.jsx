import React, { useEffect, useState } from 'react';
import { createMatiere, getMatiereById, updateMatiere } from '../../services/matiereService';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaPlus, FaPen } from 'react-icons/fa';
import { toast } from 'react-toastify'; // nécessite `npm install react-toastify`
import 'react-toastify/dist/ReactToastify.css';

export default function MatiereForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    nom: '',
    coef: 1,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      getMatiereById(id)
        .then((res) => setFormData(res.data))
        .catch((err) => console.error('Erreur de chargement :', err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const action = isEditing ? updateMatiere(id, formData) : createMatiere(formData);
    try {
      await action;
      toast.success(isEditing ? "Matière modifiée avec succès" : "Matière ajoutée !");
      navigate('/admin/matieres');
    } catch (err) {
      console.error('Erreur de sauvegarde :', err);
      toast.error("Une erreur s'est produite lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-base-100 shadow-xl rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        {isEditing ? (
          <>
            <FaPen className="text-primary text-xl" />
            <h2 className="text-2xl font-bold text-primary">Modifier une Matière</h2>
          </>
        ) : (
          <>
            <FaPlus className="text-success text-xl" />
            <h2 className="text-2xl font-bold text-success">Ajouter une Matière</h2>
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="form-control">
          <label htmlFor="nom" className="label">
            <span className="label-text">Nom de la matière</span>
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="Ex : Physique, Histoire..."
          />
        </div>

        <div className="form-control">
          <label htmlFor="coef" className="label">
            <span className="label-text">Coefficient</span>
          </label>
          <input
            type="number"
            name="coef"
            min="1"
            value={formData.coefficient}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control mt-4">
          <button
            type="submit"
            className={`btn btn-primary w-full flex items-center gap-2 ${
              loading ? 'btn-disabled' : ''
            }`}
          >
            <FaSave />
            {loading ? 'Sauvegarde en cours...' : isEditing ? 'Enregistrer les modifications' : 'Ajouter la matière'}
          </button>
        </div>
      </form>
    </div>
  );
}
