interface HomeHeaderProps {
  rut?: string;
}

const HomeHeader = ({ rut }: HomeHeaderProps) => (
  <>
    <h1 className="text-3xl font-bold text-slate-800">
      Bienvenido al Dashboard{rut ? `, ${rut}!` : ""} 
    </h1>
    <p className="mt-2 text-slate-600">
      Selecciona una de tus carreras para ver su información:
    </p>
  </>
);

export default HomeHeader;
