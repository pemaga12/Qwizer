import React from 'react'


import TestQuestion from './TestQuestion.js'
import TextQuestion from './TextQuestion.js'
import QuestionNav from './QuestionNav.js'
import Timer from './Timer.js';



class QuestionContainer extends React.Component {
    
  constructor(props){
    super(props);
    this.state = {
      indPregunta:0
    }
    this.questionType = this.questionType.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.updateIndNext = this.updateIndNext.bind(this);
    this.updateIndBack = this.updateIndBack.bind(this);
    this.navHandler = this.navHandler.bind(this);
  }
  
  questionType = (pregunta) => {

    if(pregunta != null){

      if(pregunta.type === 'test'){
        return  <TestQuestion key={pregunta.id} idCuestionario={this.props.idCuestionario} question={pregunta.question} options={pregunta.options} id={pregunta.id} type={pregunta.type} addAnswerd={this.props.addAnswerMethod}/>
      } // else type = 'text'

      return <TextQuestion key={pregunta.id} idCuestionario={this.props.idCuestionario} question={pregunta.question} id={pregunta.id} type={pregunta.type} addAnswerd={this.props.addAnswerMethod}/>
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
  UNSAFE_componentWillMount(){
    this.setState({numPreguntas:this.props.questionList.length});
  }
  navHandler = (val) =>{
    this.setState({indPregunta:val});
  }

  render() { 
      
    const renderQtype = this.questionType
    const pregunta = this.props.questionList[this.state.indPregunta]
    
    return(
      <div class="index-body container-fluid" id="questions">

        <div class="p-4 row-1">
          <div class="col" className="card">
            <h1 class="text-center">Nombre del Test</h1>
            <Timer duracion={1} sendTest={this.props.sendTest}></Timer>
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
    
  
  }

}

export default QuestionContainer;