import React, { Component } from 'react'
import {getAllSubjects,getSubjectQuestions} from '../utils/manage_subjects.js'



export default class CrearCuestionario extends React.Component {

    constructor(props) {
      super(props)
    
      this.state = {
        selectedList: [],
        selectedQuestion: 'null',
      }

      this.cuestionarioInfo = this.cuestionarioInfo.bind(this);
      this.getPregAsignaturas = this.getPregAsignaturas.bind(this);
    }

    componentDidMount(){
        //peticion para conseguir las asignaturas disponibles
        this.getAsignaturas()
    }

    getAsignaturas = () => {
        getAllSubjects().then(data => {
            this.setState({
              listaAsignaturas: data.asignaturas,
            }); 
          })
    }
    getPregAsignaturas = (idAsignatura) =>{
        getSubjectQuestions(idAsignatura).then(data => {
            this.setState({
                preguntas: data.preguntas,
            }); 
          });
    }

    cuestionarioInfo = () => {
        return <div className="card m-3 p-3">
            <div className='row'>
                Nombre :<input name="testName" type="text"  onChange={(e) => this.setState({testName:e.target.value})}/>
            </div>
            <div className='row'>
                Password :<input name="testPass" type="text"  onChange={(e) => this.setState({testPass:e.target.value})}/>
            </div>
            <div className='row'>
                Asignatura :<input name="testSubject" type="text"  onChange={(e) => this.setState({testSubject:e.target.value})}/>
            </div>
            <div className='row'>
                Secuencial :<select onChange={(e) => this.setState({secuencial:Number(e.target.value)})}>
                                <option value="0">No</option>
                                <option value="1">Si</option>
                            </select>
            </div>
            <div className='row'>
                Duracion: <input type="number" name="testDuration" min="10" max="180" 
                            onChange={(e) => this.setState({testDuration:e.target.value})}/>minutos (max 3h)
            </div>
            <div className='row'>
                Fecha Apertura: <input type="datetime-local" name="fechaApertura" onChange={(e) => this.setState({fechaApertura:e.target.value})} />
            
            </div>
            <div className='row'>
                Fecha Cierre: <input type="datetime-local" name="fechaCierre" onChange={(e) => this.setState({fechaApertura:e.target.value})} />
        
            </div>
            
           </div>
    }

    addSelectedQuestion = () => {
        if(this.state.selectedQuestion != 'null'){
            var listaPregSelec = this.state.selectedList //lista de preguntas seleccionadas para el cuestionario
            
            if(!listaPregSelec.includes(this.state.preguntas[this.state.selectedQuestion])){ //Se añade si no estaba en la lista
                listaPregSelec.push(this.state.preguntas[this.state.selectedQuestion])
                this.setState({selectedList:listaPregSelec})
            }
        }
        
        
    }

    preguntaTest = (pregunta) =>{
        return <div>
            <div className='row'>
                Pregunta: {pregunta.question}
            </div>
            <div className='row'>
            Opciones: <lo>{pregunta.options.map((option,indx) =>{
                    return <li> {option.op} </li>
                })}</lo>
            </div>
            <div className='row'>
            Opcion corecta: {pregunta.options.map((option,indx) =>{
                        return option.id == pregunta.correct_op && option.op
                    })}
            </div>
            
            
            
        </div>
    }
    preguntaText = (pregunta) =>{
        return <div>
            <div className='row'>
                Pregunta: {pregunta.question}
            </div>
            <div className='row'>
                Respuesta: {pregunta.correct_op}
            </div>
        </div>
    }

    deleteSelectedQuestion = (pregunta) => {
        var lista = this.state.selectedList
        lista.splice(lista.indexOf(pregunta), 1)
        this.setState({selectedList:lista})
    }
    createSelectedQuestions = () => {

        const pregTest = this.preguntaTest
        const pregText = this.preguntaText
        if(this.state.selectedList.length != 0){
            return <div className='card m-3 p-3'>
                {this.state.selectedList.map((pregunta,indx) => {
                    return <div className='card'>
                        {pregunta.type == 'text' && pregText(pregunta)}
                        {pregunta.type == 'test' && pregTest(pregunta)}
                        <button type="button" className="btn btn-danger" 
                        onClick={() => this.deleteSelectedQuestion(pregunta) }>
                            Eliminar</button>
                    </div>
                })}
            </div>
        }
        
    }

    bancoPreguntas = () =>{

        if(this.state.listaAsignaturas){
            return <div className="card  m-3 p-3">
                <h1 className='text-center'>Banco de Preguntas</h1>
                Asignatura :<select onChange={(e) => this.getPregAsignaturas(e.target.value)}>
                        {this.state.listaAsignaturas.map((subject,indx) => {
                            return (
                                <option key={indx} value={subject.id}>{subject.asignatura}</option>
                            );
                        })}
                        <option key='null' value='null'> Selecciona una Asignatura </option>
                    </select>
                Preguntas: {this.state.preguntas && <select onChange={(e) => this.setState({selectedQuestion:Number(e.target.value)})}>
                        {this.state.preguntas.map((question,indx) => {
                            return (
                                <option key={indx} value={indx}>{question.question}</option>
                            );
                        })}
                        <option key='null' value='null'> Selecciona una Pregunta </option>
                    </select>
                    }
                {this.state.selectedQuestion != 'null' && <button type="button" className="btn btn-success" onClick={this.addSelectedQuestion}>Añadir</button>}
            </div>
        }
        
    }

    render() {

        return<div>
            <h1 className='text-center'>Crear cuestionario</h1>
            {this.cuestionarioInfo()}
            {this.bancoPreguntas()}
            {this.createSelectedQuestions()}
        </div>
    }
}
