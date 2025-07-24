import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { api } from '../services/api';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', role: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
       await api.post('/api/auth/register', form);

      navigate('/login');
    } catch (err) {
      console.error(err);
      setError("Email ou mot de passe invalide.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-sm p-8 shadow-md bg-white rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">Connexion</h2>

        {error && (
          <div className="alert alert-error text-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-1.414 1.414M5.636 18.364l1.414-1.414m0-11.314l-1.414 1.414m11.314 11.314l1.414-1.414M12 3v1m0 16v1m8-8h1M3 12H2m16.95-4.95l.707-.707m-13.414 0l.707.707M16.95 16.95l.707.707m-13.414 0l.707-.707" /></svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                placeholder="Nom"
                className="grow"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </label>
          </div>
		  
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2">
              <FaEnvelope className="text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                className="grow"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
          </div>

          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2">
              <FaLock className="text-gray-500" />
              <input
                type="password"
                placeholder="Mot de passe"
                className="grow"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </label>
          </div>

          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2">
              <select
                className="grow"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              >
			    <option value="admin">Administration</option>
				<option value="enseignant">Professeur</option>
				<option value="etudiant">Eleve</option>
			  </select>
            </label>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="text-sm text-center mt-4 text-gray-500">
          Mot de passe oublié ? <a href="#" className="link link-primary">Réinitialiser</a>
        </div>
      </div>
    </div>
  );
}
