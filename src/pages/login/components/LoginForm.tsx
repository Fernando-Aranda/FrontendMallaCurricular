import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInWithCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <img
          src="/src/assets/images/ucn_logo.png"
          alt="Logo UCN"
          className="mx-auto mb-6 h-24"
        />
        <h1 className="text-3xl font-semibold text-gray-800">Acceder</h1>
      </div>

      {/* Formulario */}
      <form onSubmit={signInWithCredentials}>
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full text-gray-700 py-3 pl-10 pr-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative mb-4">
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full text-gray-700 py-3 pl-10 pr-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white my-2 font-semibold rounded-md p-3 text-center transition duration-300 disabled:bg-orange-300"
          disabled={loading}
        >
          {loading ? "Accediendo..." : "Acceder"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
