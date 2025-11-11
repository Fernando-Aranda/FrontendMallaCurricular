import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { CREAR_PROYECCION } from "../../api/graphql/mutations/proyeccionesMutation";
import type { CrearProyeccionInput, Proyeccion } from "../../types/proyeccion";

interface CrearProyeccionResponse {
  crearProyeccion: Proyeccion;
}

export default function CrearProyeccion() {
  const { codigo } = useParams<{ codigo: string }>(); // ✅ toma el código desde la URL

  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [codigoCarrera, setCodigoCarrera] = useState(codigo ?? ""); // ✅ usa el código
  const [periodos, setPeriodos] = useState<any[]>([]);

  const [crearProyeccion, { loading, error, data }] = useMutation<
    CrearProyeccionResponse,
    { data: CrearProyeccionInput }
  >(CREAR_PROYECCION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await crearProyeccion({
        variables: {
          data: {
            rut,
            nombre,
            codigoCarrera,
            periodos,
          },
        },
      });

      console.log("✅ Proyección creada:", result.data?.crearProyeccion);
      alert("Proyección creada con éxito 🎉");
    } catch (err) {
      console.error("Error creando proyección:", err);
    }
  };

  return (
    <div>
      <h2>Crear Proyección</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="RUT"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Código carrera"
          value={codigoCarrera}
          readOnly // ✅ lo mantiene fijo según la URL
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Proyección"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {data && (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(data.crearProyeccion, null, 2)}
        </pre>
      )}
    </div>
  );
}
