import React from "react";

interface Props {
  rut: string;
  nombre: string;
  codigoCarrera: string;
  setNombre: (v: string) => void;
}

export default function FormHeader({
  rut,
  nombre,
  codigoCarrera,
  setNombre,
}: Props) {
  return (
    <div className="space-y-3 mb-6">
      {/* Información de Contexto (Discreta) */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>Carrera: {codigoCarrera}</span>
      </div>

      {/* Input Principal */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Nombre de la proyección
        </label>
        <input
          type="text"
          placeholder="Ej: Planificación 2026 - Opción A"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
        />
      </div>
    </div>
  );
}