import { api } from './client';

export const expedientesApi = {
  // Obtener lista de expedientes
  getExpedientes: async (params = {}) => {
    const response = await api.get('/expedientes', { params });
    return response.data;
  },

  // Obtener expediente por ID
  getExpediente: async (id) => {
    const response = await api.get(`/expedientes/${id}`);
    return response.data;
  },

  // Crear nuevo expediente
  crearExpediente: async (expediente) => {
    const response = await api.post('/expedientes', expediente);
    return response.data;
  },

  // Actualizar expediente
  actualizarExpediente: async (id, expediente) => {
    const response = await api.put(`/expedientes/${id}`, expediente);
    return response.data;
  },

  // Eliminar expediente
  eliminarExpediente: async (id) => {
    const response = await api.delete(`/expedientes/${id}`);
    return response.data;
  },

  // Obtener actuaciones de un expediente
  getActuaciones: async (expedienteId) => {
    const response = await api.get(`/expedientes/${expedienteId}/actuaciones`);
    return response.data;
  },

  // Crear nueva actuación
  crearActuacion: async (expedienteId, actuacion) => {
    const response = await api.post(`/expedientes/${expedienteId}/actuaciones`, actuacion);
    return response.data;
  },

  // Obtener documentos de un expediente
  getDocumentos: async (expedienteId) => {
    const response = await api.get(`/expedientes/${expedienteId}/documentos`);
    return response.data;
  }
}; 