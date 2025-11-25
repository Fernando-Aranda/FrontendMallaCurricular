import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import VistaProyeccion from '../crear-proyeccion/components/VistaProyeccion'; // Asegúrate de la ruta correcta
import { useVerProyecciones } from './hooks/useVerProyecciones'; // Para llenar los selects
import { useAuth } from '../../context/AuthContext';

// Definimos la query como un string constante
const QUERY_COMPARACION = `
  query GetComparacion($id1: Int!, $id2: Int!) {
    p1: proyeccion(id: $id1) {
      id
      rut
      catalogo
      ramos {
        codigoRamo
        semestre
        # Si tu backend no devuelve asignatura/créditos aquí, 
        # el código de abajo pondrá valores por defecto.
      }
    }
    p2: proyeccion(id: $id2) {
      id
      rut
      catalogo
      ramos {
        codigoRamo
        semestre
      }
    }
  }
`;

// Helper para transformar los datos (Igual que antes)
const procesarDatosProyeccion = (ramosRaw: any[]) => {
  if (!ramosRaw) return { map: {}, max: 0, list: [], totalCreditos: 0 };

  const ramosList = ramosRaw.map((r: any) => ({
    ...r,
    // Valores por defecto para que no falle VistaProyeccion
    asignatura: r.asignatura || "Asignatura (Info pendiente)", 
    creditos: r.creditos || 0                 
  }));

  const maxSemestre = Math.max(...ramosList.map((r: any) => r.semestre), 0);
  
  const ramosPorSemestre: Record<number, any[]> = {};
  let totalCreditos = 0;

  ramosList.forEach((ramo: any) => {
    if (!ramosPorSemestre[ramo.semestre]) {
      ramosPorSemestre[ramo.semestre] = [];
    }
    ramosPorSemestre[ramo.semestre].push(ramo);
    totalCreditos += ramo.creditos;
  });

  return { 
    map: ramosPorSemestre, 
    max: maxSemestre, 
    list: ramosList,
    totalCreditos
  };
};

const ComparadorProyecciones = () => {
  const { token } = useAuth(); // Obtenemos el token para la petición
  const { proyecciones: listaProyecciones } = useVerProyecciones();
  
  const [selectedId1, setSelectedId1] = useState<number | "">("");
  const [selectedId2, setSelectedId2] = useState<number | "">("");

  // Estados locales para manejar la carga de datos
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efecto para cargar datos cuando ambos IDs están seleccionados
  useEffect(() => {
    const fetchComparacion = async () => {
      if (!selectedId1 || !selectedId2 || !token) return;

      setLoading(true);
      setError(null);
      
      try {
        // Hacemos la petición POST al endpoint de GraphQL
        const response = await axios.post<any>(
          'http://localhost:3000/graphql', 
          {
            query: QUERY_COMPARACION,
            variables: { 
              id1: Number(selectedId1), 
              id2: Number(selectedId2) 
            }
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Axios devuelve data, y GraphQL devuelve data dentro de data...
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        
        setData(response.data.data);

      } catch (err: any) {
        console.error("Error cargando comparación:", err);
        setError("Error al cargar las proyecciones. Revisa la consola.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparacion();
  }, [selectedId1, selectedId2, token]);

  // Procesamos los datos usando useMemo para eficiencia
  const datosP1 = useMemo(() => procesarDatosProyeccion(data?.p1?.ramos), [data?.p1]);
  const datosP2 = useMemo(() => procesarDatosProyeccion(data?.p2?.ramos), [data?.p2]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Comparador de Proyecciones</h1>

      {/* SELECTORES */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4 items-center justify-center">
        <select 
          className="border p-2 rounded w-1/3"
          value={selectedId1}
          onChange={(e) => setSelectedId1(Number(e.target.value))}
        >
          <option value="">Selecciona Proyección A</option>
          {listaProyecciones.map(p => (
            <option key={p.id} value={p.id}>ID: {p.id} - {p.fechaCreacion}</option>
          ))}
        </select>

        <span className="font-bold text-gray-500">VS</span>

        <select 
          className="border p-2 rounded w-1/3"
          value={selectedId2}
          onChange={(e) => setSelectedId2(Number(e.target.value))}
        >
          <option value="">Selecciona Proyección B</option>
          {listaProyecciones.map(p => (
            <option key={p.id} value={p.id}>ID: {p.id} - {p.fechaCreacion}</option>
          ))}
        </select>
      </div>

      {/* CONTENIDO */}
      {loading && <div className="text-center p-10 font-semibold text-blue-600">Cargando comparación...</div>}
      {error && <div className="text-center text-red-500 p-10">{error}</div>}

      {/* Solo mostramos si hay datos cargados y coinciden con la selección */}
      {!loading && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LADO IZQUIERDO */}
          <div className="flex flex-col gap-4">
            <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold text-lg text-blue-800">Proyección A (ID: {data.p1?.id})</h3>
              <div className="flex gap-4 text-sm mt-2">
                <span>📚 Ramos: <b>{datosP1.list.length}</b></span>
                <span>⭐ Créditos: <b>{datosP1.totalCreditos}</b></span>
                <span>📅 Semestres: <b>{datosP1.max}</b></span>
              </div>
            </div>

            <VistaProyeccion
              readOnly={true}
              ramosSeleccionados={datosP1.list}
              ramosPorSemestre={datosP1.map}
              maxSemestre={datosP1.max}
              onEliminarRamo={() => {}}
              onCambiarSemestre={() => {}}
            />
          </div>

          {/* LADO DERECHO */}
          <div className="flex flex-col gap-4">
             <div className="bg-green-100 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold text-lg text-green-800">Proyección B (ID: {data.p2?.id})</h3>
              <div className="flex gap-4 text-sm mt-2">
                <span>📚 Ramos: <b>{datosP2.list.length}</b></span>
                <span>⭐ Créditos: <b>{datosP2.totalCreditos}</b></span>
                <span>📅 Semestres: <b>{datosP2.max}</b></span>
              </div>
            </div>

            <VistaProyeccion
              readOnly={true}
              ramosSeleccionados={datosP2.list}
              ramosPorSemestre={datosP2.map}
              maxSemestre={datosP2.max}
              onEliminarRamo={() => {}}
              onCambiarSemestre={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparadorProyecciones;