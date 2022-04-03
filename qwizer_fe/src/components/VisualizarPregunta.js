import React, { Component } from 'react'
import $ from 'jquery'


export default class VisualizarPregunta extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         message: undefined,
         data: undefined,
         val: ""
      };

      this.getPregunta = this.getPregunta.bind(this);
      this.unlockFields = this.unlockFields.bind(this);
      this.changeHandler = this.changeHandler.bind(this);
    }
    
    componentWillMount = () => {
        this.setState({
            data: this.props.data
        })
               
        console.log(this.props.data.title);
    }

    getPregunta = () => {
        
    }

    changeHandler = () => {
        
    }

    unlockFields = () => {
        
        window.$(".m-input").prop("disabled", false);


        window.$("#unlock-btn").prop("hidden", true);
        window.$("#save-btn").prop("hidden", false);

        console.log(this.props.data);
    }

    render() {
        if(this.props.data.type == "test")
            return (
                <div>
                   <label>Título de la pregunta: &nbsp;</label><input id="input-title" type="text" value={this.props.data.title} placeholder="Título de la pregunta" disabled></input>
                </div>
            )
        else if (this.props.data.type == "text"){
            return(
                <div>
                    <div className='row visualize-container'>
                        <label className='col-4'>Título de la pregunta: &nbsp;</label><input className="col-8 m-input" id="input-title"  type="text" value={this.props.data.title} placeholder="Título de la pregunta" disabled></input>
                        <br/>
                        <label className='col-4'>Pregunta:&nbsp;</label><input className="col-8 m-input" id="input-question" type="text" value={this.props.data.question} placeholder="Pregunta" disabled></input>
                        <br/>
                        <label className='col-4'>Respuesta:&nbsp;</label><input className="col-8 m-input" id="input-answer" type="text" value={this.props.data.correct_op} placeholder="Respuesta de la pregunta" disabled></input>
                    </div>
                    <div id="btn-group" className='d-flex justify-content-center'>
                        <button className='btn btn-danger'>Borrar pregunta</button>
                        <button id="unlock-btn" className='btn btn-primary' onClick={this.unlockFields}>Modificar pregunta</button>
                        <button id="save-btn" className='btn btn-primary' hidden>Guardar cambios</button>

                    </div>
                </div>
            )
        }
        else{
            return <div>
                <h4>Pregunta mal formada</h4>
            </div>
        }
       
    }
}
