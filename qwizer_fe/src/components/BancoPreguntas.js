import React from 'react'
import {getAllSubjects,getSubjectQuestions} from '../utils/manage_subjects.js'


export default class BancoPreguntas extends React.Component {

    constructor(props) {
      super(props)
    
      this.state = {
        listaAsignaturas:[], //lista de asignaturas del banco de preguntas
        selectQuestions:false, //si esta a true permite seleccionar las preguntas a descargar, si false, solo se pueden visualizar las preguntas
        selectedQuestions:[], //lista de ids de preguntas seleccionadas para luego descargarlas en yaml
        itemsPerPage:2,
        paginationPage:0,
      }

      this.getPregAsignaturas = this.getPregAsignaturas.bind(this);
    }

    componentDidMount(){
        this.getAsignaturas();
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
                totalPages: data.preguntas.length/this.state.itemsPerPage,
            }); 
          });
    }
    
    bancoPreguntas = () =>{

        if(this.state.listaAsignaturas){
            return <div className="card  m-3 p-3">
                <div className='row'>
                    <div className='col'>
                        Asignatura :<select defaultValue='null' onChange={(e) => this.getPregAsignaturas(e.target.value)}>
                            {this.state.listaAsignaturas.map((subject,indx) => {
                                return (
                                    <option key={indx} value={subject.id}>{subject.asignatura}</option>
                                );
                            })}
                            <option key='null' value='null'> Selecciona una Asignatura </option>
                        </select>
                    </div>
                    <div className='col'>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" 
                            onClick={() => this.setState({selectQuestions:!this.state.selectQuestions})}
                            checked={this.state.selectQuestions}/>
                            <label className="form-check-label" for="flexSwitchCheckDefault">Seleccionar Preguntas</label>
                        </div>
                    </div>
                    {this.state.preguntas &&
                        <div className='col'>
                            <p>Page: <input type="number" name="page-number" min="1" max={this.state.totalPages} 
                                onChange={(e) => this.setState({paginationPage:e.target.value-1})} value={this.state.paginationPage+1}/>
                                    {"/" + this.state.totalPages}</p>
                        </div>}
                </div> 
            </div>
        }
        
    }

    selectQuestionsInterface = () => {//falta implementar que cuando se selecciona se añada la pregunta a la lista de preguntas a descargar
        var numItems = 0;
        return <div className="list-group">
            {this.state.preguntas.map((question,indx) => {
                
                if(indx >= this.state.paginationPage*this.state.itemsPerPage && numItems < this.state.itemsPerPage){
                    numItems++;
                    return (
                        <label key={indx} className="list-group-item">
                            <input key={indx} type="checkbox" className="form-check-input me-1"  value=""/>
                            {question.question}
                        </label>
                    );
                }
                
            })}
        </div>
    }

    listQuestionsInterface = () =>{
        var numItems = 0;
        return <div className="list-group">
                {this.state.preguntas.map((question,indx) => {
                     if(indx >= this.state.paginationPage*this.state.itemsPerPage && numItems < this.state.itemsPerPage){
                        numItems++;
                        return (
                            <button key={indx} type="button" className="list-group-item list-group-item-action"
                                onClick={() => this.visualizeQuestion(question.id)}>
                                {question.question}
                            </button>
                        );
                    }
                    
                })}
            </div>
    }

    visualizeQuestion = (idPregunta) =>{ //Fisualizar la pregunta seleccionada y poder editarla

    }

    editQuestion = () =>{ //Editar la pegunta seleccionada y actualizarla en la base de datos

    }

    downloadSelectedQuestions = () => { //Funcion para descargar las preguntas seleccionadas en formato yaml

    }

    generatePagination = () => {
        if(this.state.totalPages){
            return <nav aria-label="Page navigation example">
                <ul class="pagination">
                <button class="page-item page-link" onClick={()=> this.state.paginationPage-1>= 0 &&
                                                        this.setState({paginationPage:this.state.paginationPage-1})} >Previous</button>
                <button class="page-item page-link" onClick={()=> this.state.paginationPage+1 < this.state.totalPages &&
                                                        this.setState({paginationPage:this.state.paginationPage+1})}>Next</button>
                </ul>
            </nav>
        }
        
    }

    render() {

        return<div>
                <h1 className='text-center'>Banco de Preguntas</h1>
                {this.bancoPreguntas()}
                <div className="card  m-3 p-3">
                    {this.state.selectQuestions===false && this.state.preguntas && this.listQuestionsInterface()}
                    {this.state.selectQuestions===true && this.state.preguntas && this.selectQuestionsInterface()}
                </div>
                
                {this.state.preguntas && this.generatePagination()}
            </div>
    }
}
