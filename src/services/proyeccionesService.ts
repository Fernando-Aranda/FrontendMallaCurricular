import type { CreateProyeccionDto } from '../types/proyeccion';

const API_URL = 'http://localhost:3000/proyecciones';

export const createProyeccion = async (token: string, dto: CreateProyeccionDto) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error('Error al crear proyección: ' + text);
    }

    return response.json();
};
