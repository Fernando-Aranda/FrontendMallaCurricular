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
      <div className="mt-8 text-gray-500 text-center">
        No hay carreras disponibles.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {carreras.map((carrera) => (
        <CarreraCard key={carrera.codigo} carrera={carrera} />
      ))}
    </div>
  );
};

export default CarrerasList;
