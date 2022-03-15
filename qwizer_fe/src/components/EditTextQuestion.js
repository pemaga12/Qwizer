import React from 'react'


export default class EditTextQuestion extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        nombre:"",
        textValue: ""
      };
      this.actualizarPregunta = this.actualizarPregunta.bind(this);
    }

    componentDidMount(){
       this.setState({
           nombre:this.props.pregunta.question,
           textValue:this.props.pregunta.correct_op,
        })
    }

    

    actualizarPregunta(){
        var question = this.props.pregunta
        question["question"] = this.state.nombre
        question["correct_op"] = this.state.textValue
        this.props.updateEditQuestion(question);
    }

    render () {
        return(
            <div class="p-4 m-2 text-center">
                <div className='row'>
                    Pregunta : <input name="nombre" type="text" value={this.state.nombre} onChange={(e) => this.setState({nombre:e.target.value})}/>
                </div>
                <div className='row'>Respuesta : <textarea rows="5" cols="50" name="textValue" onChange={(e) =>  this.setState({textValue: e.target.value})} 
                value={this.state.textValue} /></div>
                <button class="btn btn-success" onClick={() => this.actualizarPregunta()}> Actualizar </button>
            </div>
        );
    }
}  