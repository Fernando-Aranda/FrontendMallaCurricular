import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { CREAR_PROYECCION } from "../../../api/graphql/mutations/proyeccionesMutation";
import { useAvance } from "../../../hooks/useAvance";
import { useMallas } from "../../../hooks/useMallas";
import { useAvanceProcesado } from "../../avance/hooks/useAvanceProcesado";
import type { Proyeccion } from "../../../types/proyeccion";

export interface RamoInput {
  codigoRamo: string;
  semestre: number;
}

export interface PeriodoInput {
  catalogo: string;
  ramos: RamoInput[];
}

interface CrearProyeccionResponse {
  crearProyeccion: Proyeccion;
}

export function obtenerSiguientePeriodo(periodo: number): number {
  const year = Math.floor(periodo / 100);
  const sem = periodo % 100;

  if (sem === 10) return year * 100 + 20;
  if (sem === 20) return (year + 1) * 100 + 10;

  throw new Error("Periodo inválido (debe terminar en 10 o 20)");
}

export const useCrearProyeccion = () => {
  const { codigo } = useParams<{ codigo?: string }>();
  const { user } = useAuth();

  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [codigoCarrera, setCodigoCarrera] = useState(codigo ?? "");

  const [periodos, setPeriodos] = useState<PeriodoInput[]>([]);

  // Avance / mallas -> ultimoPeriodo
  const { avance, loading: loadingAvance } = useAvance();
  const { mallas, loading: loadingMallas } = useMallas();
  const { processedCourses } = useAvanceProcesado(avance, mallas, "TODOS");

  const ultimoPeriodo = useMemo(() => {
    const periodosNums = Array.from(processedCourses.values())
      .map((c) => Number(c.latestPeriod))
      .filter(Boolean);

    if (periodosNums.length === 0) return null;
    return Math.max(...periodosNums);
  }, [processedCourses]);

  useEffect(() => {
    if (user?.rut) setRut(user.rut);
  }, [user]);

  useEffect(() => {
    if (codigo) setCodigoCarrera(codigo);
  }, [codigo]);

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

  // agregar periodo (usa ultimoPeriodo si corresponde)
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
    setPeriodos((prev) => {
      const semestreAutomatico = iPeriodo + 1;
      
      // 1. Copia el array de periodos (inmutable)
      const nuevosPeriodos = [...prev]; 
      
      // 2. Copia el objeto Periodo que vas a modificar (inmutable)
      const periodoActualizado = {
        ...nuevosPeriodos[iPeriodo],
        // 3. Copia el array de Ramos y añade el nuevo ramo (inmutable)
        ramos: [
          ...nuevosPeriodos[iPeriodo].ramos,
          { codigoRamo: "", semestre: semestreAutomatico },
        ],
      };

      // 4. Sustituye el objeto Periodo mutado con el objeto Periodo actualizado inmutable
      nuevosPeriodos[iPeriodo] = periodoActualizado;
      
      return nuevosPeriodos; // Retorna el nuevo estado inmutable
    });
  };

  const actualizarRamo = (
    iPeriodo: number,
    iRamo: number,
    field: keyof RamoInput,
    value: string | number
  ) => {
    setPeriodos((prev) => {
      // Copia el array de periodos
      const nuevosPeriodos = [...prev]; 
      
      // Copia el array de ramos
      const nuevosRamos = [...nuevosPeriodos[iPeriodo].ramos]; 
      
      // Copia el ramo que se está actualizando
      nuevosRamos[iRamo] = { 
        ...nuevosRamos[iRamo],
        [field]: value,
      } as RamoInput;

      // Actualiza el objeto Periodo (copiado)
      nuevosPeriodos[iPeriodo] = {
        ...nuevosPeriodos[iPeriodo],
        ramos: nuevosRamos,
      };
      
      return nuevosPeriodos;
    });
  };

  const formInvalido = useMemo(() => {
    if (!nombre.trim()) return true;
    if (periodos.length === 0) return true;

    for (const p of periodos) {
      if (p.ramos.length === 0) return true;
      for (const r of p.ramos) {
        if (!r.codigoRamo.trim()) return true;
      }
    }

    return false;
  }, [nombre, periodos]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    if (formInvalido) {
      // deja que la UI pueda mostrar alerta si quiere
      alert("Completa todos los campos antes de guardar.");
      return;
    }

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

  return {
    // estados y flags
    rut,
    nombre,
    codigoCarrera,
    periodos,
    loading,
    error,
    data,
    loadingAvance,
    loadingMallas,

    // setters / acciones
    setNombre,
    setCodigoCarrera,
    setRut,
    agregarPeriodo,
    agregarRamo,
    actualizarRamo,
    handleSubmit,

    // validación
    formInvalido,
  };
};
