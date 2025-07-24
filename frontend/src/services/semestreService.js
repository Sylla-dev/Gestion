import { api } from "./api";

export const getSemestres = () => api.get(`/api/semestres`);
export const getSemestreById = (id) => api.get(`/api/semestres/${id}`);
export const createSemestre = (data) => api.post(`/api/semestres`, data);
export const updateSemestre = (id, data) => api.put(`/api/semestres/${id}`, data);
export const deleteSemestre = (id) => api.delete(`/api/semestres/${id}`);