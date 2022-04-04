import React, { Component } from 'react'
import $ from 'jquery'
import TestQuestion from './TestQuestion'
import TextQuestion from './TextQuestion'
import EditTextQuestion from './EditTextQuestion'
import EditTestQuestion from './EditTestQuestion'

export default class VisualizarPregunta extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         editQuestion:false,
      };

    }
    
    componentWillMount = () => {
        
    }


    visualizeQuestion = () =>{ //Visualizar la pregunta seleccionada y poder editarla
    
        if(this.props.data.type == "test"){

            return  <div>
                    <TestQuestion mode="visualize" infoPreg={this.props.data} id={this.props.data.id}/>
                    <button class="btn btn-danger"  onClick={() => this.props.deleteQuestion(this.props.data.id)}> Eliminar Pregunta </button>
                    <button class="btn btn-warning"  onClick={() => this.setState({editQuestion:true})}> Editar Pregunta </button>
                </div> 

        }else if (this.props.data.type == "text"){

            return  <div>
                    <TextQuestion mode="visualize" infoPreg={this.props.data} />
                    <button class="btn btn-danger"  onClick={() => this.props.deleteQuestion(this.props.data.id)}> Eliminar Pregunta </button>
                    <button class="btn btn-warning"  onClick={() => this.setState({editQuestion:true})}> Editar Pregunta </button>
                </div>    
        }
    }

    modifyQuestion = (question) => {
        this.props.updateEditedQuestion(question).then(this.setState({editQuestion:false}))
        
    }

    editQuestion = () => {

        if(this.props.data.type == "test"){
            return  <div>
                    <EditTestQuestion pregunta={this.props.data} updateEditQuestion={this.modifyQuestion}/>
                </div> 
        }

        if(this.props.data.type == "text"){
            return  <div>
                    <EditTextQuestion pregunta={this.props.data} updateEditQuestion={this.modifyQuestion} />
                </div> 
        }
    }
    render() {
        if(!this.state.editQuestion){
            return this.visualizeQuestion()
            
        }else{
            return this.editQuestion()
        }
       
    }
}
