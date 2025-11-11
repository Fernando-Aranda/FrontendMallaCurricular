"use client"

import { Link } from "react-router-dom"
import NavigationUcn from "../../components/NavigationUcn"

// Hook personalizado
import { useCrearProyeccion } from "./hooks/useCrearProyeccion"

// Componentes de presentación
import ResumenAvance from "./components/ResumenAvance"
import ConfiguracionProyeccion from "./components/ConfiguracionProyeccion"
import ListaRamosDisponibles from "./components/ListaRamosDisponibles"
import VistaProyeccion from "./components/VistaProyeccion"
import AccionesProyeccion from "./components/AccionesProyeccion"

const CrearProyeccion = () => {
  const {
    loading,
    error,
    proyeccionData,
    codigo,
    carrera,
    nombreProyeccion,
    semestreActual,
    ramosSeleccionados,
    guardando,
    ramosPorSemestre,
    maxSemestre,
    setNombreProyeccion,
    setSemestreActual,
    verificarPrerequisitos,
    agregarRamo,
    eliminarRamo,
    cambiarSemestre,
    handleGuardarProyeccion,
    navigate,
  } = useCrearProyeccion()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationUcn />
        <div className="p-8 text-center">
          <p className="text-lg">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (error || !proyeccionData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationUcn />
        <div className="p-8 text-center">
          <p className="text-red-600 text-lg">{error || "Error al cargar los datos"}</p>
          <Link to="/home" className="text-blue-500 underline mt-4 inline-block">
            Volver al home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationUcn codigoCarrera={codigo} />

      <main className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Crear Proyección de Semestre</h1>
        <p className="text-gray-600 mb-6">{carrera?.nombre}</p>

        <ResumenAvance proyeccionData={proyeccionData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ConfiguracionProyeccion
              nombreProyeccion={nombreProyeccion}
              onNombreChange={setNombreProyeccion}
              semestreActual={semestreActual}
              onSemestreChange={setSemestreActual}
            />
            <ListaRamosDisponibles
              ramosLiberados={proyeccionData.ramosLiberados}
              ramosSeleccionados={ramosSeleccionados}
              semestreActual={semestreActual}
              verificarPrerequisitos={verificarPrerequisitos}
              onAgregarRamo={agregarRamo}
            />
          </div>

          <div className="space-y-6">
            <VistaProyeccion
              ramosSeleccionados={ramosSeleccionados}
              ramosPorSemestre={ramosPorSemestre}
              maxSemestre={maxSemestre}
              onEliminarRamo={eliminarRamo}
              onCambiarSemestre={cambiarSemestre}
            />
            <AccionesProyeccion
              onGuardar={handleGuardarProyeccion}
              onCancelar={() => navigate("/home")}
              guardando={guardando}
              puedeGuardar={ramosSeleccionados.length > 0}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default CrearProyeccion