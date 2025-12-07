import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import NavigationUcn from "../../components/NavigationUcn";
import FormHeader from "./components/FormHeader";
import PeriodoList from "./components/PeriodoList";
import { useCrearProyeccion } from "./hooks/useCrearProyeccion";

// 🔥 Hook real actualizado
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
    loadingAvance,
    loadingMallas,
    setNombre,
    agregarPeriodo,
    agregarRamo,
    actualizarRamo,
    handleSubmit,
    formInvalido,
  } = useCrearProyeccion();

  // 🔥 Filtrado de mallas por periodo
  const {
    opcionesPorPeriodo,
    periodoMasAntiguo,
    periodoMasReciente,
    loading: loadingFiltrado,
    error: errorFiltrado,
  } = useMallasFiltradas(periodos);

  // 🔥 Lista de ramos seleccionados en toda la proyección
  const ramosSeleccionados = periodos
    .flatMap((p) => p.ramos.map((r) => r.codigoRamo))
    .filter(Boolean);

  // 🔥 Conjunto de códigos aprobados o inscritos para validar prerrequisitos
  const codigosNoDisponibles = useMemo(() => {
    const set = new Set<string>();
    periodos.forEach((p) => {
      p.ramos.forEach((r) => {
        set.add(r.codigoRamo);
      });
    });
    return set;
  }, [periodos]);

  // 🔥 Filtrado de prerrequisitos dinámico por periodo
  const opcionesFiltradasPorPeriodo = useMemo(() => {
    return opcionesPorPeriodo.map((niveles, iPeriodo) => {
      // Ramos seleccionados en periodos anteriores
      const ramosPrevios = periodos
        .slice(0, iPeriodo)
        .flatMap((p) => p.ramos.map((r) => r.codigoRamo));

      return niveles.map((nivelObj) => ({
        ...nivelObj,
        ramos: nivelObj.ramos.filter((ramo) => {
          if (!ramo.prereq) return true;
          const prereqs = ramo.prereq
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          // Todos los prerrequisitos deben estar en periodos anteriores o ya aprobados
          return prereqs.every((pr) => ramosPrevios.includes(pr) || codigosNoDisponibles.has(pr));
        }),
      }));
    });
  }, [opcionesPorPeriodo, periodos, codigosNoDisponibles]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationUcn codigoCarrera={codigoCarrera} />

      <main className="p-8 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Crear Proyección
        </h2>

        {(loadingAvance || loadingMallas) && (
          <p className="text-gray-600 mb-4">Cargando datos del avance...</p>
        )}

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

          {/* 🔥 Pasamos opciones filtradas por prerrequisitos */}
          <PeriodoList
            periodos={periodos}
            agregarPeriodo={agregarPeriodo}
            agregarRamo={agregarRamo}
            actualizarRamo={actualizarRamo}
            opcionesPorPeriodo={opcionesFiltradasPorPeriodo}
            ramosSeleccionados={ramosSeleccionados}
          />

          <button
            type="submit"
            disabled={loading || formInvalido}
            className={`w-full py-3 rounded-lg font-semibold transition
              ${
                loading || formInvalido
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {loading ? "Guardando..." : "Guardar Proyección"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}

        {data && (
          <pre className="mt-6 bg-gray-100 p-4 rounded-lg text-sm">
            {JSON.stringify(data.crearProyeccion, null, 2)}
          </pre>
        )}

        <div className="mt-6">
          <Link
            to={`/proyecciones/${codigoCarrera}`}
            className="text-blue-500 hover:underline"
          >
            ← Volver a proyecciones
          </Link>
        </div>

        {/* ======================================================
            🔥 PRUEBA VISUAL DEL HOOK
        ======================================================= */}
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            🔍 Prueba del Hook useMallasFiltradas
          </h3>

          {loadingFiltrado && <p>Cargando ramos filtrados...</p>}
          {errorFiltrado && (
            <p className="text-red-500">Error: {String(errorFiltrado)}</p>
          )}

          {!loadingFiltrado && !errorFiltrado && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(opcionesFiltradasPorPeriodo, null, 2)}
            </pre>
          )}
        </div>

        {/* ======================================================
            🔥 DEBUG: PERIODO MÁS ANTIGUO Y MÁS NUEVO
        ======================================================= */}
        <div className="mt-10 p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            🔍 Periodo más antiguo y más reciente (desde Avance)
          </h3>

          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(
              {
                periodoMasAntiguo,
                periodoMasReciente,
              },
              null,
              2
            )}
          </pre>
        </div>
      </main>
    </div>
  );
}
