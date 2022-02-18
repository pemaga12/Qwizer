
descifrarTest = () => {
    let testInfo = localStorage.getItem(this.state.currentTest);
    var input = JSON.parse(testInfo);
    
    var cifradas = input.encrypted_message;
    console.log(input);
    var key = CryptoJS.enc.Hex.parse(input.password);
    var iv = CryptoJS.enc.Hex.parse(input.iv);
    var cipher = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(cifradas)
    });

    var result = CryptoJS.AES.decrypt(cipher, key, {iv: iv, mode: CryptoJS.mode.CFB});

    var text = result.toString(CryptoJS.enc.Utf8);

    text = JSON.parse(text);

    this.setState({
      questionList: text.questions,
      allow:true
    });
    return text.questions;
    //Inicializamos la lista de respuestas para el test
  }
  
export const comprobarPassword = () => {

    if(this.state.contra !== ""){
      let testInfo = localStorage.getItem(this.state.currentTest);
      var text = JSON.parse(testInfo);
     
      if(CryptoJS.SHA256(this.state.contra).toString() === text.password){
        var list = descifrarTest();
        this.initAnswerList(list);
        
      }else{
        alert("Wrong Password");
      }
    }
    
  }