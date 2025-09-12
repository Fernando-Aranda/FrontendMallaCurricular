// src/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInWithCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/estudiante/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas o error en el servidor");
      }

      const data = await response.json();
      console.log("Login response:", data);

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* Panel izquierdo */}
      <div className="hidden lg:flex w-1/2 h-full items-center justify-center bg-slate-800">
        <img
          src="/foto-ucn.png"
          alt="Foto UCN"
          className="w-11/12 h-5/6 object-cover rounded-3xl shadow-2xl"
        />
      </div>

      {/* Panel derecho */}
      <div className="w-full lg:w-1/2 h-full bg-white flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <img
              src="/ucn_logo.png" // ahora desde public
              alt="Logo UCN"
              className="mx-auto mb-6 h-24" // más grande
            />
            <h1 className="text-3xl font-semibold text-gray-800">Acceder</h1>
          </div>

          {/* Formulario */}
          <form onSubmit={signInWithCredentials}>
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 
                    7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Email (test@ucn.cl)"
                className="w-full text-gray-700 py-3 pl-10 pr-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 
                    002-2v-6a2 2 0 00-2-2H6a2 
                    2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 
                    4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Contraseña (password123)"
                className="w-full text-gray-700 py-3 pl-10 pr-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-sm mb-6">
              <a
                href="#"
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                ¿Olvidó su nombre de usuario o contraseña?
              </a>
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

        {/* Footer */}
        <div className="w-full max-w-md text-center mt-10 text-xs text-gray-500">
          <p>Copyright © 2025 UCN Todos los derechos reservados</p>
          <a href="#" className="hover:underline">
            English
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
