import React, { useMemo } from "react";

interface Ramo {
  codigoRamo: string;
}

interface Periodo {
  catalogo: string;
  ramos: Ramo[];
}

interface OpcionRamo {
  codigo: string;
  asignatura: string;
}

interface Props {
  periodos: Periodo[];
  catalogoCompleto: { ramos: OpcionRamo[] }[];
}

function formatearPeriodo(catalogo: string) {
  if (!catalogo || catalogo.length !== 6) return "Nuevo Periodo";
  const year = catalogo.slice(0, 4);
  const sem = catalogo.slice(4, 6);
  if (sem === "10") return `1º Semestre ${year}`;
  if (sem === "20") return `2º Semestre ${year}`;
  if (sem === "15") return `Invierno ${year}`;
  if (sem === "25") return `Verano ${year}`;
  return catalogo;
}

export default function ProyeccionPreview({ periodos, catalogoCompleto }: Props) {
  const mapaNombres = useMemo(() => {
    const map = new Map<string, string>();
    catalogoCompleto.forEach((nivel) => {
      nivel.ramos.forEach((r) => {
        map.set(r.codigo, r.asignatura);
      });
    });
    return map;
  }, [catalogoCompleto]);

  // Si no hay periodos, mostramos un estado vacío amigable
  if (periodos.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-10 h-[500px] flex flex-col items-center justify-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">Comienza agregando un periodo desde el panel derecho</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 shadow-inner h-full min-h-[600px] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <span className="text-2xl">📅</span> Vista Previa de la Malla
        </h3>
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
          {periodos.length} {periodos.length === 1 ? 'Periodo' : 'Periodos'} planificados
        </span>
      </div>

      {/* Contenedor Horizontal con Scroll */}
      <div className="overflow-x-auto pb-6 custom-scrollbar h-full">
        <div className="flex gap-6 min-w-max px-2">
          {periodos.map((p, i) => (
            <div
              key={i}
              className="w-[300px] flex flex-col bg-white rounded-xl shadow-md border border-gray-200 transition-transform hover:-translate-y-1 duration-300"
            >
              {/* Header de la Tarjeta */}
              <div className={`p-4 rounded-t-xl border-b ${
                i % 2 === 0 ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase opacity-80 mb-1">Periodo {i + 1}</p>
                    <p className="font-bold text-lg leading-tight">
                      {formatearPeriodo(p.catalogo)}
                    </p>
                  </div>
                  <div className="bg-white/20 px-2 py-1 rounded text-xs font-mono">
                    {p.ramos.filter(r => r.codigoRamo).length} ramos
                  </div>
                </div>
              </div>

              {/* Cuerpo de la Tarjeta */}
              <div className="p-4 flex-1 bg-gray-50 flex flex-col gap-3 min-h-[250px]">
                {p.ramos.filter(r => r.codigoRamo).length === 0 ? (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg m-2">
                    <p className="text-sm text-gray-400 italic">Vacío</p>
                  </div>
                ) : (
                  p.ramos.map((r, j) => {
                    if (!r.codigoRamo) return null;
                    return (
                      <div
                        key={j}
                        className="bg-white p-3 rounded-lg border-l-4 border-l-blue-500 shadow-sm text-gray-800 text-sm font-medium hover:bg-blue-50 transition-colors"
                      >
                        {mapaNombres.get(r.codigoRamo) || <span className="text-gray-400">Seleccionando...</span>}
                        <div className="text-xs text-gray-400 font-normal mt-1">
                          {r.codigoRamo}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
          
          {/* Tarjeta fantasma para sugerir scroll o nuevo periodo */}
          <div className="w-[100px] flex items-center justify-center opacity-50">
             <div className="w-1 h-full border-r-2 border-dashed border-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}