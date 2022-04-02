import CryptoJS from 'crypto-js'


export const descifrarTest = (currentTest) => {

  let testInfo = localStorage.getItem("test_" + currentTest);
  var input = JSON.parse(testInfo);
  
  var cifradas = input.encrypted_message;
  var key = CryptoJS.enc.Hex.parse(input.password);
  var iv = CryptoJS.enc.Hex.parse(input.iv);
  var cipher = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(cifradas)
  });

  var result = CryptoJS.AES.decrypt(cipher, key, {iv: iv, mode: CryptoJS.mode.CFB});
  var text = result.toString(CryptoJS.enc.Utf8);
  text = JSON.parse(text);

  return text.questions;
}
  
export const comprobarPassword = (contra,currentTest) => {

  if(contra !== ""){
    let testInfo = localStorage.getItem("test_" + currentTest);
    var text = JSON.parse(testInfo);
    
    if(CryptoJS.SHA256(contra).toString() === text.password) return true 
  }
  window.$("#unlock_error").modal("show");
  return false
}


export const sendTest = () => {

  var token = localStorage.getItem('token');
  var url = "http://127.0.0.1:8000/api/response";
  var listaRespuestas = localStorage.getItem('answers');

  return fetch(url, {
    method: 'POST',
    headers:{
      'Content-type': 'application/json',
      'Authorization': token
    },
    body: listaRespuestas
  })
}

export const getCorrectedTest = (idCuestionario, idAlumno) => {              //idAlumno solo se usa cuando eres profesor y quieres ver los resultados para tu alumno

  var token = localStorage.getItem('token');
  var url = "http://127.0.0.1:8000/api/test-corrected";
  const message = new Map([["idCuestionario", idCuestionario], ["idAlumno", idAlumno]]);
  const obj = JSON.stringify(Object.fromEntries(message));

  return fetch(url, {
    method: 'POST',
    headers:{
      'Content-type': 'application/json',
      'Authorization': token
    },
    body: obj
    })
    .then(data => data.json())
}


export const sendCreatedTest = (cuestionario) => {

  var token = localStorage.getItem('token');
  var url = "http://127.0.0.1:8000/api/crear-cuestionario";
  var jsonCuestionario = JSON.stringify(cuestionario)
  return fetch(url, {
    method: 'POST',
    headers:{
      'Content-type': 'application/json',
      'Authorization': token
    },
    body: jsonCuestionario
  }).then(data => data.json())
}