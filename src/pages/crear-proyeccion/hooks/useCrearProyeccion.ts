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
  nombreAsignatura?: string; 
}

export interface PeriodoInput {
  catalogo: string;
  ramos: RamoInput[];
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
  const params = useParams();
  const codigoDesdeUrl = params.codigoCarrera || params.codigo;
  
  const { user } = useAuth();

  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [codigoCarrera, setCodigoCarrera] = useState(codigoDesdeUrl ?? "");

  const [periodos, setPeriodos] = useState<PeriodoInput[]>([]);

  const { avance, loading: loadingAvance } = useAvance(codigoCarrera);
  const { mallas, loading: loadingMallas } = useMallas(codigoCarrera);
  
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
    if (codigoDesdeUrl) setCodigoCarrera(codigoDesdeUrl);
  }, [codigoDesdeUrl]);

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
          { codigoRamo: "", semestre: semestreAutomatico, nombreAsignatura: "" },
        ],
      };
      nuevosPeriodos[iPeriodo] = periodoActualizado;
      return nuevosPeriodos;
    });
  };

  const actualizarRamo = (
    iPeriodo: number,
    iRamo: number,
    field: keyof RamoInput,
    value: string | number,
    nombreExtra?: string 
  ) => {
    setPeriodos((prev) => {
      const nuevosPeriodos = [...prev];
      const nuevosRamos = [...nuevosPeriodos[iPeriodo].ramos];
      
      nuevosRamos[iRamo] = {
        ...nuevosRamos[iRamo],
        [field]: value,
      } as RamoInput;

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

  // --- MODIFICACIÓN PRINCIPAL AQUÍ ---
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (formInvalido) {
      alert("Completa todos los campos antes de guardar.");
      return;
    }

    try {
      const carreraInfo = user?.carreras.find(c => String(c.codigo) === String(codigoCarrera));
      if (!carreraInfo) {
          alert("Error: No se encontró la información de la carrera para obtener el catálogo.");
          return;
      }

      // 1. LIMPIEZA DE DATOS (SANITIZACIÓN)
      // Creamos una copia limpia que solo tenga lo que el Backend espera.
      // Eliminamos 'nombreAsignatura' porque el backend no lo permite en el DTO.
      const periodosLimpios = periodos.map((p) => ({
        catalogo: p.catalogo, 
        ramos: p.ramos.map((r) => ({
          codigoRamo: r.codigoRamo, // Código del ramo
          semestre: Number(r.semestre), // Aseguramos que sea número
          // NO incluimos nombreAsignatura aquí
        })),
      }));

      // 2. ENVIAR DATOS LIMPIOS
      await crearProyeccion({
        variables: {
          data: { 
              rut, 
              nombre, 
              codigoCarrera, 
              periodos: periodosLimpios // <--- Enviamos la copia limpia
          },
        },
      });
      alert("Proyección creada correctamente 🎉");
    } catch (err: any) {
      console.error("Error creando proyección:", err);
      
      // Mostrar el error exacto que viene del backend (útil para debug)
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
         const backendMessage = err.graphQLErrors[0].extensions?.response?.message;
         const generalMessage = err.graphQLErrors[0].message;
         
         if (Array.isArray(backendMessage)) {
             alert("Error de validación:\n- " + backendMessage.join("\n- "));
         } else {
             alert("Error del servidor: " + (backendMessage || generalMessage));
         }
      } else {
         alert("Error al guardar: " + err.message);
      }
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