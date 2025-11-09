// src/hooks/useMyCourses.js
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useMyCourses = () => {
  return useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const { data } = await api.get('/courses/my-courses');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
