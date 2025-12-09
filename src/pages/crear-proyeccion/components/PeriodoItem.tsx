import React, { useMemo } from "react";
import RamoItem from "./RamoItem";

interface Ramo {
  codigoRamo: string;
  semestre: number;
  nombreAsignatura?: string;
}

interface OpcionRamo {
  codigo: string;
  asignatura: string;
  creditos?: number;
  nivel?: number;
  prereq?: string;
  historial?: { estado: string; periodo: string }[] | null;
}

interface Props {
  periodo: {
    catalogo: string;
    ramos: Ramo[];
  };
  index: number;
  agregarRamo: (i: number) => void;
  eliminarRamo: (iPeriodo: number, iRamo: number) => void;
  actualizarRamo: (
    iPeriodo: number,
    iRamo: number,
    field: any,
    value: any,
    nombreExtra?: string 
  ) => void;
  opcionesPorNivel: { nivel: number; ramos: OpcionRamo[] }[];
  ramosSeleccionados: string[];
  ramosDisponibles: string[];
  nivelEstudiante: number;
}

export default function PeriodoItem({
  periodo,
  index,
  agregarRamo,
  eliminarRamo,
  actualizarRamo,
  opcionesPorNivel,
  ramosSeleccionados,
  ramosDisponibles,
  nivelEstudiante,
}: Props) {

  const totalCreditos = useMemo(() => {
    const todos = opcionesPorNivel.flatMap(g => g.ramos);
    return periodo.ramos.reduce((acc, r) => {
      const info = todos.find(opt => opt.codigo === r.codigoRamo);
      return acc + (info?.creditos || 0);
    }, 0);
  }, [periodo.ramos, opcionesPorNivel]);

  const excede = totalCreditos > 30;

  return (
    <div className={`border p-4 rounded-lg mb-4 transition-colors ${excede ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-gray-700">Período {index + 1}</h4>
        <div className={`text-xs font-bold px-2 py-1 rounded ${excede ? 'bg-red-200 text-red-800' : 'bg-blue-100 text-blue-700'}`}>
          {totalCreditos} / 30 créditos
        </div>
      </div>

      <input type="text" value={periodo.catalogo} readOnly className="w-full p-2 border rounded mb-3 bg-white text-gray-600 text-sm" />

      <button type="button" onClick={() => agregarRamo(index)} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded mb-3 transition">
        + Agregar Ramo
      </button>

      {periodo.ramos.map((r, j) => (
        <RamoItem
          key={j}
          ramo={r}
          opcionesPorNivel={opcionesPorNivel}
          ramosSeleccionados={ramosSeleccionados}
          ramosDisponibles={ramosDisponibles}
          nivelEstudiante={nivelEstudiante}
          onChange={(field, value, nombreExtra) => actualizarRamo(index, j, field, value, nombreExtra)}
          onRemove={() => eliminarRamo(index, j)}
        />
      ))}
      
      {excede && <p className="text-xs text-red-500 mt-2 text-center">⚠️ Excede carga normal.</p>}
    </div>
  );
}