import { gql } from "@apollo/client";

export const CREAR_PROYECCION = gql`
  mutation CrearProyeccion($data: CrearProyeccionInput!) {
    crearProyeccion(data: $data) {
      id
      nombre
      rut
      codigoCarrera
      periodos {
        catalogo
        ramos {
          codigoRamo
          semestre
        }
      }
    }
  }
`;
