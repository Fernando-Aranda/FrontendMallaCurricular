const GRAPHQL_API_URL = 'http://localhost:3000/graphql'

export const getProyeccionAutomatica = async (token: string, rut: string, codigoCarrera: string, catalogo: string) => {
  const query = `
    query GetAutoProjection($rut: String!, $carrera: String!, $catalogo: String!) {
      previsualizarProyeccion(rut: $rut, codigoCarrera: $carrera, catalogo: $catalogo) {
        semestres {
          periodo
          semestreRelativo
          totalCreditos
          asignaturas {
            codigoRamo
            nombreAsignatura
            creditos
          }
        }
      }
    }
  `

  const variables = { rut, carrera: codigoCarrera, catalogo }

  const response = await fetch(GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables })
  })

  const json = await response.json()

  if (json.errors) {
    throw new Error(json.errors[0].message)
  }

  return json.data.previsualizarProyeccion.semestres
}

export const saveProyeccionAutomatica = async (
  token: string, 
  rut: string, 
  codigoCarrera: string, 
  catalogo: string,
  nombre: string
) => {
  const query = `
    mutation GuardarAuto($rut: String!, $carrera: String!, $catalogo: String!, $nombre: String) {
      guardarProyeccionAutomatica(
        rut: $rut, 
        codigoCarrera: $carrera, 
        catalogo: $catalogo, 
        nombre: $nombre
      ) {
        id
        nombre
      }
    }
  `

  const variables = { rut, carrera: codigoCarrera, catalogo, nombre }

  const response = await fetch(GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables })
  })

  const json = await response.json()

  if (json.errors) {
    throw new Error(json.errors[0].message)
  }

  return json.data.guardarProyeccionAutomatica
}