import logo from './logo.svg';
import React from 'react';
import CryptoJS from 'crypto-js'
import $, { get } from 'jquery';
import Popper from 'popper.js';

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';

import IndexContainer from './components/IndexContainer';
import QuestionContainer from './components/QuestionContainer.js';
import TestQuestion from './components/TestQuestion';
import LoginComponent from './components/LoginComponent';
import NavBar from './components/common/NavBar';



class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      contra:"",
      questionList:[],
      allow:false,                      //Indica si se ha desbloqueado el test
      login:false,                      //Guarda si se ha hecho login
      currentPage: "login",             //Página actual que está mostrando el login
      username: "admin@admin.com",
    };
    
    this.getTest = this.getTest.bind(this);
    this.sendTest = this.sendTest.bind(this);
    
    this.descifrarTest = this.descifrarTest.bind(this);
    this.comprobarPassword = this.comprobarPassword.bind(this);
    this.getPass = this.getPass.bind(this);
    this.cifrarTest = this.cifrarTest.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.initAnswerList = this.initAnswerList.bind(this);
    this.restorePassword = this.restorePassword.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    
    //Login functions
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getAsignaturas = this.getAsignaturas.bind(this);
    

  };

  
  addAnswer = (answer) => {
    var newlist = this.state.answerList;
    newlist.set(answer.id, {"type": answer.respuesta.type, "answr": answer.respuesta.answer});
    this.setState({
      answerList: newlist
    });
    var respuestas = JSON.stringify(Object.fromEntries(newlist));
    localStorage.setItem('answers', respuestas);
    console.log(this.state.answerList);

  }

  initAnswerList = (questionList) => {
    let list = new Map();
    questionList.forEach(pregunta => list.set(pregunta.id, {"type": pregunta.type, "answr": "NULL"}));
    console.log(list);
    this.setState({
      answerList: list
    });
  }

  componentWillMount(){
    //this.getTest();
  }

  getTest = () => {
    fetch('http://127.0.0.1:8000/api/test')
    .then(function(response){return response.json();})
    .then(data => {
      this.setState({
        password: data.password,
        iv: data.iv
      });
      localStorage.setItem('questions', data.encrypted_message);
    });
    
  }

  sendTest = () => {
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
  
  
  descifrarTest = () => {
    var cifradas = localStorage.getItem('questions');
    
    var key = CryptoJS.enc.Hex.parse(this.state.password);
    var iv = CryptoJS.enc.Hex.parse(this.state.iv);
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
  
  cifrarTest = () => {
    var aCifrar = localStorage.getItem('questionList');

    //Usaremos la misma key para cifrar el test
    var key = CryptoJS.enc.Hex.parse(this.state.password);
    //Usaremos el mismo IV
    var iv = CryptoJS.enc.Hex.parse(this.state.iv);
    var cipher = CryptoJS.lib.CipherParams.create({
    })
  }

  comprobarPassword = () => {

    if(this.state.contra != ""){
      if(CryptoJS.SHA256(this.state.contra) == this.state.password){
        var list = this.descifrarTest();
        this.initAnswerList(list);
        
      }else{
        alert("Wrong Password");
      }
    }
    
  }

  getPass = event => {
    this.setState({contra: event.target.value});
  }

  restorePassword = () => {
    alert("¡Contacta con tu profesor o el administrador!");
  }

  changeCurrentPage = (page) =>{                                    //Funcion usada para cambiar la página en la que nos encontramos actualmente
    if(page == "logout"){
      this.setState({
        currentPage : "login",
        login : false
      });
      console.log("Nos vamos a ", page);
    } 
    else{
      this.setState({
        currentPage : page,
      });
      console.log("Nos vamos a inicio")
    }
    
  }


  login = (username, password) => {
    //Creo el objeto que se va a enviar
    const loginInfo = new Map([["email", username], ["password", password]]);
    const obj = JSON.stringify(Object.fromEntries(loginInfo));
  
    var url = "http://127.0.0.1:8000/api/login";
    fetch(url, {
      method: 'POST', 
      headers:{
        'Content-type': 'application/json',
      },
      body: obj
    }).then(data => data.json())
    .then(
      data => {
          //Manejo del login
          localStorage.setItem('token',data.token);
          if(data.respuesta == "invalid login"){
            window.alert("¡Contraseña incorrecta!")
          }
          else{
            this.getAsignaturas();
            this.setState({
              username: data.username,
              login: true,
              currentPage: "index",
            });
          }
      }
    )

  }  

  logout = () => {
    console.log("logout");
    fetch('http://127.0.0.1:8000/api/logout')
    .then(function(response){return response.json();})
    .then(data => {
      window.alert(data);
    });
    
  }

  getAsignaturas = () => {
    
    var url = 'http://127.0.0.1:8000/api/get-asignaturas';
    var token = localStorage.getItem('token');

    fetch(url , {
      method: 'GET',
      headers:{
        'Authorization': token
      }
      })
      .then(function(response){return response.json();})
      .then(data => {
        console.log(data);
    });
  }

  render(){

    if(!this.state.login){                              //Login de la página
      document.title = "Login";
      return <Router>
        <Route render={() => {
          return <div> 
            <LoginComponent login={this.login}></LoginComponent> 
            </div>  
          }}>
        </Route>
        
      </Router>
    }

    else if(this.state.currentPage == "index"){         //Página de inicio de la web
      document.title = "Inicio"
      return <Router>
        <body>
          <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} logout={this.logout}></NavBar>
          <IndexContainer></IndexContainer>
        </body>
      </Router>
    }
    
    else {
      if (!this.state.allow){
        document.title = "Password Check";
        return  <Router>
            <Switch>
              <Route render={() => {
                return <div>
                    <h1> Bienvenido! </h1>
                    <input type="text" onChange={this.getPass}></input>
                    <button onClick={this.comprobarPassword}>Empezar Test</button>
                  </div>
              }}>
              </Route>
            </Switch>
          </Router>
      }
      else{
        
        return <Router>
          <Switch>       
            <Route render={() => {
              return <div>
                <h1> El Test ha empezado! </h1>
                <QuestionContainer questionList={this.state.questionList} 
                sendTest = {this.sendTest} addAnswerMethod = {this.addAnswer}
                />
              </div>
            }}>
            </Route>
          </Switch>
        </Router>
      }
    }
  }
  
}

export default App;
