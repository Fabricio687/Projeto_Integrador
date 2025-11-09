// src/services/spots.service.js
import api from './api';

const spotsService = {
  // Spots
  list: () => api.get('/spots'),
  create: (payload) => api.post('/spots', payload),
  update: (id, payload) => api.put(`/spots/${id}`, payload),
  remove: (id) => api.delete(`/spots/${id}`),

  // Bookings (reservas)
  reserve: (payload) => api.post('/bookings', payload), // { spotId }
  cancel: (id) => api.delete(`/bookings/${id}`),
};

export default spotsService;
