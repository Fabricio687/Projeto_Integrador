// src/hooks/useApi.js
import { useCallback, useState } from 'react';
import api from '../services/api';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(api);
      return { ok: true, data: res.data };
    } catch (e) {
      setError(e?.response?.data?.message || 'Erro na requisição');
      return { ok: false, error: e };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request, setError };
}
