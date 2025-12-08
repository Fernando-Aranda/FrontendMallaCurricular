import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext"; // Ajusta la ruta a tu AuthContext
import SemestreCard from "../../ver-proyecciones-detalle/components/SemestreCard"; // Ajusta la ruta a tu componente


interface RamoProyectado {
  codigoRamo: string;
  semestre: number;
  nombreRamo?: string;
}

interface ProyeccionDetalle {
  id: number;
  nombre: string;
  rut: string;
  codigoCarrera: string;
  fechaCreacion: string; // Agregué esto por si quieres mostrar la fecha
  ramos: RamoProyectado[];
}

interface ComparisonModalProps {
  projectionIds: string[]; // Los IDs que seleccionaste en la vista anterior
  onClose: () => void;
}


const ComparisonModal = ({ projectionIds, onClose }: ComparisonModalProps) => {
  const { token } = useAuth();
  const [dataComparacion, setDataComparacion] = useState<ProyeccionDetalle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || projectionIds.length < 2) return;

      try {
        setLoading(true);
        // Hacemos las dos peticiones en paralelo para que sea más rápido
        const promises = projectionIds.map((id) =>
          axios.get<ProyeccionDetalle>(`http://localhost:3000/proyecciones/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const responses = await Promise.all(promises);
        const resultados = responses.map((res) => res.data);
        
        setDataComparacion(resultados);
      } catch (err) {
        console.error("Error al comparar:", err);
        setError("Error al cargar las proyecciones para comparar.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectionIds, token]);

  // Función helper para agrupar ramos (La lógica que sacamos de tu hook)
  const agruparPorSemestre = (ramos: RamoProyectado[]) => {
    return ramos.reduce<Record<number, RamoProyectado[]>>((acc, ramo) => {
      if (!acc[ramo.semestre]) acc[ramo.semestre] = [];
      acc[ramo.semestre].push(ramo);
      return acc;
    }, {});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Comparación de Proyecciones</h2>
            <p className="text-sm text-gray-500">
              Comparando ID: {projectionIds[0]} vs ID: {projectionIds[1]}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 text-4xl font-light leading-none transition-colors"
          >
            &times;
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="flex-1 overflow-hidden p-6 bg-gray-100">
          
          {loading && (
            <div className="h-full flex items-center justify-center">
              <p className="text-xl text-blue-600 font-semibold animate-pulse">Cargando comparación...</p>
            </div>
          )}

          {error && (
            <div className="h-full flex items-center justify-center">
              <p className="text-xl text-red-500 font-semibold">{error}</p>
            </div>
          )}

          {!loading && !error && dataComparacion.length === 2 && (
            <div className="grid grid-cols-2 gap-6 h-full">
              
              {/* Mapeamos las 2 proyecciones cargadas */}
              {dataComparacion.map((proj, index) => {
                const ramosAgrupados = agruparPorSemestre(proj.ramos);
                // Ordenamos los semestres para pintarlos en orden (1, 2, 3...)
                const semestresOrdenados = Object.keys(ramosAgrupados).sort((a, b) => Number(a) - Number(b));
                const totalCreditos = proj.ramos.length; // Ojo: Si tienes campo creditos úsalo, si no, cuento ramos.

                return (
                  <div key={proj.id} className="flex flex-col bg-white rounded-lg shadow h-full overflow-hidden border border-gray-200">
                    
                    {/* Header de la columna */}
                    <div className={`p-4 border-b ${index === 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
                      <h3 className={`font-bold text-lg ${index === 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                        {proj.nombre}
                      </h3>
                      <div className="text-sm text-gray-600 flex justify-between mt-2">
                        <span>📅 {new Date(proj.fechaCreacion).toLocaleDateString()}</span>
                        <span>📚 {totalCreditos} Ramos totales</span>
                      </div>
                    </div>

                    {/* Lista de Semestres (Scrollable) */}
                    <div className="overflow-y-auto p-4 flex-1 space-y-4">
                      {semestresOrdenados.length > 0 ? (
                        semestresOrdenados.map((semestreNum) => (
                          // REUTILIZAMOS TU COMPONENTE EXACTO
                          <SemestreCard 
                            key={semestreNum}
                            semestre={semestreNum} // Pasamos el string numérico
                            ramos={ramosAgrupados[Number(semestreNum)]}
                          />
                        ))
                      ) : (
                        <p className="text-center text-gray-400 italic mt-10">
                          Sin ramos asignados
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t bg-white flex justify-end">
          <button 
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded font-semibold transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
export default ComparisonModal;