// src/pages/mallas/MallasPage.tsx
import { useMallas } from "../../hooks/useMallas";

const MallasPage = () => {
  const { mallas, loading, error } = useMallas();

  if (loading) return <p>Cargando mallas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Listado de Mallas</h2>
      <table border={1} cellPadding="8">
        <thead>
          <tr>
            <th>Código</th>
            <th>Asignatura</th>
            <th>Créditos</th>
            <th>Nivel</th>
            <th>Prerrequisitos</th>
          </tr>
        </thead>
        <tbody>
          {mallas.map((m) => (
            <tr key={m.codigo}>
              <td>{m.codigo}</td>
              <td>{m.asignatura}</td>
              <td>{m.creditos}</td>
              <td>{m.nivel}</td>
              <td>{m.prereq || "Ninguno"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MallasPage;
