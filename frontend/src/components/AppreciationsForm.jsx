import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api"; // ton instance axios
import { FaSave } from "react-icons/fa";

export default function AppreciationsForm() {
  const { id } = useParams(); // ID de l'élève
  const eleveId = id;
  const [loading, setLoading] = useState(true);
  const [appreciations, setAppreciations] = useState({
    S1: "",
    S2: ""
  });

  useEffect(() => {
    const fetchAppreciations = async () => {
      try {
        const res = await api.get(`/api/appreciations/${eleveId}`);
        const data = res.data;

        const newAppreciations = { S1: "", S2: "" };
        data.forEach(item => {
          if (item.semestre === "S1") newAppreciations.S1 = item.appreciation;
          if (item.semestre === "S2") newAppreciations.S2 = item.appreciation;
        });

        setAppreciations(newAppreciations);
      } catch (error) {
        console.error("Erreur de chargement des appréciations :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppreciations();
  }, [eleveId]);

  const handleChange = (semestre, value) => {
    setAppreciations(prev => ({ ...prev, [semestre]: value }));
  };

  const handleSave = async () => {
    try {
      await api.post(`/api/appreciations/${eleveId}`, {
        appreciations: [
          { semestre: "S1", appreciation: appreciations.S1 },
          { semestre: "S2", appreciation: appreciations.S2 },
        ],
      });
      alert("✅ Appréciations enregistrées !");
    } catch (err) {
      console.error("Erreur d'enregistrement :", err);
      alert("❌ Échec de l'enregistrement.");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Chargement...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-200 rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-primary">Appréciations du bulletin</h2>

      {["S1", "S2"].map(semestre => (
        <div key={semestre}>
          <label className="label font-semibold text-base-content">
            Appréciation semestre {semestre}
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            placeholder={`Saisir l'appréciation pour le semestre ${semestre}`}
            value={appreciations[semestre]}
            onChange={(e) => handleChange(semestre, e.target.value)}
          ></textarea>
        </div>
      ))}

      <div className="text-right">
        <button onClick={handleSave} className="btn btn-primary gap-2">
          <FaSave /> Enregistrer
        </button>
      </div>
    </div>
  );
}
