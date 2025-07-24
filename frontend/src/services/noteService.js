import { api } from "./api";

export const getNotes = () => api.get(`/api/notes`);
export const createNote = (data) => api.post(`/api/notes`, data);
export const updateNote = (id, data) => api.put(`/api/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/api/notes/${id}`);