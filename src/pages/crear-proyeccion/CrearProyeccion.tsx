import React from "react";
import { useParams } from "react-router-dom";
import NavigationUcn from "../../components/NavigationUcn";
import FormHeader from "./components/FormHeader";
import PeriodoList from "./components/PeriodoList";
import ProyeccionPreview from "./components/ProyeccionPreview";
import { useCrearProyeccion } from "./hooks/useCrearProyeccion";
import { useMallasFiltradas } from "../../hooks/useMallasFiltradas";

export default function CrearProyeccion() {
  const params = useParams();
  // Lógica para leer el código de la URL (soporta ambos nombres)
  const codigoUrl = params.codigoCarrera || params.codigo;

  const {
    rut,
    nombre,
    codigoCarrera: codigoHook, 
    periodos,
    loading,
    error,
    data,
    setNombre,
    agregarPeriodo,
    eliminarUltimoPeriodo,
    agregarRamo,
    eliminarRamo,
    actualizarRamo,
    handleSubmit,
    formInvalido,
    periodosHistoricos,
  } = useCrearProyeccion();

  const {
    opcionesPorPeriodo,
    loading: loadingFiltrado,
  } = useMallasFiltradas();

  const primerPeriodoHistoricoNum = (periodosHistoricos && periodosHistoricos.length > 0)
    ? parseInt(periodosHistoricos[0], 10)
    : null;

  const ramosSeleccionados = periodos
    .flatMap((p) => p.ramos)
    .map((r) => r.codigoRamo)
    .filter(Boolean);

  const codigoParaNav = codigoUrl || codigoHook;

  return (
    // 1. CONTENEDOR PRINCIPAL: Ocupa toda la pantalla, sin scroll en el body
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      
      {/* 2. NAVIGATION: Se queda fijo arriba naturalmente por ser flex item */}
      {/* El z-index asegura que la sombra se vea sobre el contenido */}
      <div className="flex-none z-10 relative">
        <NavigationUcn codigoCarrera={codigoParaNav} />
      </div>

      {/* 3. AREA DE CONTENIDO: Ocupa el resto del espacio y tiene SU PROPIO scroll */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full max-w-[1920px] mx-auto">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Crear Proyección
          </h2>
          {loadingFiltrado && <span className="text-blue-600 text-sm animate-pulse">Cargando malla...</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start pb-20">
          
          {/* Columna Izquierda: Vista Previa */}
          <div className="lg:col-span-7 order-2 lg:order-1">
             <ProyeccionPreview 
              periodos={periodos} 
              catalogoCompleto={opcionesPorPeriodo[0] ? opcionesPorPeriodo[0] : []} 
            />
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-100" 
            >
              <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
                Configuración
              </h3>

              <FormHeader
                rut={rut}
                nombre={nombre}
                codigoCarrera={codigoParaNav || ""}
                setNombre={setNombre}
              />

              <div className="max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                <PeriodoList
                  periodos={periodos}
                  agregarPeriodo={agregarPeriodo}
                  eliminarUltimoPeriodo={eliminarUltimoPeriodo}
                  agregarRamo={agregarRamo}
                  eliminarRamo={eliminarRamo}
                  actualizarRamo={actualizarRamo}
                  opcionesPorPeriodo={opcionesPorPeriodo}
                  ramosSeleccionados={ramosSeleccionados}
                  primerPeriodoHistorico={primerPeriodoHistoricoNum} 
                />
              </div>

              <div className="pt-4 border-t mt-4">
                <button
                  type="submit"
                  disabled={loading || formInvalido}
                  className={`w-full py-3 rounded-lg font-semibold transition shadow-md ${
                    loading || formInvalido
                      ? "bg-gray-400 cursor-not-allowed text-gray-100"
                      : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-[1.02]"
                  }`}
                >
                  {loading ? "Guardando..." : "Guardar Proyección"}
                </button>
              </div>
            </form>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm">{String(error)}</div>}
            
            {data && (
              <details className="bg-white p-2 rounded shadow text-xs text-gray-500">
                <summary>Ver respuesta del servidor</summary>
                <pre className="mt-2">{JSON.stringify(data.crearProyeccion, null, 2)}</pre>
              </details>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}