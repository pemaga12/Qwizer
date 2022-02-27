

export const getSubjects = () => {//Asignaturas en la que esta matriculado el estudiante
    
    var url = 'http://127.0.0.1:8000/api/get-asignaturas';
    var token = localStorage.getItem('token');
    return fetch(url , {
      method: 'GET',
      headers:{
        'Authorization': token
      }
      })
      .then(data => data.json())

}


export const  getSubjectTests = (idAsignatura) => {

    var url = 'http://127.0.0.1:8000/api/get-cuestionarios';
    var token = localStorage.getItem('token');
    const message = new Map([["idAsignatura", idAsignatura]]);
    const obj = JSON.stringify(Object.fromEntries(message));
  
    return fetch(url , {
      method: 'POST',
      headers:{
        'Content-type': 'application/json',
        'Authorization': token
      },
      body: obj
      })
      .then(data => data.json())
}

export const getAllSubjects = () => {//Asignaturas en la que esta matriculado el estudiante
    
  var url = 'http://127.0.0.1:8000/api/get-all-asignaturas';
  var token = localStorage.getItem('token');
  return fetch(url , {
    method: 'POST',
    headers:{
      'Authorization': token
    }
    })
    .then(data => data.json())

}

export const getSubjectQuestions = (idAsignatura) => {

  var url = 'http://127.0.0.1:8000/api/get-preg-asignaturas';
  var token = localStorage.getItem('token');
  const message = new Map([["idAsignatura", idAsignatura]]);
  const obj = JSON.stringify(Object.fromEntries(message));

  return fetch(url , {
    method: 'POST',
    headers:{
      'Content-type': 'application/json',
      'Authorization': token
    },
    body: obj
    })
    .then(data => data.json())

}