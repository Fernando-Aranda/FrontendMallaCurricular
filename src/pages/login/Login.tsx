"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react"

// 1. IMPORTAMOS LAS IMÁGENES AQUÍ
// Ajusta la cantidad de '../' según la profundidad de tu carpeta 'pages' o 'components'
import ucnBg from "../../assets/images/foto-ucn.png" 
import ucnLogo from "../../assets/images/ucn_logo.png"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Simular login
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Login exitoso", { email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img 
          src={ucnBg}
          alt="Campus UCN"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/60 to-slate-900/80" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div className="flex items-center gap-3 opacity-90">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">UCN</h2>
              <p className="text-[10px] text-blue-100 uppercase tracking-widest">Portal Estudiantes</p>
            </div>
          </div>

          <div className="space-y-4 max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Tu futuro comienza aquí
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed font-light">
              Accede a tus recursos académicos, inscribe tus asignaturas y gestiona tu avance curricular en un solo lugar.
            </p>
          </div>

          <p className="text-xs text-blue-200/60">© 2025 Universidad Católica del Norte.</p>
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-sm">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <img 
                src={ucnLogo} 
                alt="Logo UCN" 
                className="h-24 w-auto object-contain mb-6" 
            />
            
            <h1 className="text-2xl font-bold text-slate-800 text-center">
              Iniciar Sesión
            </h1>
            <p className="text-slate-500 text-sm mt-2 text-center">
              Ingresa tus credenciales institucionales
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">
                Correo electrónico
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="usuario@ucn.cl"
                  className="w-full py-3 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Contraseña
                </label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  ¿Olvidaste tu clave?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full py-3 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <p className="text-xs font-medium text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-[0.98] mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Ingresando...</span>
                </>
              ) : (
                "Ingresar al Portal"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}