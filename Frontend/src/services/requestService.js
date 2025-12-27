import api from '../utils/api';

const requestService = {
    createRequest: async (requestData) => {
        const response = await api.post('/requests', requestData);
        return response.data;
    },
    getAllRequests: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/requests?${params}`);
        return response.data;
    },
    getRequestById: async (id) => {
        const response = await api.get(`/requests/${id}`);
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await api.put(`/requests/${id}/status`, { status });
        return response.data;
    },
    assignTechnician: async (id, technicianId) => {
        const response = await api.put(`/requests/${id}/assign`, { technician_id: technicianId });
        return response.data;
    },
    updateDuration: async (id, duration) => {
        const response = await api.put(`/requests/${id}/duration`, { duration_hours: duration });
        return response.data;
    }
};

export default requestService;
