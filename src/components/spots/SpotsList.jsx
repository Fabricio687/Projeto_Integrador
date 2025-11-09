// src/components/spots/SpotsList.jsx
import { useEffect, useState } from 'react';
import spotsService from '../../services/spots.service';
import SpotCard from './SpotCard';
import Loading from '../ui/Loading';

export default function SpotsList({ canManage = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await spotsService.list();
      setItems(data?.spots || []);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Falha ao carregar vagas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReserve = async (spot) => {
    try {
      await spotsService.reserve({ spotId: spot._id });
      fetchData();
    } catch (e) {
      alert(e?.response?.data?.message || 'Erro ao reservar');
    }
  };

  const handleCancel = async (spot) => {
    try {
      await spotsService.cancel(spot.bookingId || spot._id);
      fetchData();
    } catch (e) {
      alert(e?.response?.data?.message || 'Erro ao cancelar');
    }
  };

  if (loading) return <Loading text="Carregando vagas..." />;
  if (err) return <div className="text-sm text-red-600">{err}</div>;
  if (!items.length) return <div className="text-sm text-neutral-600">Nenhuma vaga disponível.</div>;

  return (
    <div className="space-y-3">
      {items.map((spot) => (
        <SpotCard
          key={spot._id}
          spot={spot}
          onReserve={handleReserve}
          onCancel={handleCancel}
          canManage={canManage}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
}
