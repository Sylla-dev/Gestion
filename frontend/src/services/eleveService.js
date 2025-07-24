import { api } from "./api";

export const getEleves = () => api.get(`/api/eleves`);

export const getEleveById = (id) => api.get(`/api/eleves/${id}`);

// ⚠️ Detecte si le data est un FormData ou non
export const createEleve = (data) => {
    if (data instanceof FormData) {
        return api.post(`/api/eleves`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
    return api.post(`/api/eleves`, data); // fallback (non utilisé normalement ici)
};

export const updateEleve = (id, data) => {
    if (data instanceof FormData) {
        return api.put(`/api/eleves/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
    return api.put(`/api/eleves/${id}`, data); // fallback (non utilisé normalement ici)
};

export const deleteEleve = (id) => api.delete(`/api/eleves/${id}`);
