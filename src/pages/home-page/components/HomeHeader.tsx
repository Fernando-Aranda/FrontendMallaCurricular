interface HomeHeaderProps {
  rut?: string;
}

const HomeHeader = ({ rut }: HomeHeaderProps) => (
  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-4">
    <div className="bg-blue-50 p-4 rounded-full text-blue-600 hidden md:block">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </div>

    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
        Bienvenido al Portal
      </h1>
      <div className="flex items-center gap-2 mt-2 text-slate-500">
        <span>Estudiante:</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono font-semibold">
          {rut || "Invitado"}
        </span>
      </div>
      <p className="mt-4 text-slate-600 text-sm md:text-base">
        Selecciona una carrera a continuación para gestionar tu avance académico y proyecciones.
      </p>
    </div>
  </div>
);

export default HomeHeader;