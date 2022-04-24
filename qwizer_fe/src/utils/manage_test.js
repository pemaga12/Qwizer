import CryptoJS from 'crypto-js'


const getTestFromLocalStorage = (testId) => {
  var tests = localStorage.getItem("tests");

  var cuestionariosList = JSON.parse(tests);
  for (const cuestionario of cuestionariosList) { 
      var test = JSON.parse(cuestionario)
      if(test.id == testId){
          return test;
      }
  }
}

export const descifrarTest = (currentTest) => {

  var input = getTestFromLocalStorage(currentTest);
  
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
    var text = getTestFromLocalStorage(currentTest);
    if(CryptoJS.SHA256(contra).toString() === text.password) return true 
  }
  window.$("#password_error").modal("show")
  return false
}


export const sendTest = () => {

  var token = localStorage.getItem('token');
  var url = "http://127.0.0.1:8000/api/response";
  var listaRespuestas = localStorage.getItem('answers');
  var hash = CryptoJS.SHA256(listaRespuestas).toString();
  //listaRespuestas["hash"] = hash;
  const message = new Map([["respuestas", listaRespuestas], ["hash", hash]]);
  
  const obj = JSON.stringify(Object.fromEntries(message));
  
  var sent = false;
  
  fetch(url, {
    method: 'POST',
    headers:{
      'Content-type': 'application/json',
      'Authorization': token
    },
    body: obj
  })
  if (navigator.onLine) {
    sent = true
  }
  var response = [sent, hash]
  return response;
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