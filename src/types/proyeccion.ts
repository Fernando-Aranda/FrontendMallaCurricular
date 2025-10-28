export interface CreateProyeccionRamoDto {
    codigoRamo: string;
    semestre: number;
}

export interface CreateProyeccionDto {
    rut: string;
    nombre: string;
    ramos: CreateProyeccionRamoDto[];
}
