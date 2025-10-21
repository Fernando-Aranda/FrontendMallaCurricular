import type { Avance } from '../types/avance';

const API_URL = 'http://localhost:3000/estudiantes/avance';

export const getAvance = async (token: string, rut: string, codigoCarrera: string): Promise<Avance[]> => {
    const response = await fetch(`${API_URL}/${rut}/${codigoCarrera}`, {
        method: 'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener el avance curricular');
    }

    return response.json();
}