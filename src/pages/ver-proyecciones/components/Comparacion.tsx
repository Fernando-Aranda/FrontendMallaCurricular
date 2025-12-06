import React, { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

// 1. Query corregida: Solo pedimos lo que tu backend tiene (codigoRamo y semestre)
const GET_COMPARISON_DATA = gql`
  query GetComparisonData($id1: Int!, $id2: Int!) {
    p1: proyeccion(id: $id1) {
      id
      fechaCreacion
      catalogo
      ramos {
        codigoRamo
        semestre
      }
    }
    p2: proyeccion(id: $id2) {
      id
      fechaCreacion
      catalogo
      ramos {
        codigoRamo
        semestre
      }
    }
  }
`;

interface Ramo {
  codigoRamo: string;
  semestre: number;
}

interface ProjectionData {
  id: number;
  fechaCreacion: string;
  catalogo: string;
  ramos: Ramo[];
}

interface ComparisonModalProps {
  projectionIds: string[];
  onClose: () => void;
}

export default function ComparisonModal({ projectionIds, onClose }: ComparisonModalProps) {
  // Convertimos los IDs de string a number para la query
  const id1 = parseInt(projectionIds[0] || "0");
  const id2 = parseInt(projectionIds[1] || "0");

  const { data, loading, error } = useQuery(GET_COMPARISON_DATA, {
    variables: { id1, id2 },
    skip: projectionIds.length < 2, 
    fetchPolicy: 'network-only',
  });

  // Función auxiliar para calcular estadísticas y ordenar datos
  const procesarProyeccion = (proj: ProjectionData | undefined) => {
    if (!proj) return null;

    const totalRamos = proj.ramos ? proj.ramos.length : 0;
    
    // Calculamos el semestre máximo
    const maxSemestre = totalRamos > 0 ? Math.max(...proj.ramos.map((r) => r.semestre)) : 0;

    // Agrupamos ramos por semestre para mostrarlos ordenados
    const ramosPorSemestre: Record<number, Ramo[]> = {};
    if (proj.ramos) {
        proj.ramos.forEach((r) => {
        if (!ramosPorSemestre[r.semestre]) ramosPorSemestre[r.semestre] = [];
        ramosPorSemestre[r.semestre].push(r);
        });
    }

    return {
      ...proj,
      stats: { totalRamos, maxSemestre },
      groupedRamos: ramosPorSemestre,
    };
  };

  const p1Data = useMemo(() => procesarProyeccion(data?.p1), [data?.p1]);
  const p2Data = useMemo(() => procesarProyeccion(data?.p2), [data?.p2]);

  const proyeccionesListas = [p1Data, p2Data].filter((p) => p !== null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] flex flex-col p-6 shadow-2xl">
        
        {/* HEADER DEL MODAL */}
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Comparar Proyecciones</h2>
            <p className="text-sm text-gray-500">Analizando diferencias entre proyección {id1} y proyección {id2}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 text-4xl font-light leading-none"
          >
            &times;
          </button>
        </div>

        {/* ESTADOS DE CARGA / ERROR */}
        {loading && <div className="flex-1 flex items-center justify-center text-xl text-blue-600">Cargando datos...</div>}
        {error && <div className="flex-1 flex items-center justify-center text-red-500">Error: {error.message}</div>}

        {/* CONTENIDO PRINCIPAL */}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-6 overflow-hidden h-full">
            {proyeccionesListas.map((proj, index) => (
              <div key={proj!.id} className={`flex flex-col h-full ${index === 0 ? 'border-r pr-6' : 'pl-2'}`}>
                
                {/* TARJETA DE RESUMEN (STATS) */}
                <div className={`p-4 rounded-lg border mb-4 shadow-sm ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                  <h3 className={`font-bold text-lg mb-2 ${index === 0 ? 'text-blue-800' : 'text-green-800'}`}>
                    Proyección {proj!.id}
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                    <p>📅 <b>Fecha:</b> {new Date(Number(proj!.fechaCreacion)).toLocaleDateString()}</p>
                    <p>📖 <b>Catálogo:</b> {proj!.catalogo}</p>
                    <p>🏁 <b>Semestres:</b> {proj!.stats.maxSemestre}</p>
                    <p>📊 <b>Total Ramos:</b> {proj!.stats.totalRamos}</p>
                  </div>
                </div>

                {/* LISTADO DE CURSOS (Scrollable) */}
                <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                  <h4 className="font-semibold text-gray-700 sticky top-0 bg-white py-2 border-b">Detalle de Cursos</h4>
                  
                  {Array.from({ length: proj!.stats.maxSemestre }, (_, i) => i + 1).map((semestre) => {
                    const ramosDelSemestre = proj!.groupedRamos[semestre];
                    if (!ramosDelSemestre) return null;

                    return (
                      <div key={semestre} className="mb-4">
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Semestre {semestre}
                        </h5>
                        <div className="space-y-2">
                          {ramosDelSemestre.map((ramo) => (
                            <div key={ramo.codigoRamo} className="bg-white border border-gray-200 p-3 rounded text-sm hover:shadow-sm transition-shadow">
                              <div className="flex justify-between items-center font-medium text-slate-900">
                                {/* AQUI MOSTRAMOS EL CODIGO COMO DATO PRINCIPAL */}
                                <span>{ramo.codigoRamo}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-4 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded font-semibold transition-colors shadow-lg"
          >
            Cerrar Comparación
          </button>
        </div>
      </div>
    </div>
  );
}