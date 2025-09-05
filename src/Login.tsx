import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    
    // State variables
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Placeholder function for Google login
    const signInWithGoogle = async () => {
        setAuthing(true);
        setError('');

        // Simulación temporal (placeholder)
        setTimeout(() => {
            console.log('Simulación: usuario logueado con Google');
            navigate('/');
            setAuthing(false);
        }, 1000);
    };

    // Placeholder function for Email/Password login
    const signInWithEmail = async () => {
        setAuthing(true);
        setError('');

        // Simulación temporal (placeholder)
        setTimeout(() => {
            if (email === 'test@example.com' && password === '123456') {
                console.log('Simulación: usuario logueado con email/password');
                navigate('/');
            } else {
                setError('Credenciales inválidas (placeholder)');
            }
            setAuthing(false);
        }, 1000);
    };

    return (
        <div className='w-full h-screen flex'>
            {/* Left side */}
            <div className='w-1/2 h-full flex flex-col bg-[#282c34] items-center justify-center'>
            </div>

            {/* Right side (login form) */}
            <div className='w-1/2 h-full bg-[#1a1a1a] flex flex-col p-20 justify-center'>
                <div className='w-full flex flex-col max-w-[450px] mx-auto'>
                    {/* Header */}
                    <div className='w-full flex flex-col mb-10 text-white'>
                        <h3 className='text-4xl font-bold mb-2'>Login</h3>
                        <p className='text-lg mb-4'>Welcome Back! Please enter your details.</p>
                    </div>

                    {/* Inputs */}
                    <div className='w-full flex flex-col mb-6'>
                        <input
                            type='email'
                            placeholder='Email (placeholder)'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <input
                            type='password'
                            placeholder='Password (placeholder)'
                            className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    {/* Login with Email */}
                    <div className='w-full flex flex-col mb-4'>
                        <button
                            className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer'
                            onClick={signInWithEmail}
                            disabled={authing}>
                            Log In With Email and Password
                        </button>
                    </div>

                    {/* Error */}
                    {error && <div className='text-red-500 mb-4'>{error}</div>}

                    {/* Divider */}
                    <div className='w-full flex items-center justify-center relative py-4'>
                        <div className='w-full h-[1px] bg-gray-500'></div>
                        <p className='text-lg absolute text-gray-500 bg-[#1a1a1a] px-2'>OR</p>
                    </div>

                    {/* Login with Google */}
                    <button
                        className='w-full bg-white text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer mt-7'
                        onClick={signInWithGoogle}
                        disabled={authing}>
                        Log In With Google
                    </button>
                </div>

                {/* Link to sign up */}
                <div className='w-full flex items-center justify-center mt-10'>
                    <p className='text-sm font-normal text-gray-400'>
                        Don't have an account? 
                        <span className='font-semibold text-white cursor-pointer underline'>
                            <a href='/signup'>Sign Up</a>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
