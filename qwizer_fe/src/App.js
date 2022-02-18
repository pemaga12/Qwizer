import React from 'react';
import CryptoJS from 'crypto-js'


import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';

import IndexContainer from './components/IndexContainer';
import QuestionContainer from './components/QuestionContainer.js';

import LoginComponent from './components/LoginComponent';
import NavBar from './components/common/NavBar';

import UploadFile from './components/UploadFile';


class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      contra:"",
      questionList:[],
      allow:false,                      //Indica si se ha desbloqueado el test
      login:false,                      //Guarda si se ha hecho login
      currentPage: "login",             //Página actual que está mostrando el login
      username: "",
      asignaturas: [],                  //Guarda los nombres de las asignaturas
      idAsignaturas: [],                //Guarda los IDs de las asignaturas 
      rol: "",
    };
    
    this.getTest = this.getTest.bind(this);
    this.sendTest = this.sendTest.bind(this);
    
    this.descifrarTest = this.descifrarTest.bind(this);
    this.comprobarPassword = this.comprobarPassword.bind(this);
    this.getPass = this.getPass.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.initAnswerList = this.initAnswerList.bind(this);
    this.restorePassword = this.restorePassword.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    
    //Login functions
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    //Funciones relacionadas con las asignaturas
    this.getAsignaturas = this.getAsignaturas.bind(this);
    this.getCuestionarios = this.getCuestionarios.bind(this)

    this.startTest = this.startTest.bind(this);
    this.checkLogged = this.checkLogged.bind(this);
    ;

  };

  
  addAnswer = (answer) => {
    var newlist = this.state.answerList;
    newlist.set(answer.id, {"type": answer.respuesta.type, "answr": answer.respuesta.answer});
    this.setState({
      answerList: newlist
    });
    var respuestas = JSON.stringify(Object.fromEntries(newlist));
    localStorage.setItem('answers', respuestas);

  }

  initAnswerList = (questionList) => {
    let list = new Map();
    questionList.forEach(pregunta => list.set(pregunta.id, {"type": pregunta.type, "answr": "NULL"}));
    this.setState({
      answerList: list
    });
  }

  componentWillMount(){
    this.checkLogged();
    var actual_page = localStorage.getItem('page');
    if(actual_page == null){
      localStorage.setItem('page', "login");
    }else{
      if(actual_page === "index"){
        this.getAsignaturas();
      }
      this.getTest();
      this.setState({currentPage:actual_page});
    }
  }

  
  checkLogged = () => {
    var token = localStorage.getItem('token');
    var usern = localStorage.getItem('username');
    
    if(token !== null && usern !== null){
      var url = "http://127.0.0.1:8000/api/";
      fetch(url)
      .then((data) => {
        let pagina = "index";
        if(data.url === url){
          this.getAsignaturas();
          this.setState({login:true,username:usern,currentPage: pagina})
        }
        localStorage.setItem('page', pagina);
      })
      .catch((error) => console.log(error))
    }
  }

  getTest = () => {
    var url = 'http://127.0.0.1:8000/api/test';
    var token = localStorage.getItem('token');
    fetch(url , {
      method: 'GET',
      headers:{
        'Authorization': token
      }
      })
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
  
  comprobarPassword = () => {

    if(this.state.contra !== ""){
      if(CryptoJS.SHA256(this.state.contra) === this.state.password){
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
    if(page === "logout"){
      this.logout();
      this.setState({
        currentPage : page,
      });
      
    } 
    else{
      localStorage.setItem('page', page);
      this.setState({
        currentPage : page,
      });
      
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
          if(data.respuesta === "invalid login"){
            window.alert("¡Contraseña incorrecta!")
          }
          else{
            localStorage.setItem('token',data.token);
            localStorage.setItem('username',username);
            this.getAsignaturas();
            this.setState({
              username: username,
              login: true,
              currentPage: "index",
              rol: data.rol
            });
            this.changeCurrentPage("index");
          }
          
      }
    )

  }  

  logout = () => {
    localStorage.clear();
    fetch('http://127.0.0.1:8000/api/logout')
    .then(function(response){return response.json();})
    .then(data => {
      this.setState({
        currentPage : "login",
        login : false
      });
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
       
        this.setState({
          asignaturas: data.asignaturas,
          idAsignaturas: data.idAsignaturas
        });        
    });
  }

  getCuestionarios = (idAsignatura) => {
    var url = 'http://127.0.0.1:8000/api/get-cuestionarios';
    var token = localStorage.getItem('token');
    const message = new Map([["idAsignatura", idAsignatura]]);
    const obj = JSON.stringify(Object.fromEntries(message));
    fetch(url , {
      method: 'POST',
      headers:{
        'Content-type': 'application/json',
        'Authorization': token
      },
      body: obj
      })
      .then(function(response){return response.json();})
      .then(data => {
        this.setState({
          cuestionarios: data.cuestionarios,
          idCuestionarios: data.idCuestionarios
        });        
    });
  }

  startTest = () =>{

    this.getTest();

    this.changeCurrentPage('test');
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
    else if(this.state.currentPage === "index" && this.state.username){         //Página de inicio de la web
      document.title = "Inicio"
      return <Router>
        <body>
          <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
          <IndexContainer empezarTest={this.startTest} idAsignaturas={this.state.idAsignaturas} asignaturas={this.state.asignaturas} getCuestionarios={this.getCuestionarios}></IndexContainer>
        </body>
      </Router>
    }
    
    else if (this.state.currentPage === "test"){
      if (!this.state.allow){
        document.title = "Password Check";
        return  <Router>
          <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
            <Switch>
              <Route render={() => {
                return <div class="index-body container-fluid">
                          <div class="p-4 row"></div>
                          <div class="row" className="card">
                            <div class="col text-center">
                              <h1>Introduce la contraseña</h1>
                              <h1>para empezar el examen!</h1>
                            </div>
                          </div>
                          <div class="p-4 row">
                            <div class="col text-center">
                              <input type="text" className="center" onChange={this.getPass}></input>
                            </div>
                          </div>
                          <div class="p-4 row">
                            <div class="col text-center">
                              <button type="button" class="btn btn-success" onClick={this.comprobarPassword}>Empezar Test</button>
                            </div>
                          </div>
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
              return <QuestionContainer questionList={this.state.questionList} 
              sendTest = {this.sendTest} addAnswerMethod = {this.addAnswer}/>
            }}>
            </Route>
          </Switch>
        </Router>
      }
    }
    else if (this.state.currentPage === "upload"){
       return <Router>
          <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
          <UploadFile></UploadFile>
        </Router>
    }
    
   /*
    return <Router>
            <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} logout={this.logout}></NavBar>
            <UploadFile></UploadFile>
          </Router>
   */
  }
  
}

export default App;
