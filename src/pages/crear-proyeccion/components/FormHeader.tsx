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
    <>
      <input
        type="text"
        placeholder="RUT"
        value={rut}
        readOnly
        className="w-full p-3 border border-gray-200 bg-gray-100 rounded-lg"
      />

      <input
        type="text"
        placeholder="Nombre de la proyección"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg"
      />

      <input
        type="text"
        placeholder="Código carrera"
        value={codigoCarrera}
        readOnly
        className="w-full p-3 border border-gray-200 bg-gray-100 rounded-lg text-gray-600"
      />
    </>
  );
}
