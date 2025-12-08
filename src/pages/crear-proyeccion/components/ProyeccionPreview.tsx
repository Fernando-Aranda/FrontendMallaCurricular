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
  creditos: number; // 👈 Aseguramos que venga este dato
}

interface Props {
  periodos: Periodo[];
  // Ajustamos la interfaz para leer los créditos del catálogo
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
  // 🔹 Mapa ahora guarda Nombre y CRÉDITOS
  const mapaInfo = useMemo(() => {
    const map = new Map<string, { asignatura: string; creditos: number }>();
    catalogoCompleto.forEach((nivel) => {
      nivel.ramos.forEach((r) => {
        map.set(r.codigo, { asignatura: r.asignatura, creditos: r.creditos || 0 });
      });
    });
    return map;
  }, [catalogoCompleto]);

  if (periodos.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-10 h-[500px] flex flex-col items-center justify-center text-gray-400">
        <p className="text-lg font-medium">Comienza agregando un periodo desde el panel derecho</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 shadow-inner h-full min-h-[600px] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <span className="text-2xl">📅</span> Vista Previa
        </h3>
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
          {periodos.length} Semestres
        </span>
      </div>

      <div className="overflow-x-auto pb-6 custom-scrollbar h-full">
        <div className="flex gap-6 min-w-max px-2">
          {periodos.map((p, i) => {
            // 🔹 CÁLCULO DE CRÉDITOS
            const totalCreditos = p.ramos.reduce((acc, r) => {
              const info = mapaInfo.get(r.codigoRamo);
              return acc + (info?.creditos || 0);
            }, 0);

            // Determinar color según carga académica
            const excedeCreditos = totalCreditos > 30;
            const esCargaBaja = totalCreditos < 15 && totalCreditos > 0;
            
            let colorBarra = "bg-green-500";
            let colorTexto = "text-green-700 bg-green-100";
            
            if (excedeCreditos) {
              colorBarra = "bg-red-500";
              colorTexto = "text-red-700 bg-red-100";
            } else if (totalCreditos >= 25) {
              colorBarra = "bg-blue-500";
              colorTexto = "text-blue-700 bg-blue-100";
            } else if (esCargaBaja) {
              colorBarra = "bg-yellow-500";
              colorTexto = "text-yellow-700 bg-yellow-100";
            }

            return (
              <div
                key={i}
                className="w-[320px] flex flex-col bg-white rounded-xl shadow-md border border-gray-200 transition-transform hover:-translate-y-1 duration-300"
              >
                {/* Header */}
                <div className="p-4 rounded-t-xl border-b bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500 mb-1">Periodo {i + 1}</p>
                      <p className="font-bold text-lg text-gray-800 leading-tight">
                        {formatearPeriodo(p.catalogo)}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${colorTexto}`}>
                      {totalCreditos} CR
                    </div>
                  </div>

                  {/* Barra de Progreso de Créditos */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full ${colorBarra}`}
                      style={{ width: `${Math.min((totalCreditos / 30) * 100, 100)}%` }}
                    ></div>
                  </div>
                  {excedeCreditos && (
                    <p className="text-[10px] text-red-500 mt-1 font-semibold text-right">
                      ⚠️ Excede carga normal (30)
                    </p>
                  )}
                </div>

                {/* Lista de Ramos */}
                <div className="p-4 flex-1 flex flex-col gap-2 min-h-[200px]">
                  {p.ramos.filter(r => r.codigoRamo).length === 0 ? (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
                      <p className="text-sm text-gray-300 italic">Sin ramos</p>
                    </div>
                  ) : (
                    p.ramos.map((r, j) => {
                      if (!r.codigoRamo) return null;
                      const info = mapaInfo.get(r.codigoRamo);
                      return (
                        <div
                          key={j}
                          className="bg-white p-2.5 rounded border border-gray-100 shadow-sm flex justify-between items-center group hover:border-blue-300"
                        >
                          <div className="flex-1 pr-2">
                            <p className="text-sm text-gray-700 font-medium leading-snug">
                               {info?.asignatura || "Cargando..."}
                            </p>
                            <p className="text-[10px] text-gray-400">{r.codigoRamo}</p>
                          </div>
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {info?.creditos}cr
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}