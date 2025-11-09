const DashboardPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Bem-vindo ao Portal do Aluno!</h1>
        <p className="text-neutral-600 mt-1">Aqui está seu resumo acadêmico</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">6</p>
          <p className="text-sm text-neutral-600">Disciplinas Ativas</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">85%</p>
          <p className="text-sm text-neutral-600">Frequência Geral</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">8.5</p>
          <p className="text-sm text-neutral-600">Média Geral</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900">3</p>
          <p className="text-sm text-neutral-600">Notificações</p>
        </div>
      </div>

      {/* Próximas Aulas */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Próximas Aulas</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
            <div className="w-16 h-16 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
              <div className="text-center">
                <div className="text-xs">SEG</div>
                <div className="text-lg">25</div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900">Estruturas de Dados</h3>
              <p className="text-sm text-neutral-600">08:00 - 10:00 | Prof. Dr. Carlos Souza</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
            <div className="w-16 h-16 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold">
              <div className="text-center">
                <div className="text-xs">SEG</div>
                <div className="text-lg">25</div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900">Algoritmos e Programação</h3>
              <p className="text-sm text-neutral-600">14:00 - 16:00 | Profa. Dra. Ana Costa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
