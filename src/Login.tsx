import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Un componente simple para el ícono de Google para no instalar otra librería
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.655-3.356-11.303-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,35.138,44,30.025,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


const Login = () => {
    const navigate = useNavigate();
    
    // State variables
    const [authing, setAuthing] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

// Esta función simula un inicio de sesión con Google.
    const signInWithGoogle = async (userType: 'Docente' | 'Estudiante') => {
        setAuthing(true);
        setError('');
        console.log(`Iniciando sesión con Google como ${userType}...`);
        
        // Simulación temporal (placeholder)
        setTimeout(() => {
            console.log(`Simulación: usuario ${userType} logueado con Google`);
            navigate('/');
            setAuthing(false);
        }, 1000);
    };

    // Esta función simula un inicio de sesión con usuario y contraseña.
    const signInWithCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Ahora TypeScript sabe que .preventDefault() existe en 'e'
        setAuthing(true);
        setError('');

        // Simulación temporal (placeholder)
        setTimeout(() => {
            if (username === 'testuser' && password === '123456') {
                console.log('Simulación: usuario logueado con credenciales');
                navigate('/');
            } else {
                setError('Credenciales inválidas (placeholder)');
            }
            setAuthing(false);
        }, 1000);
    };
    return (
        <div className='w-full h-screen flex'>
            {/* Lado izquierdo azul */}
            <div className='hidden lg:flex w-1/2 h-full bg-slate-800 items-center justify-center'>
                {/* Puedes poner una imagen o logo grande aquí si quieres */}
            </div>

            {/* Lado derecho (formulario de login) */}
            <div className='w-full lg:w-1/2 h-full bg-white flex flex-col justify-center items-center p-8'>
                <div className='w-full max-w-md'>
                    <div className='text-center mb-8'>
                        <img src="https://campusvirtual.ucn.cl/pluginfile.php/1/theme_mb2nl/logo/1756715009/ucn_logo.png" alt="Logo UCN" className="mx-auto mb-6 h-12" />
                        <h1 className='text-3xl font-semibold text-gray-800'>Acceder</h1>
                    </div>
               
                    {/* Botones de Google */}
                    <div className='space-y-3 mb-6'>
                        <button
                            onClick={() => signInWithGoogle('Docente')}
                            disabled={authing}
                            className='w-full flex items-center justify-center bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300'>
                            <GoogleIcon />
                            Continuar como Acceso Docentes
                        </button>
                        <button
                            onClick={() => signInWithGoogle('Estudiante')}
                            disabled={authing}
                            className='w-full flex items-center justify-center bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300'>
                            <GoogleIcon />
                            Continuar como Acceso Estudiantes
                        </button>
                    </div>

                    {/* Divisor "o" */}
                    <div className='flex items-center my-6'>
                        <hr className='flex-grow border-gray-300' />
                        <span className='mx-4 text-gray-400'>o</span>
                        <hr className='flex-grow border-gray-300' />
                    </div>

                    {/* Formulario de credenciales */}
                    <form onSubmit={signInWithCredentials}>
                        <div className='relative mb-4'>
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </span>
                            <input
                                type='text'
                                placeholder='Nombre de usuario'
                                className='w-full text-gray-700 py-3 pl-10 pr-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className='relative mb-4'>
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </span>
                            <input
                                type='password'
                                placeholder='Contraseña'
                                className='w-full text-gray-700 py-3 pl-10 pr-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        
                        <div className='text-sm mb-6'>
                            <a href="#" className='font-medium text-orange-600 hover:text-orange-500'>
                                ¿Olvidó su nombre de usuario o contraseña?
                            </a>
                        </div>
                        
                        {error && <div className='text-red-500 mb-4 text-sm'>{error}</div>}

                        <button
                            type="submit"
                            className='w-full bg-orange-500 hover:bg-orange-600 text-white my-2 font-semibold rounded-md p-3 text-center transition duration-300'
                            disabled={authing}>
                            Acceder
                        </button>
                    </form>

                    
                </div>
                
                {/* Footer */}
                <div className="w-full max-w-md text-center mt-10 text-xs text-gray-500">
                    <p>Copyright © 2025 UCN Todos los derechos reservados</p>
                    <a href="#" className="hover:underline">English</a>
                    {/* Aquí puedes añadir los íconos de redes sociales si lo necesitas */}
                </div>
            </div>
        </div>
    );
}

export default Login;