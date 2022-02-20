import React from 'react';

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';

import IndexContainer from './components/IndexContainer';
import QuestionContainer from './components/QuestionContainer.js';

import LoginComponent from './components/LoginComponent';
import NavBar from './components/common/NavBar';

import UploadFile from './components/UploadFile';
import CuestionariosContainer from './components/CuestionariosContainer';

import {comprobarPassword,descifrarTest,sendTest} from './utils/manage_test.js'
import {logIn,logOut} from './utils/manage_user.js'
import {getSubjects,getSubjectTests} from './utils/manage_subjects'
import CuestionarioPassword from './components/CuestionarioPassword';


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
      cuestionarios: [],                //Guarda los nombres de los cuestionarios
      idCuestionarios: [],              //Guarda los IDs de los cuestionarios
      rol: "",
      currentTest: undefined,
      currentAsignatura: undefined      //Guarda el nombre de la asignatura para la que estamos viendo los cuestionarios
    };
    
    //Login functions
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.checkLogged = this.checkLogged.bind(this);

    //Funciones relacionadas con las asignaturas
    this.getAsignaturas = this.getAsignaturas.bind(this);
    this.getCuestionarios = this.getCuestionarios.bind(this);

    // Funciones relacionadas con el test
    this.unlockTest = this.unlockTest.bind(this);
    this.initAnswerList = this.initAnswerList.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.startTest = this.startTest.bind(this);
    this.enviarTest = this.enviarTest.bind(this);

    // Funciones auxiliares
    this.getPass = this.getPass.bind(this);
    this.restorePassword = this.restorePassword.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);

    

  };

  componentWillMount(){
    this.checkLogged();
    var actual_page = localStorage.getItem('page');
    if(actual_page == null){
      localStorage.setItem('page', "login");
    }
    else{
      /*
      if(actual_page === "index"){
        this.getAsignaturas();
        
      }
      this.setState({currentPage:actual_page});
      */
      this.getAsignaturas();
      this.setState({
        currentPage: "index"
      });
      localStorage.setItem("page", "index");
    }
  }

  //// Funciones Login, Logout y manejo de la sesion del usuario >>>>>>>>>>>>>>>>>>>

  login = (username, password) => {
    
    logIn(username, password).then(role => {

      if(role == " "){
        window.alert("¡Contraseña incorrecta!")
      }else{
        this.getAsignaturas();
        this.setState({
          username: username,
          login: true,
          currentPage: "index",
          rol: role
        });
        this.changeCurrentPage("index");
      }
    })

  }  

  logout = () => {

    logOut();
    this.setState({
      currentPage : "login",
      login : false
    });
    localStorage.clear();
  }

  checkLogged = () => {
    var token = localStorage.getItem('token');
    var usern = localStorage.getItem('username');
    
    if(token !== null && usern !== null){
      
      let pagina = localStorage.getItem("page");
      if(pagina === null){
        pagina = "index";
        localStorage.setItem('page', pagina);
      } 
      this.setState({login:true,username:usern,currentPage: pagina});
    }
  }

  //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  

  //// Funciones para guardar las repuestas del Test >>>>>>>>>>>>>>>>>>>
  
  initAnswerList = (questionList) => {
    let list = new Map();
    questionList.forEach(pregunta => list.set(pregunta.id, {"type": pregunta.type, "answr": "NULL"}));
    this.setState({
      answerList: list
    });

  }

  addAnswer = (answer) => {
    var newlist = this.state.answerList;
    newlist.set(answer.id, {"type": answer.respuesta.type, "answr": answer.respuesta.answer});

    var listaRespuestas = []
    for (var [key, value] of newlist.entries()) {
      var pregunta = {}
      pregunta.id = key
      pregunta.type = value.type
      pregunta.answr = value.answr
      listaRespuestas.push(pregunta);
    }

    var respuestas = {"idCuestionario":this.state.currentTest,"respuestas":listaRespuestas}
    localStorage.setItem('answers', JSON.stringify(respuestas));


    this.setState({
      answerList: newlist
    });

  }

  //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //// Funciones para desbloquear, empezar, enviarTest el test >>>>>>>>>>>>>>>>>>>
  unlockTest = () =>{
    if(comprobarPassword(this.state.contra,this.state.currentTest)){
      var list = descifrarTest(this.state.currentTest);
      this.initAnswerList(list);
      this.setState({
        questionList: list,
        allow:true
      });
    }
  }

  startTest = (id) => { 
    this.setState({
      currentTest: id,
    });
    this.changeCurrentPage('test');
  }
  
  enviarTest = () => {
    sendTest().then(data => {
      this.changeCurrentPage('cuestionarios');
    }).catch(function(error){
      console.log("Error", error)
    })
  }
  //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //// Funciones para obtener asignaturas y cuestionarios >>>>>>>>>>>>>>>>>>>
  getAsignaturas = () => {
    
    getSubjects().then(data => {
      this.setState({
        asignaturas: data.asignaturas,
        idAsignaturas: data.idAsignaturas
      }); 
    });
  }

  getCuestionarios = (idAsignatura, nombreAsignatura) => {

    getSubjectTests(idAsignatura).then(data => {
      this.setState({
        cuestionarios: data.cuestionarios,
        idCuestionarios: data.idCuestionarios,
        currentAsignatura: nombreAsignatura
      });
      this.changeCurrentPage("cuestionarios");   
    });
          
  }
  //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //// Funciones auxiliares >>>>>>>>>>>>>>>>>>>

  getPass = (e) => { //Funcion para conseguir la contraseña del test introducida por el usuario
    this.setState({contra: e.target.value});
  }

  restorePassword = () => {
    alert("¡Contacta con tu profesor o el administrador!");
  }

  changeCurrentPage = (page) =>{ //Funcion usada para cambiar de página 
    if(page === "logout"){
      this.logout();
    } 
    else{
      localStorage.setItem('page', page);
    }
    
    this.setState({
      currentPage : page,
      allow: false
    });
   
  }

  //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //  -----------------------------------------------------------------------------------------

  
  render(){

    if(!this.state.login){//Pagina de login (usuario no logeado)
      document.title = "Login";
      return <Router>
        <LoginComponent login={this.login}></LoginComponent> 
      </Router>

    }else{//Usuario logeado
      
      if(this.state.currentPage === "index"){//Pagina de inicio (muestra las asignaturas)
        document.title = "Inicio"
        return <Router> 
          <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
          <IndexContainer getAsignaturas={this.getAsignaturas} empezarTest={this.startTest} idAsignaturas={this.state.idAsignaturas} asignaturas={this.state.asignaturas} getCuestionarios={this.getCuestionarios}></IndexContainer>  
        </Router>
      }else if (this.state.currentPage === "cuestionarios"){//Pagina que muestra los cuestionarios para la asignatura seleccionada
          document.title = "Cuestionarios";
          return  <Router>
            <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
            <CuestionariosContainer cuestionarios={this.state.cuestionarios} idCuestionarios={this.state.idCuestionarios} empezarTest={this.startTest} asignatura={this.state.currentAsignatura}></CuestionariosContainer> 
            </Router>
      }else if (this.state.currentPage === "test"){//Pagina del test
        if (!this.state.allow){ //Introduce la contrasenia del test para poder hacerlo
          document.title = "Password Check";
          return  <Router>
            <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
            <CuestionarioPassword unlockTest={this.unlockTest} getPass={this.getPass}></CuestionarioPassword>
            </Router>
        }else{ 
          return <Router>
            <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
            <QuestionContainer idCuestionario={this.state.currentTest} questionList={this.state.questionList} sendTest = {this.enviarTest} addAnswerMethod = {this.addAnswer}/>
          </Router>
        }
      }else if (this.state.currentPage === "upload"){ //Pagina para subir cuestionarios
         return <Router>
            <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
            <UploadFile></UploadFile>
          </Router>
      }
    }
    
  }
  
}

export default App;