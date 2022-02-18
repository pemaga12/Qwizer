import CryptoJS from 'crypto-js'


export const descifrarTest = (currentTest) => {

  let testInfo = localStorage.getItem(currentTest);
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
    let testInfo = localStorage.getItem(currentTest);
    var text = JSON.parse(testInfo);
    
    if(CryptoJS.SHA256(contra).toString() === text.password) return true 
  }
  
  return false
}


export const sendTest = () => {
  var url = "http://127.0.0.1:8000/api/response";
  var listaRespuestas = localStorage.getItem('answers');
  fetch(url, {
    method: 'POST',
    headers:{
      'Content-type': 'application/json',
    },
    body: listaRespuestas
  }).catch(function(error){
    console.log("Error", error)
  })
}