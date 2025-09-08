// Definimos los tipos para el usuario.
// Es buena práctica tener un tipo para los datos públicos del usuario.
export interface User {
  id: string;
  email: string;
  name: string;
}

// Nuestro usuario hardcodeado.
const hardcodedUser = {
  id: '1',
  email: 'test@ucn.cl',
  password: 'password123',
  name: 'Eric RossEstudiante',
};

// Esta función simula una llamada a una API para iniciar sesión.
export const login = (email: string, password: string): Promise<{ token: string; user: User }> => {
  return new Promise((resolve, reject) => {
    // Simulamos un retraso de red
    setTimeout(() => {
      if (email === hardcodedUser.email && password === hardcodedUser.password) {
        // Creamos un token JWT falso
        const fakeJwtToken = btoa(JSON.stringify({ user: hardcodedUser.email, role: 'student' }));

        console.log('Mock Auth: Login exitoso!');
        
        // Devolvemos el token y los datos PÚBLICOS del usuario (sin la contraseña)
        resolve({
          token: fakeJwtToken,
          user: {
            id: hardcodedUser.id,
            email: hardcodedUser.email,
            name: hardcodedUser.name,
          },
        });
      } else {
        console.error('Mock Auth: Credenciales incorrectas.');
        reject(new Error('Email o contraseña incorrectos.'));
      }
    }, 500);
  });
};

export const logout = (): Promise<void> => {
  return Promise.resolve();
};