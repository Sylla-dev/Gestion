import { api } from "./api";

// 🔹 Liste des enseignants groupés par spécialité
export const getTeachers = (spécialité) => api.get(`/api/enseignants`, spécialité);

// 🔹 Liste des enseignants avec leurs matières enseignées
export const getTeachersWithSubjects = (matieres) => api.get(`/api/enseignants`, matieres);

export const getTeachersGroupedBySubject = (parmatiere) => api.get(`/api/enseignants`, parmatiere);


export const getTeacherById = (id) => api.get(`/api/enseignants/${id}`);
export const createTeacher = (data) => api.post(`/api/enseignants`, data);
export const updateTeacher = (id, data) => api.put(`/api/enseignants/${id}`, data);
export const deleteTeacher = (id) => api.delete(`/api/enseignants/${id}`);
