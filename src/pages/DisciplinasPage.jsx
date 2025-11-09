// src/pages/DisciplinasPage.jsx
const DisciplinasPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Minhas Disciplinas</h1>
        <p className="text-neutral-600 mt-1">Curso: Tecnologia da Informação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - Estruturas de Dados */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="h-24 bg-gradient-to-br from-blue-500 to-blue-600 flex items-end p-4">
            <span className="text-white/90 text-sm font-semibold bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
              ED-101
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Estruturas de Dados
            </h3>
            <p className="text-sm text-neutral-600 mb-4">Prof. Dr. Carlos Souza</p>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                12 aulas
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                3 provas
              </span>
            </div>
          </div>
        </div>

        {/* Card 2 - Algoritmos */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="h-24 bg-gradient-to-br from-green-500 to-green-600 flex items-end p-4">
            <span className="text-white/90 text-sm font-semibold bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
              ALG-102
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Algoritmos e Programação
            </h3>
            <p className="text-sm text-neutral-600 mb-4">Profa. Dra. Ana Costa</p>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                15 aulas
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                4 provas
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 - Banco de Dados */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="h-24 bg-gradient-to-br from-purple-500 to-purple-600 flex items-end p-4">
            <span className="text-white/90 text-sm font-semibold bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
              BD-201
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Banco de Dados
            </h3>
            <p className="text-sm text-neutral-600 mb-4">Prof. Dr. João Silva</p>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                10 aulas
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                2 provas
              </span>
            </div>
          </div>
        </div>

        {/* Card 4 - Desenvolvimento Web */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="h-24 bg-gradient-to-br from-orange-500 to-orange-600 flex items-end p-4">
            <span className="text-white/90 text-sm font-semibold bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
              WEB-202
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Desenvolvimento Web
            </h3>
            <p className="text-sm text-neutral-600 mb-4">Prof. Dr. Pedro Santos</p>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                18 aulas
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                3 provas
              </span>
            </div>
          </div>
        </div>

        {/* Card 5 - Engenharia de Software */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-end p-4">
            <span className="text-white/90 text-sm font-semibold bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
              ES-301
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Engenharia de Software
            </h3>
            <p className="text-sm text-neutral-600 mb-4">Profa. Dra. Maria Oliveira</p>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                14 aulas
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                3 provas
              </span>
            </div>
          </div>
        </div>

        {/* Card 6 - Redes de Computadores */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
          <div className="h-24 bg-gradient-to-br from-pink-500 to-pink-600 flex items-end p-4">
            <span className="text-white/90 text-sm font-semibold bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
              REDES-302
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Redes de Computadores
            </h3>
            <p className="text-sm text-neutral-600 mb-4">Prof. Dr. Ricardo Lima</p>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                16 aulas
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                4 provas
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisciplinasPage;
