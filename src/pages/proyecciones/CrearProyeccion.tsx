import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAvance } from "../../hooks/useAvance";
import { useMallas } from "../../hooks/useMallas";
import { createProyeccion } from "../../services/proyeccionesService";

interface SemestreRamo {
  codigo: string;
  bloqueado?: boolean;
}

const CrearProyeccion = () => {
  const { user, token } = useAuth();
  const { avance } = useAvance();
  const { mallas } = useMallas();

  const [nombreProyeccion, setNombreProyeccion] = useState("");
  const [semestres, setSemestres] = useState<Record<number, SemestreRamo[]>>({});
  const [ramosFaltantes, setRamosFaltantes] = useState<SemestreRamo[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 1️⃣ Ramos aprobados y en curso
  const ramosAprobados = useMemo(() => new Set(avance.filter(a => a.status === 'APROBADO').map(a => a.course)), [avance]);
  const ramosCursando = useMemo(() => avance.filter(a => a.status !== 'APROBADO').map(a => a.course), [avance]);

  // 2️⃣ Organizar semestres iniciales
  useEffect(() => {
    const s: Record<number, SemestreRamo[]> = {};

    // Semestres cursados
    let semCursados = 1;
    for (const codigo of ramosAprobados) {
      if (!s[semCursados]) s[semCursados] = [];
      s[semCursados].push({ codigo });
      // simple: repartir aprobados en los primeros semestres (puedes ajustar según semestre real)
      if (s[semCursados].length >= 5) semCursados++;
    }

    // Semestre actual
    const semActual = semCursados + 1;
    s[semActual] = ramosCursando.map(c => ({ codigo: c }));

    setSemestres(s);

    // Ramos faltantes
    const faltantes = mallas
      .filter(m => !ramosAprobados.has(m.codigo) && !ramosCursando.includes(m.codigo))
      .map(m => ({ codigo: m.codigo, bloqueado: false }));

    setRamosFaltantes(faltantes);
  }, [ramosAprobados, ramosCursando, mallas]);

  // 3️⃣ Función para arrastrar
  const handleDrop = (codigo: string, semestre: number) => {
    // No arrastrar ramos bloqueados
    const ramo = ramosFaltantes.find(r => r.codigo === codigo);
    if (ramo?.bloqueado) return;

    // Eliminar de ramos faltantes
    setRamosFaltantes(prev => prev.filter(r => r.codigo !== codigo));

    // Agregar al semestre
    setSemestres(prev => {
      const s = { ...prev };
      if (!s[semestre]) s[semestre] = [];
      s[semestre].push({ codigo });
      return s;
    });
  };

  // 4️⃣ Recalcular bloqueados
  useEffect(() => {
    const asignados = new Set(Object.values(semestres).flat().map(r => r.codigo));
    const nuevos = ramosFaltantes.map(r => {
      const prereq = mallas.find(m => m.codigo === r.codigo)?.prereq;
      if (!prereq) return { ...r, bloqueado: false };
      const prereqs = prereq.split(',');
      return { ...r, bloqueado: !prereqs.every(p => ramosAprobados.has(p) || asignados.has(p)) };
    });
    setRamosFaltantes(nuevos);
  }, [semestres, ramosAprobados, ramosFaltantes, mallas]);

  // 5️⃣ Guardar proyección
  const handleSubmit = async () => {
    if (!token || !user) return;
    if (!nombreProyeccion) return alert("Ingrese un nombre para la proyección");

    const ramosPayload: { codigoRamo: string; semestre: number }[] = [];
    Object.entries(semestres).forEach(([sem, lista]) => {
      lista.forEach(r => ramosPayload.push({ codigoRamo: r.codigo, semestre: Number(sem) }));
    });

    setLoading(true);
    setMsg("");
    try {
      await createProyeccion(token, { rut: user.rut, nombre: nombreProyeccion, ramos: ramosPayload });
      setMsg("Proyección creada con éxito ✅");
    } catch (err) {
      console.error(err);
      setMsg("Error al crear proyección ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Crear Proyección</h1>

      <input
        type="text"
        placeholder="Nombre de la proyección"
        value={nombreProyeccion}
        onChange={e => setNombreProyeccion(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <div className="flex gap-8">
        {/* Panel ramos faltantes */}
        <div className="w-1/4 border p-2">
          <h2 className="font-semibold mb-2">Ramos faltantes</h2>
          {ramosFaltantes.map(r => (
            <div
              key={r.codigo}
              className={`p-1 border mb-1 cursor-pointer ${r.bloqueado ? "bg-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}`}
              draggable={!r.bloqueado}
              onDragStart={(e) => e.dataTransfer.setData("text/plain", r.codigo)}
            >
              {r.codigo}
            </div>
          ))}
        </div>

        {/* Panel semestres */}
        <div className="flex-1 grid grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(sem => (
            <div
              key={sem}
              className="border p-2 min-h-[150px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const codigo = e.dataTransfer.getData("text/plain");
                handleDrop(codigo, sem);
              }}
            >
              <h3 className="font-semibold mb-1">Semestre {sem}</h3>
              {(semestres[sem] || []).map(r => (
                <div key={r.codigo} className="p-1 border mb-1">{r.codigo}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Guardando..." : "Guardar Proyección"}
      </button>

      {msg && <p className="mt-2">{msg}</p>}
    </div>
  );
};

export default CrearProyeccion;
