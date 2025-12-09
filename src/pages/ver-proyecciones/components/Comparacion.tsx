import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import SemestreCard from "../../ver-proyecciones-detalle/components/SemestreCard"; 
import { useMallas } from "../../../hooks/useMallas"; 

interface RamoProyectado {
  codigoRamo: string;
  semestre: number;
  nombreAsignatura?: string; 
}

interface ProyeccionDetalle {
  id: number;
  nombre: string;
  rut: string;
  codigoCarrera: string;
  fechaCreacion: string;
  ramos: RamoProyectado[];
}

interface ComparisonModalProps {
  projectionIds: string[];
  onClose: () => void;
}

const ComparisonModal = ({ projectionIds, onClose }: ComparisonModalProps) => {
  const { token } = useAuth();
  const [dataComparacion, setDataComparacion] = useState<ProyeccionDetalle[]>([]);
  const [loadingProyecciones, setLoadingProyecciones] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const codigoCarrera = dataComparacion[0]?.codigoCarrera;
  const { mallas, loading: loadingMallas } = useMallas(codigoCarrera);
  const nombresMap = useMemo(() => {
    const map = new Map<string, string>();
    if (mallas) {
      mallas.forEach((ramo) => {
        map.set(ramo.codigo, ramo.asignatura);
      });
    }
    return map;
  }, [mallas]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || projectionIds.length < 2) return;

      try {
        setLoadingProyecciones(true);
        const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';
        
        const query = `
          query GetComparison($id: Int!) {
            proyeccion(id: $id) {
              id
              nombre
              fechaCreacion
              codigoCarrera
              ramos {
                codigoRamo
                semestre
                nombreAsignatura 
              }
            }
          }
        `;

        const promises = projectionIds.map(id => 
           fetch(GRAPHQL_ENDPOINT, {
             method: 'POST',
             headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
             },
             body: JSON.stringify({ query, variables: { id: parseInt(id) } })
           }).then(r => r.json())
        );

        const responses = await Promise.all(promises);
        
        const validData = responses.map(r => {
            if(r.errors) throw new Error(r.errors[0].message);
            
            const proj = r.data.proyeccion;
            return {
                ...proj,
                ramos: proj.ramos.map((ramo: any) => ({
                    codigoRamo: ramo.codigoRamo,
                    semestre: ramo.semestre,
                    nombreAsignatura: ramo.nombreAsignatura 
                }))
            };
        });
        
        setDataComparacion(validData);

      } catch (err) {
        console.error("Error al comparar:", err);
        setError("Error al cargar datos. Intenta nuevamente.");
      } finally {
        setLoadingProyecciones(false);
      }
    };

    fetchData();
  }, [projectionIds, token]);

  const agruparPorSemestre = (ramos: RamoProyectado[]) => {
    return ramos.reduce<Record<number, RamoProyectado[]>>((acc, ramo) => {
      if (!acc[ramo.semestre]) acc[ramo.semestre] = [];
      acc[ramo.semestre].push(ramo);
      return acc;
    }, {});
  };

  const loading = loadingProyecciones || (!!codigoCarrera && loadingMallas);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-[95vw] w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Comparar Escenarios</h2>
            <p className="text-sm text-slate-500">Analiza las diferencias entre tus planificaciones</p>
          </div>
          <button 
            onClick={onClose} 
            className="bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-red-500 w-10 h-10 rounded-full flex items-center justify-center transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="flex-1 overflow-hidden bg-slate-50 relative">
          
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-blue-600 font-bold">Analizando y cruzando datos...</p>
            </div>
          )}

          {error && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                <p className="text-red-500 font-bold text-lg mb-2">{error}</p>
                <button onClick={onClose} className="text-slate-500 hover:underline">Cerrar</button>
              </div>
            </div>
          )}

          {!loading && !error && dataComparacion.length === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 h-full divide-y md:divide-y-0 md:divide-x divide-slate-200">
              
              {dataComparacion.map((proj, index) => {
                const ramosAgrupados = agruparPorSemestre(proj.ramos);
                const semestresOrdenados = Object.keys(ramosAgrupados).sort((a, b) => Number(a) - Number(b));
                const totalRamos = proj.ramos.length;

                return (
                  <div key={proj.id} className="flex flex-col h-full overflow-hidden bg-white">
                    
                    {/* Header Columna */}
                    <div className={`p-5 border-b ${index === 0 ? 'bg-blue-50/50 border-blue-100' : 'bg-orange-50/50 border-orange-100'}`}>
                      <div className="flex justify-between items-start">
                        <h3 className={`font-bold text-lg ${index === 0 ? 'text-blue-700' : 'text-orange-700'} line-clamp-1`}>
                          {proj.nombre}
                        </h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                          Opción {index + 1}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            {new Date(proj.fechaCreacion).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                            {totalRamos} Ramos
                          </span>
                      </div>
                    </div>

                    {/* Lista Semestres */}
                    <div className="overflow-y-auto p-4 flex-1 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
                      {semestresOrdenados.length > 0 ? (
                        semestresOrdenados.map((semestreNum) => (
                          <div key={semestreNum} className="relative">
                            {Number(semestreNum) < semestresOrdenados.length && (
                              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100 -z-10"></div>
                            )}
                            
                            <SemestreCard 
                              semestre={semestreNum} 
                              ramos={ramosAgrupados[Number(semestreNum)]} 
                              nombresMap={nombresMap} // <--- PASAMOS EL MAPA
                            />
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                          <p>Sin datos</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors shadow-sm"
          >
            Cerrar Comparación
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;