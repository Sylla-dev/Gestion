import { api } from "./api";

export const getMoyennes = () => api.get(`/api/statistiques/moyennes`);