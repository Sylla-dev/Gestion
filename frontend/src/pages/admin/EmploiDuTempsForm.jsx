import { api } from "../../services/api";
import React, { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaBook,
  FaSchool,
  FaClock,
  FaDoorOpen,
  FaSave,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EmploiDuTempsForm() {
  const [form, setForm] = useState({
    enseignant_id: "",
    matiere_id: "",
    jour_semaine: "Lundi",
    heure_debut: "08:00",
    heure_fin: "09:00",
    salle: "",
    classe_id: "",
  });

  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/api/classes"),
      api.get("/api/enseignants"),
      api.get("/api/matieres"),
    ])
      .then(([resClasses, resEnseignants, resMatieres]) => {
        setClasses(resClasses.data);
        setEnseignants(resEnseignants.data);
        setMatieres(resMatieres.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erreur lors du chargement des données.");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.heure_debut >= form.heure_fin) {
      toast.warning("L'heure de début doit être antérieure à l'heure de fin.");
      return;
    }

    setLoading(true);
    api
      .post("/api/emplois", form)
      .then(() => {
        toast.success("Créneau ajouté avec succès !");
        setForm({
          enseignant_id: "",
          matiere_id: "",
          jour_semaine: "Lundi",
          heure_debut: "08:00",
          heure_fin: "09:00",
          salle: "",
          classe_id: "",
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erreur lors de l'enregistrement.");
      })
      .finally(() => setLoading(false));
  };

  const Label = ({ icon, children }) => (
    <label className="label font-semibold flex gap-2 items-center text-base-content">
      {icon}
      {children}
    </label>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto p-6 md:p-10 bg-base-100 shadow-xl rounded-xl space-y-6"
    >
      <h2 className="text-3xl font-bold text-primary flex gap-2 items-center">
        <FaSave /> Ajouter un créneau
      </h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <Label icon={<FaSchool />}>Classe</Label>
          <select
            name="classe_id"
            value={form.classe_id}
            onChange={(e) => setForm({ ...form, classe_id: e.target.value })}
            required
            className="select select-bordered w-full"
          >
            <option value="">-- Choisir une classe --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label icon={<FaChalkboardTeacher />}>Enseignant</Label>
          <select
            value={form.enseignant_id}
            onChange={(e) =>
              setForm({ ...form, enseignant_id: e.target.value })
            }
            required
            className="select select-bordered w-full"
          >
            <option value="">-- Choisir un enseignant --</option>
            {enseignants.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label icon={<FaBook />}>Matière</Label>
          <select
            value={form.matiere_id}
            onChange={(e) =>
              setForm({ ...form, matiere_id: e.target.value })
            }
            required
            className="select select-bordered w-full"
          >
            <option value="">-- Choisir une matière --</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label icon={<FaClock />}>Jour de la semaine</Label>
          <select
            value={form.jour_semaine}
            onChange={(e) =>
              setForm({ ...form, jour_semaine: e.target.value })
            }
            className="select select-bordered w-full"
          >
            {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map(
              (j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <Label icon={<FaClock />}>Horaire</Label>
          <div className="flex gap-2">
            <input
              type="time"
              value={form.heure_debut}
              onChange={(e) =>
                setForm({ ...form, heure_debut: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
            <input
              type="time"
              value={form.heure_fin}
              onChange={(e) =>
                setForm({ ...form, heure_fin: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>

        <div>
          <Label icon={<FaDoorOpen />}>Salle</Label>
          <input
            type="text"
            value={form.salle}
            onChange={(e) => setForm({ ...form, salle: e.target.value })}
            placeholder="Ex: B203"
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary w-full md:w-auto flex gap-2 ${
            loading ? "btn-disabled" : ""
          }`}
        >
          <FaSave />
          {loading ? "Ajout en cours..." : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
