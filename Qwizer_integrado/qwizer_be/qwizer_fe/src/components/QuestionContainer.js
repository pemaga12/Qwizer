import React from 'react'


import TestQuestion from './TestQuestion.js'
import TextQuestion from './TextQuestion.js'
import QuestionNav from './QuestionNav.js'



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
    this.sendAnswers = this.sendAnswers.bind(this);
    this.navHandler = this.navHandler.bind(this);
  }

  sendAnswers = () =>{
    alert("Funcion de questionContainer");
  }
  
  questionType = (pregunta) => {

    if(pregunta != null){

      if(pregunta.type == 'test'){
        return  <TestQuestion key={pregunta.id} question={pregunta.question} options={pregunta.options} id={pregunta.id} type={pregunta.type} addAnswerd={this.props.addAnswerMethod}/>
      } // else type = 'text'

      return <TextQuestion key={pregunta.id} question={pregunta.question} id={pregunta.id} type={pregunta.type} addAnswerd={this.props.addAnswerMethod}/>
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
    if(this.state.indPregunta == 0){
      return <button onClick={this.updateIndNext}>Siguiente</button>
    }else if(this.state.indPregunta > 0 && this.state.indPregunta < this.state.numPreguntas-1){
      return <div>
          <button onClick={this.updateIndBack}>Atras</button>
          <button onClick={this.updateIndNext}>Siguiente</button>
        </div>
    }else{ //this.state.indPregunta == this.state.numPreguntas-1
      return <div>
          <button onClick={this.updateIndBack}>Atras</button>
          <button onClick={this.props.sendTest}>Terminar y Enviar</button>
        </div>
    }

  }
  componentWillMount(){
    this.setState({numPreguntas:this.props.questionList.length});
  }
  navHandler = (val) =>{
    this.setState({indPregunta:val});
  }

  render() { 
      
    const renderQtype = this.questionType
    const pregunta = this.props.questionList[this.state.indPregunta]
    
    return(
      <div id="questions">
        <div id="question-nav">
          <QuestionNav navigationHandler={this.navHandler} listaPreguntas={this.props.questionList}/>
        </div>
        <div key={pregunta.id}>
          <h2> {this.state.indPregunta+1}{".-" + pregunta.question}</h2>
          {renderQtype(pregunta)}
        </div>
        {this.renderButtons()}
      </div>
    );
    
  
  }

}

export default QuestionContainer;