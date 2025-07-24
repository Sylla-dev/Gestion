import axios from 'axios';

// 1️⃣ Configuration d'une instance Axios avec l'URL de base
export const api = axios.create({
  baseURL: 'http://localhost:5000', // Adapter selon la config serveur
  headers: {
    'Content-Type': 'application/json'
  },
});