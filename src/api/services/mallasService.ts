import type { Malla } from '../../types/mallas';

const API_URL = 'http://localhost:3000/estudiantes/malla'; //CAMBIAR A BACKEND REAL

export const getMalla = async (token: string, codigo: string, catalogo: string): Promise<Malla[]> => {
    const response = await fetch(`${API_URL}/${codigo}/${catalogo}`, {
        method: 'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener la malla curricular');
    }

    return response.json();
}