import { api } from "./api";


// 2️⃣ Fonction pour récupérer le bulletin d’un élève donné par ID
export const getBulletinSemestres = async (id) => {
  try {
    const response = await api.get(`/api/bulletins/${id}`);
    return response.data; // contient { notes, rangs, appreciations }
  } catch (error) {
    console.error('Erreur getBulletinSemestres:', error.response?.data || error.message);
    throw error;
  }
};

// 3️⃣ Créer une appréciation
export const createAppreciation = async (eleve_id, semestre_id, appreciation) => {
  try {
    const response = await api.post(`/api/appreciations`, { eleve_id, semestre_id, appreciation });
    return response.data;
  } catch (error) {
    console.error('Erreur createAppreciation:', error.response?.data || error.message);
    throw error;
  }
};

// 4️⃣ Mettre à jour une appréciation existante
export const updateAppreciation = async (id, appreciation) => {
  try {
    const response = await api.put(`/api/appreciations/${id}`, { appreciation });
    return response.data;
  } catch (error) {
    console.error('Erreur updateAppreciation:', error.response?.data || error.message);
    throw error;
  }
};
