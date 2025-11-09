// src/components/spots/CreateSpotForm.jsx
import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import spotsService from '../../services/spots.service';

export default function CreateSpotForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const onChange = (e) => {
    setErr(null);
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await spotsService.create(form);
      setForm({ name: '', description: '' });
      onCreated?.();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Erro ao criar vaga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input label="Nome" name="name" value={form.name} onChange={onChange} required />
      <Input label="Descrição" name="description" value={form.description} onChange={onChange} />
      {err && <div className="text-sm text-red-600">{err}</div>}
      <Button disabled={loading}>{loading ? 'Salvando...' : 'Criar vaga'}</Button>
    </form>
  );
}
