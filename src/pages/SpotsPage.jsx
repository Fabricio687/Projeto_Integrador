// src/pages/SpotsPage.jsx
import Card from '../components/ui/Card';
import SpotsList from '../components/spots/SpotsList';
import CreateSpotForm from '../components/spots/CreateSpotForm';
import useAuth from '../hooks/useAuth';

export default function SpotsPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-base font-semibold text-neutral-900 dark:text-[#E6EAF0]">Vagas</h1>
        <p className="text-sm text-neutral-600 dark:text-[#9CA3AF]">Reserve e gerencie vagas disponíveis.</p>
      </Card>

      {canManage && (
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-[#E6EAF0]">Criar nova vaga</h2>
          <CreateSpotForm onCreated={() => window.location.reload()} />
        </Card>
      )}

      <SpotsList canManage={canManage} />
    </div>
  );
}
