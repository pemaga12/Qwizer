

export const logIn = (username, password) => {
    
    //Creo el objeto que se va a enviar
    const loginInfo = new Map([["email", username], ["password", password]]);
    const obj = JSON.stringify(Object.fromEntries(loginInfo));

    var url = "http://127.0.0.1:8000/api/login";
    
    return fetch(url, {
      method: 'POST', 
      headers:{
        'Content-type': 'application/json',
      },
      body: obj
    }).then(data => data.json())
    .then(data => {

        if(data.respuesta === "invalid login"){
            return " "
        }else{
            localStorage.setItem('token',data.token);
            localStorage.setItem('username',username);
            localStorage.setItem('rol', data.rol);
            localStorage.setItem('userId', data.id);
            var response = [data.rol, data.id]
            return response
        }
    })

}  

export const logOut = () => {

    var token = localStorage.getItem('token');
    var url = "http://127.0.0.1:8000/api/logout";
    return fetch(url, {
        method: 'GET',
        headers:{
      'Authorization': token}
    }).then(data => data.json())
   
}

export const getStudents = () => {
  var token = localStorage.getItem('token');
  var url = "http://127.0.0.1:8000/api/get-alumnos";
  return fetch(url, {
    method: 'POST',
        headers:{
      'Authorization': token}
    }).then(data => data.json())
}
