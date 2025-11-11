import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';
import '../assets/styles/index.css';

// 1. Creamos una instancia del cliente de React Query
const queryClient = new QueryClient();

// 2. Buscamos el elemento raíz en tu HTML
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// 3. Renderizamos la aplicación
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* 4. Proveedor del Router: Habilita la navegación en toda la app */}
    <BrowserRouter>
      {/* 5. Proveedor de React Query: Habilita el fetching de datos global */}
      <QueryClientProvider client={queryClient}>
        {/* 6. Proveedor de Autenticación: Da acceso al estado de sesión global */}
        <AuthProvider>
          {/* 7. Finalmente, renderizamos nuestro componente App principal */}
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);