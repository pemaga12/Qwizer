import React from 'react';

import {BrowserRouter as Router} from 'react-router-dom';

import IndexContainer from './components/IndexContainer';
import QuestionContainer from './components/QuestionContainer.js';

import LoginComponent from './components/LoginComponent';
import NavBar from './components/common/NavBar';

import BancoPreguntas from './components/BancoPreguntas';
import UploadFile from './components/UploadFile';
import UploadQuestions from './components/UploadQuestions';
import CuestionariosContainer from './components/CuestionariosContainer';

import {comprobarPassword,descifrarTest,sendTest,getCorrectedTest} from './utils/manage_test.js'
import {logIn,logOut} from './utils/manage_user.js'
import {getSubjects,getSubjectTests} from './utils/manage_subjects'
import CuestionarioPassword from './components/CuestionarioPassword';
import CrearCuestionario from './components/CrearCuestionario';
import RevisionNotasContainer from './components/RevisionNotasContainer';

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
      asignaturas: [],                  //Guarda id y nombre de las asignaturas
      cuestionarios: [],                //Guarda los nombres de los cuestionarios
      idCuestionarios: [],              //Guarda los IDs de los cuestionarios
      rol: "",
      currentTest: undefined,
      currentAsignatura: undefined,       //Guarda el nombre de la asignatura para la que estamos viendo los cuestionarios
      cuestionarioViendoNotas: undefined  //Guarda el id del cuestionario cuando un profesor revisa las notas de ese cuestionario 
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
    this.revisionTest = this.revisionTest.bind(this);
    this.revisarNotasTest = this.revisarNotasTest.bind(this);
    this.revisionTestProfesor = this.revisionTestProfesor.bind(this);

    // Funciones auxiliares
    this.getPass = this.getPass.bind(this);
    this.restorePassword = this.restorePassword.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);

    

  };

  componentDidMount(){
    this.checkLogged();
    var actual_page = localStorage.getItem('page');
    
    if(actual_page == null){
      localStorage.setItem('page', "login");
    }
    else{
      this.getAsignaturas();
      this.setState({
        currentPage: "index",
        rol: localStorage.getItem("rol")
      });
      localStorage.setItem("page", "index");
    }
  }

  //// Funciones Login, Logout y manejo de la sesion del usuario >>>>>>>>>>>>>>>>>>>

  login = (username, password) => {
    
    logIn(username, password).then(role => {

      if(role === " "){
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
      if(pregunta.type === 'test'){
        pregunta.answr = Number(value.answr)
      }else{
        pregunta.answr = value.answr
      }
      
      listaRespuestas.push(pregunta);
    }

    var respuestas = {"idCuestionario":this.state.currentTest,"respuestas":listaRespuestas}
    localStorage.setItem('answers', JSON.stringify(respuestas));


    this.setState({
      answerList: newlist
    });

  }

  //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //// Funciones para desbloquear, empezar, enviarTest, revision el test >>>>>>>>>>>>>>>>>>>
  unlockTest = () =>{
    if(comprobarPassword(this.state.contra,this.state.currentTest)){
      var list = descifrarTest(this.state.currentTest);
      this.initAnswerList(list);
      this.setState({
        questionList: list,
        allow:true
      });
      localStorage.setItem('initTime',Date.now()) //guardamos la hora a la que empieza el examen
    }
  }

  startTest = (id,duracion) => { 
    this.setState({
      currentTest: id,
      testDuration:duracion,
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

  revisionTest = (idCuestionario) => {
    getCorrectedTest(idCuestionario, "").then(data => {
      var jsonData = JSON.parse(data.corrected_test)
      this.setState({testCorregido:jsonData});
      this.changeCurrentPage('revision');
    }).catch(function(error){
      console.log("Error", error)
    })
  }

  revisionTestProfesor = (idCuestionario, idAlumno) => {
    console.log(idAlumno)
    getCorrectedTest(idCuestionario, idAlumno).then(data => {
      var jsonData = JSON.parse(data.corrected_test)
      this.setState({testCorregido:jsonData});
      this.changeCurrentPage('revision');
    }).catch(function(error){
      console.log("Error", error)
    })
  }

  revisarNotasTest = (idCuestionario) => {
    console.log("Revisar notas")
    
    this.setState({cuestionarioViendoNotas:idCuestionario});
    this.changeCurrentPage('revisionNotas');
  }
  //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //// Funciones para obtener asignaturas y cuestionarios >>>>>>>>>>>>>>>>>>>
  getAsignaturas = () => {
    
    getSubjects().then(data => {
      this.setState({
        asignaturas: data.asignaturas,
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
          <IndexContainer getAsignaturas={this.getAsignaturas} empezarTest={this.startTest} asignaturas={this.state.asignaturas} getCuestionarios={this.getCuestionarios}></IndexContainer>  
        </Router>
      }else if (this.state.currentPage === "cuestionarios"){//Pagina que muestra los cuestionarios para la asignatura seleccionada
          document.title = "Cuestionarios";
          return  <Router>
            <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
            <CuestionariosContainer cuestionarios={this.state.cuestionarios} idCuestionarios={this.state.idCuestionarios} empezarTest={this.startTest} asignatura={this.state.currentAsignatura} revisionTest={this.revisionTest} revisionTestProfesor={this.revisionTestProfesor} rol={this.state.rol} revisarNotasTest={this.revisarNotasTest}></CuestionariosContainer> 
            </Router>
      }else if (this.state.currentPage === "test"){//Pagina del test
        if (!this.state.allow){ //Introduce la contrasenia del test para poder hacerlo
          document.title = "Password Check";
          return  <Router>
            <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
            <CuestionarioPassword unlockTest={this.unlockTest} getPass={this.getPass}></CuestionarioPassword>
            </Router>
        }else{ 
          //
          //Pasarle la toda la informacion del cuestionario seleccionado en un objeto en vez de atributo a atributo !!!
          //
          return <Router>
            <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
            <QuestionContainer revision={false} duration={this.state.testDuration} idCuestionario={this.state.currentTest} questionList={this.state.questionList} sendTest={this.enviarTest} addAnswerMethod={this.addAnswer}/>
          </Router>
        }
      }else if (this.state.currentPage === "revision") {
        return <Router>
            <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
            <QuestionContainer revision={true} correctedTest={this.state.testCorregido}/>
          </Router>
      }else if (this.state.currentPage === "crear-cuestionario"){ //Pagina para crear cuestionarios
        return <Router>
           <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
           <CrearCuestionario changeCurrentPage={this.changeCurrentPage}></CrearCuestionario>
         </Router>
      }else if (this.state.currentPage === "upload"){ //Pagina para subir cuestionarios
         return <Router>
            <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
            <UploadFile></UploadFile>
          </Router>
      }else if (this.state.currentPage === "upload-questions"){ //Pagina para subir preguntas
        return <Router>
           <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
           <UploadQuestions></UploadQuestions>
         </Router>
     }else if(this.state.currentPage === "banco-preguntas"){
      return <Router>
          <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
          <BancoPreguntas></BancoPreguntas>
        </Router>
     }else if(this.state.currentPage === "revisionNotas"){
        return <Router>
          <NavBar changeCurrentPage={this.changeCurrentPage} username={this.state.username} rol={this.state.rol} logout={this.logout}></NavBar>
          <RevisionNotasContainer currentCuestionario={this.state.cuestionarioViendoNotas} revisionTestProfesor={this.revisionTestProfesor}></RevisionNotasContainer>
        </Router>
      }
    }
    
  }
  
}

export default App;