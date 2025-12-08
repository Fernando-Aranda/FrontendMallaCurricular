import React from "react";
import NavigationUcn from "../../components/NavigationUcn";
import FormHeader from "./components/FormHeader";
import PeriodoList from "./components/PeriodoList";
import { useCrearProyeccion } from "./hooks/useCrearProyeccion";
import { useMallasFiltradas } from "../../hooks/useMallasFiltradas";

export default function CrearProyeccion() {
  const {
    rut,
    nombre,
    codigoCarrera,
    periodos,
    loading,
    error,
    data,
    setNombre,
    agregarPeriodo,
    agregarRamo,
    actualizarRamo,
    handleSubmit,
    formInvalido,
  } = useCrearProyeccion();

  // 🔹 Filtrado de mallas (sin excluir nada)
  const {
    opcionesPorPeriodo,
    loading: loadingFiltrado,
    error: errorFiltrado,
    periodoMasAntiguo,
    periodoMasReciente,
  } = useMallasFiltradas();

  // 🔹 Lista de ramos seleccionados en toda la proyección
  const ramosSeleccionados = periodos
    .flatMap((p) => p.ramos)
    .map((r) => r.codigoRamo)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationUcn codigoCarrera={codigoCarrera} />

      <main className="p-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Crear Proyección
        </h2>

        {loadingFiltrado && <p className="text-gray-600 mb-4">Cargando ramos...</p>}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md space-y-4"
        >
          <FormHeader
            rut={rut}
            nombre={nombre}
            codigoCarrera={codigoCarrera}
            setNombre={setNombre}
          />

          {/* 🔹 Pasamos todas las opciones por periodo */}
          <PeriodoList
            periodos={periodos}
            agregarPeriodo={agregarPeriodo}
            agregarRamo={agregarRamo}
            actualizarRamo={actualizarRamo}
            opcionesPorPeriodo={opcionesPorPeriodo}
            ramosSeleccionados={ramosSeleccionados}
          />

          <button
            type="submit"
            disabled={loading || formInvalido}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading || formInvalido
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Guardando..." : "Guardar Proyección"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500">Error: {String(error)}</p>}
        {data && (
          <pre className="mt-6 bg-gray-100 p-4 rounded-lg text-sm">
            {JSON.stringify(data.crearProyeccion, null, 2)}
          </pre>
        )}

        {/* 🔹 Debug completo */}
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            🔍 Todos los ramos con historial
          </h3>
          {loadingFiltrado && <p>Cargando...</p>}
          {errorFiltrado && <p className="text-red-500">Error: {String(errorFiltrado)}</p>}
          {!loadingFiltrado && !errorFiltrado && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(opcionesPorPeriodo, null, 2)}
            </pre>
          )}
        </div>

        {/* 🔹 Periodo más antiguo y más reciente */}
        {!loadingFiltrado && !errorFiltrado && (
          <div className="mt-6 p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-700">
              📅 Periodo más antiguo y más reciente
            </h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({ periodoMasAntiguo, periodoMasReciente }, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
