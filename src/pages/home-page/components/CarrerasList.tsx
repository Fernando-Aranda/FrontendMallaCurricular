import CarreraCard from "./CarreraCard";

interface Carrera {
  codigo: string;
  nombre: string;
}

interface CarrerasListProps {
  carreras: Carrera[];
}

const CarrerasList = ({ carreras }: CarrerasListProps) => {
  if (carreras.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p className="text-lg">No hay carreras asociadas a tu cuenta.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {carreras.map((carrera) => (
        <CarreraCard key={carrera.codigo} carrera={carrera} />
      ))}
    </div>
  );
};

export default CarrerasList;