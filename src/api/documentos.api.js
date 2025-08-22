import { api } from './client';

export const documentosApi = {
  // Obtener lista de documentos
  getDocumentos: async (params = {}) => {
    const response = await api.get('/documentos', { params });
    return response.data;
  },

  // Obtener documento por ID
  getDocumento: async (id) => {
    const response = await api.get(`/documentos/${id}`);
    return response.data;
  },

  // Subir documento a un expediente
  subirDocumento: async (expedienteId, file, metadata = {}) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || 'application/pdf',
    });
    
    // Agregar metadata adicional
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    const response = await api.post(`/expedientes/${expedienteId}/documentos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Firmar documento
  firmarDocumento: async (documentoId, firmaData = {}) => {
    const response = await api.post(`/documentos/${documentoId}/firma`, firmaData);
    return response.data;
  },

  // Verificar firma de documento
  verificarFirma: async (documentoId) => {
    const response = await api.get(`/documentos/${documentoId}/verificar`);
    return response.data;
  },

  // Descargar documento
  descargarDocumento: async (documentoId) => {
    const response = await api.get(`/documentos/${documentoId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Eliminar documento
  eliminarDocumento: async (documentoId) => {
    const response = await api.delete(`/documentos/${documentoId}`);
    return response.data;
  },

  // Obtener historial de firmas
  getHistorialFirmas: async (documentoId) => {
    const response = await api.get(`/documentos/${documentoId}/firmas`);
    return response.data;
  }
}; 