import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { CREAR_PROYECCION } from "../../../api/graphql/mutations/proyeccionesMutation";
import { useAvance } from "../../../hooks/useAvance";
import { useMallas } from "../../../hooks/useMallas";
import { useAvanceProcesado } from "../../avance/hooks/useAvanceProcesado";
import type { Proyeccion } from "../../../types/proyeccion";

// 1. ACTUALIZAR INTERFAZ: Agregar nombreAsignatura
export interface RamoInput {
  codigoRamo: string;
  semestre: number;
  nombreAsignatura?: string; // Nuevo campo opcional
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
  if (sem === 15) return year * 100 + 20; 
  if (sem === 25) return (year + 1) * 100 + 10; 

  throw new Error("Periodo inválido para calcular siguiente");
}

export const useCrearProyeccion = () => {
  const { codigo } = useParams<{ codigo?: string }>();
  const { user } = useAuth();

  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [codigoCarrera, setCodigoCarrera] = useState(codigo ?? "");

  const [periodos, setPeriodos] = useState<PeriodoInput[]>([]);

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

  const periodosHistoricos = useMemo(() => {
    if (!avance || !Array.isArray(avance)) return [];
    
    const raw = avance.map((a: any) => a.period).filter((p) => p && p !== "0");
    
    const semestresRegulares = raw.filter(p => {
       const terminacion = p.toString().slice(-2);
       return terminacion === "10" || terminacion === "20";
    });
    
    return Array.from(new Set(semestresRegulares)).sort();
  }, [avance]);

  useEffect(() => {
    if (user?.rut) setRut(user.rut);
  }, [user]);

  useEffect(() => {
    if (codigo) setCodigoCarrera(codigo);
  }, [codigo]);

  const [crearProyeccion, { loading, error, data }] = useMutation(CREAR_PROYECCION);

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

  const eliminarUltimoPeriodo = () => {
    setPeriodos((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  };

  const agregarRamo = (iPeriodo: number) => {
    setPeriodos((prev) => {
      const semestreAutomatico = iPeriodo + 1;
      const nuevosPeriodos = [...prev];
      const periodoActualizado = {
        ...nuevosPeriodos[iPeriodo],
        ramos: [
          ...nuevosPeriodos[iPeriodo].ramos,
          { codigoRamo: "", semestre: semestreAutomatico, nombreAsignatura: "" }, // Inicializamos vacío
        ],
      };
      nuevosPeriodos[iPeriodo] = periodoActualizado;
      return nuevosPeriodos;
    });
  };

  // 2. ACTUALIZAR LÓGICA: Recibir nombre opcionalmente
  const actualizarRamo = (
    iPeriodo: number,
    iRamo: number,
    field: keyof RamoInput,
    value: string | number,
    nombreExtra?: string // Parametro extra para el nombre
  ) => {
    setPeriodos((prev) => {
      const nuevosPeriodos = [...prev];
      const nuevosRamos = [...nuevosPeriodos[iPeriodo].ramos];
      
      nuevosRamos[iRamo] = {
        ...nuevosRamos[iRamo],
        [field]: value,
      } as RamoInput;

      // Si nos pasaron el nombre (porque seleccionó del dropdown), lo guardamos
      if (nombreExtra) {
        nuevosRamos[iRamo].nombreAsignatura = nombreExtra;
      }

      nuevosPeriodos[iPeriodo] = {
        ...nuevosPeriodos[iPeriodo],
        ramos: nuevosRamos,
      };
      return nuevosPeriodos;
    });
  };

  const eliminarRamo = (iPeriodo: number, iRamo: number) => {
    setPeriodos((prev) => {
      const nuevosPeriodos = [...prev];
      const nuevosRamos = [...nuevosPeriodos[iPeriodo].ramos];
      nuevosRamos.splice(iRamo, 1);
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
    setCodigoCarrera,
    setRut,
    agregarPeriodo,
    eliminarUltimoPeriodo,
    agregarRamo,
    actualizarRamo,
    eliminarRamo,
    handleSubmit,
    formInvalido,
    periodosHistoricos,
  };
};