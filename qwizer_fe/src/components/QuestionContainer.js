import React from 'react'


import TestQuestion from './TestQuestion.js'
import TextQuestion from './TextQuestion.js'
import QuestionNav from './QuestionNav.js'
import Countdown from 'react-countdown';


class QuestionContainer extends React.Component {
    
  constructor(props){
    super(props);
    this.state = {
      indPregunta:0,
    }
    this.questionType = this.questionType.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.updateIndNext = this.updateIndNext.bind(this);
    this.updateIndBack = this.updateIndBack.bind(this);
    this.navHandler = this.navHandler.bind(this);
    this.updateTime = this.updateTime.bind(this);
  }

  updateTime = () => {
    var initTime = Number(localStorage.getItem('initTime'));
    initTime = new Date(initTime);
    var actualTime = Date.now();
    actualTime = new Date(actualTime);

    var tiempoInicial = initTime.getHours()*3600 + initTime.getMinutes() *60 + initTime.getSeconds();
    var tiempoActual = actualTime.getHours()*3600 + actualTime.getMinutes() *60 + actualTime.getSeconds();
    var passedSeconds = tiempoActual - tiempoInicial;

    var leftSeconds = (this.props.duration*60) - passedSeconds;

    if(leftSeconds <= 0){
      leftSeconds = 0
    }

    //comprobar si se ha pasado de fecha ???

    return leftSeconds;
  }
  
  componentDidMount (){
    if(this.props.questionList){ //si esta definido, porque si hace revision no lo esta
      this.setState({numPreguntas:this.props.questionList.length});
    }
    
  }
  questionType = (pregunta) => {

    if(pregunta != null){
      
      if(pregunta.type === 'test'){
        return  <TestQuestion mode={this.props.revision?"revision":"test"} infoPreg={pregunta} key={pregunta.id} idCuestionario={this.props.idCuestionario} question={pregunta.question} options={pregunta.options} id={pregunta.id} type={pregunta.type} addAnswerd={this.props.addAnswerMethod}/>
      } // else type = 'text'
      console.log(this.props.revision?"revision":"test")
      return <TextQuestion mode={this.props.revision?"revision":"test"} infoPreg={pregunta} key={pregunta.id} idCuestionario={this.props.idCuestionario} question={pregunta.question} id={pregunta.id} type={pregunta.type} addAnswerd={this.props.addAnswerMethod}/>
    }
  
  }

  updateIndNext = () => {

    if(this.state.indPregunta + 1 <= this.state.numPreguntas-1 ){
      this.setState({indPregunta: this.state.indPregunta + 1});
    }
    
  }
  updateIndBack = () => {

    if(this.state.indPregunta - 1 >= 0 ){
      this.setState({indPregunta: this.state.indPregunta - 1});
    }
  }

  renderButtons = () =>{
    if(this.state.indPregunta === 0){
      return <div class="p-2 col text-center"><button type="button" class="btn btn-success" onClick={this.updateIndNext}>Siguiente</button></div>
    }else if(this.state.indPregunta > 0 && this.state.indPregunta < this.state.numPreguntas-1){
      return <div class="p-2 col text-center">
          <button type="button" class="btn btn-success" onClick={this.updateIndBack}>Atras</button>
          <button type="button" class="btn btn-success" onClick={this.updateIndNext}>Siguiente</button>
        </div>
    }else{ //this.state.indPregunta == this.state.numPreguntas-1
      return <div class="p-2 col text-center">
          <button type="button" class="btn btn-success" onClick={this.updateIndBack}>Atras</button>
          <button type="button" class="btn btn-warning" onClick={this.props.sendTest}>Terminar y Enviar</button>
        </div>
    }

  }

  navHandler = (val) =>{
    this.setState({indPregunta:val});
  }

  renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      this.props.sendTest();
      localStorage.removeItem('initTime');
      localStorage.removeItem('answers');
      return <h1>Test Enviado</h1>;
    } else {
      // Render a countdown
      var totalSeconds = this.props.duration*60 //segundos
      var leftSeconds = (hours*3600)+(minutes*60)+seconds
      var porcentaje = 100 - parseInt((leftSeconds/totalSeconds) * 100)
      return <div>
          <p class="text-center">{hours}h:{minutes}min:{seconds}s</p>
          <div class="progress">
            <div class="progress-bar progress-bar-striped" role="progressbar" style={{width:porcentaje+"%"}} aria-valuenow={porcentaje} aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
    }
  };

  render() { 
    
    const renderQtype = this.questionType
    
    if(this.props.revision === false){
      const pregunta = this.props.questionList[this.state.indPregunta]
      return(
        <div class="index-body container-fluid" id="questions">
  
          <div class="p-4 row-1">
            <div class="col" className="card">
              <h1 class="text-center">Nombre del Test</h1>
              <Countdown date={Date.now() + (this.updateTime()*1000)} renderer={this.renderer}/>
            </div>
          </div>
  
          <div class="p-4 row">
            <div class="p-2 col-9" id="question">
                <div className="card">      
                      <div key={pregunta.id}>
                        <h2 className="p-2 m-2 card"> {this.state.indPregunta+1}{".-" + pregunta.question}</h2>
                        {renderQtype(pregunta)}
                      </div>
                </div>
            </div>
  
            <div class="p-2 col-3" id="question-nav">
              <QuestionNav navigationHandler={this.navHandler} listaPreguntas={this.props.questionList}/>
            </div>
  
          </div>
  
          <div class="p-4 row">
            <div class="col">
              {this.renderButtons()}
            </div>
          </div>
  
        </div>
      );
    }else if(this.props.revision === true && this.props.correctedTest ){
      const correctedTestInfo = this.props.correctedTest
      return(
        <div class="index-body container-fluid" id="questions">
  
          <div class="p-4 row-1">
            <div class="col" className="card">
              <h1 class="text-center">{correctedTestInfo.titulo}</h1>
            </div>
            <div class="col" className="card">
              <h1 class="text-center">Calificacion: {correctedTestInfo.nota}</h1>
            </div>
          </div>
  
          <div class="p-4 row">
            <div class="p-2 col-9" id="question">
                <div className="card">      
                      <div key={correctedTestInfo.questions[this.state.indPregunta].id}>
                        <h2 className="p-2 m-2 card"> {this.state.indPregunta+1}{".-" + correctedTestInfo.questions[this.state.indPregunta].question}</h2>
                        {renderQtype(correctedTestInfo.questions[this.state.indPregunta])}
                      </div>
                </div>
            </div>
  
            <div class="p-2 col-3" id="question-nav">
              <QuestionNav navigationHandler={this.navHandler} listaPreguntas={correctedTestInfo.questions}/>
            </div>
  
          </div>
        </div>
      );
    }else{
      return <h1>Loading...</h1>
    }
    
    
  
  }

}

export default QuestionContainer;