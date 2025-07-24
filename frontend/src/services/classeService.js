import { api } from "./api";

export const getClasses = () => api.get(`/api/classes`);
export const getClassById = (id) => axios.get(`/api/classes/${id}`);
export const createClass = (data) => axios.post(`/api/classses`, data);
export const updateClass = (id, data) => axios.put(`/api/classes/${id}`, data);
export const deleteClass = (id) => axios.delete(`/api/classes/${id}`);