import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "../../context/AuthContext";
import { CREAR_PROYECCION } from "../../api/graphql/mutations/proyeccionesMutation";
import type { Proyeccion } from "../../types/proyeccion";
import NavigationUcn from "../../components/NavigationUcn";

// 🔥 Importamos hooks del avance (NO modif. AvancePage)
import { useAvance } from "../../hooks/useAvance";
import { useMallas } from "../../hooks/useMallas";
import { useAvanceProcesado } from "../avance/hooks/useAvanceProcesado";

interface CrearProyeccionResponse {
  crearProyeccion: Proyeccion;
}

interface RamoInput {
  codigoRamo: string;
  semestre: number;
}

interface PeriodoInput {
  catalogo: string;
  ramos: RamoInput[];
}

// ------------------------------------------------------
// FUNCIÓN PARA CALCULAR SIGUIENTE PERÍODO
// ------------------------------------------------------
function obtenerSiguientePeriodo(periodo: number): number {
  const year = Math.floor(periodo / 100);
  const sem = periodo % 100;

  if (sem === 10) return year * 100 + 20;
  if (sem === 20) return (year + 1) * 100 + 10;

  throw new Error("Periodo inválido (debe terminar en 10 o 20)");
}

export default function CrearProyeccion() {
  const { codigo } = useParams<{ codigo?: string }>();
  const { user } = useAuth();

  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [codigoCarrera, setCodigoCarrera] = useState(codigo ?? "");

  const [periodos, setPeriodos] = useState<PeriodoInput[]>([]);

  // OBTENER AVANCE
  const { avance, loading: loadingAvance } = useAvance();
  const { mallas, loading: loadingMallas } = useMallas();
  const { processedCourses } = useAvanceProcesado(avance, mallas, "TODOS");

  // CALCULAR ÚLTIMO PERIODO
  const ultimoPeriodo = useMemo(() => {
    const periodos = Array.from(processedCourses.values())
      .map((c) => Number(c.latestPeriod))
      .filter(Boolean);

    if (periodos.length === 0) return null;
    return Math.max(...periodos);
  }, [processedCourses]);

  // SET RUT
  useEffect(() => {
    if (user?.rut) setRut(user.rut);
  }, [user]);

  const [crearProyeccion, { loading, error, data }] = useMutation<
    CrearProyeccionResponse,
    {
      data: {
        rut: string;
        nombre: string;
        codigoCarrera: string;
        periodos: PeriodoInput[];
      };
    }
  >(CREAR_PROYECCION);

  const handleSubmitCreacion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearProyeccion({
        variables: {
          data: { rut, nombre, codigoCarrera, periodos },
        },
      });
      alert("Proyección creada correctamente 🎉");
    } catch (err) {
      console.error("Error creando proyección:", err);
    }
  };

  // ------------------------------------------------------
  // AGREGAR PERIODO AUTOMÁTICAMENTE
  // ------------------------------------------------------
  const agregarPeriodo = () => {
    setPeriodos((prev) => {
      let nuevoCatalogo = "";

      if (prev.length === 0) {
        nuevoCatalogo = ultimoPeriodo
          ? obtenerSiguientePeriodo(ultimoPeriodo).toString()
          : "202410";
      } else {
        const ultimo = Number(prev[prev.length - 1].catalogo);
        nuevoCatalogo = obtenerSiguientePeriodo(ultimo).toString();
      }

      return [...prev, { catalogo: nuevoCatalogo, ramos: [] }];
    });
  };

  const agregarRamo = (iPeriodo: number) => {
    const copia = [...periodos];
    const semestreAutomatico = iPeriodo + 1;

    copia[iPeriodo].ramos.push({
      codigoRamo: "",
      semestre: semestreAutomatico,
    });

    setPeriodos(copia);
  };

  const actualizarRamo = (
    iPeriodo: number,
    iRamo: number,
    field: keyof RamoInput,
    value: string | number
  ) => {
    const copia = [...periodos];
    copia[iPeriodo].ramos[iRamo][field] = value as never;
    setPeriodos(copia);
  };

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
          onSubmit={handleSubmitCreacion}
          className="bg-white p-6 rounded-xl shadow-md space-y-4"
        >
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

          {/* Periodos */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">
              Agregar Periodos y Ramos
            </h3>

            <button
              type="button"
              onClick={agregarPeriodo}
              className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              + Agregar Período
            </button>

            {periodos.map((p, i) => (
              <div key={i} className="border p-4 rounded-lg bg-gray-50 mb-4">
                <h4 className="font-bold mb-2">Período {i + 1}</h4>

                {/* ⛔ AHORA NO EDITABLE */}
                <input
                  type="text"
                  value={p.catalogo}
                  readOnly
                  className="w-full p-2 border rounded mb-3 bg-gray-100 text-gray-600"
                />

                <button
                  type="button"
                  onClick={() => agregarRamo(i)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mb-3"
                >
                  + Agregar Ramo
                </button>

                {p.ramos.map((r, j) => (
                  <div key={j} className="bg-white border p-3 rounded mb-2">
                    <input
                      type="text"
                      placeholder="Código Ramo"
                      value={r.codigoRamo}
                      onChange={(e) =>
                        actualizarRamo(i, j, "codigoRamo", e.target.value)
                      }
                      className="w-full p-2 border rounded mb-2"
                    />

                    {/* ⛔ AHORA NO EDITABLE */}
                    <input
                      type="number"
                      value={r.semestre}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100 text-gray-600"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
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
      </main>
    </div>
  );
}
