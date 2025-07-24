import { api } from "./api";

export const getMatieres = () => api.get(`/api/matieres`);
export const getMatiereById = (id) => api.get(`/api/matieres/${id}`);
export const createMatiere = (data) => axios.post(`/api/matieres`, data);
export const updateMatiere = (id, data) => axios.put(`/api/matieres/${id}`, data);
export const deleteMatiere = (id) => axios.delete(`/api/matieres/${id}`);