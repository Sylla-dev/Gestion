import { api } from "./api";

export const getCoursGrouped = () => {
  return api.get('/api/API_URL/grouped-by-niveau');
};


export const getCoursPaged = (params) => api.get(`/api/cours`, params);


export const getClasses = () => api.get('/api/classes'); // Pour le menu déroulant

export const getCours = () => api.get(`/api/cours`);
export const createCour = (data) => api.post(`/api/cours`, data);
export const deleteCours = (id) => api.delete(`/api/cours/${id}`);