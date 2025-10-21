// src/pages/avance/AvancePage.tsx
import { useAvance } from "../../hooks/useAvance";
import { useMallas } from "../../hooks/useMallas"; // 1. Importamos el hook de mallas
import { useMemo } from "react";

const AvancePage = () => {
  // 2. Llamamos a ambos hooks para obtener los dos conjuntos de datos
  const { avance, loading: loadingAvance, error: errorAvance } = useAvance();
  const { mallas, loading: loadingMallas, error: errorMallas } = useMallas();

  // 3. Creamos un "mapa" para buscar nombres de asignaturas fácilmente.
  // useMemo evita que este cálculo se repita en cada renderizado.
  const asignaturaMap = useMemo(() => {
    if (!mallas.length) return new Map<string, string>();
    
    const map = new Map<string, string>();
    mallas.forEach(malla => {
      map.set(malla.codigo, malla.asignatura);
    });
    return map;
  }, [mallas]);

  // Manejamos los estados de carga y error de ambas peticiones
  if (loadingAvance || loadingMallas) return <p>Cargando datos...</p>;
  if (errorAvance) return <p>{errorAvance}</p>;
  if (errorMallas) return <p>{errorMallas}</p>;

  return (
    <div>
      <h2>Mi Avance Curricular</h2>
      <table border={1} cellPadding="8">
        <thead>
          <tr>
            <th>Código</th>
            <th>Asignatura</th> {/* ¡Ahora podemos mostrar el nombre! */}
            <th>Periodo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {avance.map((item) => (
            <tr key={`${item.nrc}-${item.period}`}>
              <td>{item.course}</td>
              {/* 4. Buscamos el nombre en nuestro mapa. Si no lo encuentra, muestra 'Nombre no disponible' */}
              <td>{asignaturaMap.get(item.course) || 'Nombre no disponible'}</td>
              <td>{item.period}</td>
              <td style={{ color: item.status === 'APROBADO' ? 'green' : 'red' }}>
                 {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvancePage;