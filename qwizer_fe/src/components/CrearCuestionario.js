import React from 'react'
import {getSubjects,getAllSubjects,getSubjectQuestions} from '../utils/manage_subjects.js'
import {sendCreatedTest} from '../utils/manage_test.js'
import BancoPreguntas from './BancoPreguntas.js'
import TestQuestion from './TestQuestion'
import TextQuestion from './TextQuestion'


export default class CrearCuestionario extends React.Component {

    constructor(props) {
      super(props)
    
      this.state = {
        asignaturasImpartidas:[],
        listaAsignaturas:[],
        selectedList: [],
        selectedListInfo:{},
        selectedQuestion: 'null',
        secuencial:0,
      }

      this.cuestionarioInfo = this.cuestionarioInfo.bind(this);
    }

    componentDidMount(){
        this.getImparteAsignaturas();
        this.getAsignaturas();
    }

    getImparteAsignaturas = () => {
        getSubjects().then(data => {
            this.setState({
              asignaturasImpartidas: data.asignaturas,
            }); 
          })
    }

    getAsignaturas = () => {
        getAllSubjects().then(data => {
            this.setState({
              listaAsignaturas: data.asignaturas,
            }); 
          })
    }

    cuestionarioInfo = () => {
        return <div className="card m-3 p-3">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">Nombre: &nbsp;</span>
                </div>
                <input  className="form-control" name="testName" type="text" onChange={(e) => this.setState({testName:e.target.value})}/>
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">Contraseña: &nbsp;</span>
                </div>
                <input  className="form-control" name="testPass" type="text"  onChange={(e) => this.setState({testPass:e.target.value})}/>
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">Asignatura: &nbsp;</span>
                </div>
                <select className='form-control' defaultValue='null' onChange={(e) => this.setState({testSubject:Number(e.target.value)})}>
                            {this.state.asignaturasImpartidas.map((subject,indx) => {
                                            return (
                                                <option key={indx} value={subject.id}>{subject.nombre}</option>
                                            );
                            })}
                            <option key='null' value='null'> Selecciona una Asignatura </option>
                            </select>
            </div>

            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">Secuencial: &nbsp;</span>
                </div>
                <select className='form-control' defaultValue='0' onChange={(e) => this.setState({secuencial:Number(e.target.value)})}>
                                <option value="0">No</option>
                                <option value="1">Si</option>
                            </select>
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">Duración: (minutos [max 3h]) &nbsp;</span>
                </div>
                <input  className='form-control' type="number" name="testDuration" min="10" max="180" 
                            onChange={(e) => this.setState({testDuration:e.target.value})}/>
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">Fecha Apertura: &nbsp;</span>
                </div>
                <input className='form-control' type="datetime-local" name="fechaApertura" onChange={(e) => this.setState({fechaApertura:e.target.value})} />
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">Fecha Cierre: &nbsp;</span>
                </div>
                <input className='form-control' type="datetime-local" name="fechaCierre" onChange={(e) => this.setState({fechaCierre:e.target.value})} />
            </div>
           </div>
    }

    addSelectedQuestion = (pregunta) => {
        
        var listaPregSelec = this.state.selectedList //lista de preguntas seleccionadas para el cuestionario

        if(!listaPregSelec.includes(pregunta)){
            listaPregSelec.push(pregunta)
            var diccionarioPregSelec = this.state.selectedListInfo
            diccionarioPregSelec[pregunta.id] = {punt_positiva:0,punt_negativa:0}
            this.setState({selectedList:listaPregSelec,selectedListInfo:diccionarioPregSelec})
        }
    }

    modificarPuntuacion = (id,tipo,punt) => {

        var diccionarioPregSelec = this.state.selectedListInfo;
        var punt_info = diccionarioPregSelec[id]

        if(tipo === "pos"){
            punt_info.punt_positiva = punt;
        }else if(tipo === "neg"){
            punt_info.punt_negativa = punt;
        }

        diccionarioPregSelec[id] = punt_info;

        this.setState({selectedListInfo:diccionarioPregSelec})
    }
    

    deleteSelectedQuestion = (pregunta) => {
        var lista = this.state.selectedList
        lista.splice(lista.indexOf(pregunta), 1)
        var diccionario = this.state.selectedListInfo
        delete diccionario[pregunta.id]
        this.setState({selectedList:lista,selectedListInfo:diccionario})
    }

    enviarCuestionarioCreado = () =>{

        var cuestionario = {};
        var incorrect = false;

        if(this.state.testName){
            cuestionario["testName"] = this.state.testName
        }else{
            alert("Debes rellenar el campo: Nombre")
            incorrect = true;
            
        }   

        if(this.state.testPass){
            cuestionario["testPass"] = this.state.testPass
        }else{
            alert("Debes rellenar el campo: Password")
            incorrect = true;
        }

        if(this.state.testSubject !== 'null'){
            cuestionario["testSubject"] = this.state.testSubject
        }else{
            alert("Debes selecionar la asingatura del Asignatura")
            incorrect = true;
        }

        
        cuestionario["secuencial"] = this.state.secuencial
        

        if(this.state.testDuration){
            cuestionario["testDuration"] = this.state.testDuration
        }else{
            alert("Debes introducir la duracion del test")
            incorrect = true;
        }

        if(this.state.fechaApertura && this.state.fechaCierre){

            let date1 = new Date(this.state.fechaApertura);
            let date2 = new Date(this.state.fechaCierre);
            
            
            if(date1 <= date2){

                date1 = date1.valueOf();
                date2 = date2.valueOf();
                let timepoDesdeAperturaACierre = date2 - date1; //en milisegundos
                let duracionTestMilisegundos = this.state.testDuration * 60 * 1000 // de minutos a milisegundos

                if(timepoDesdeAperturaACierre >= duracionTestMilisegundos){
                    cuestionario["fechaApertura"] = date1
                    cuestionario["fechaCierre"] = date2
                }else{
                    alert("No da tiempo ha hacer el test entre esas dos fechas")
                    incorrect = true;
                }

            }else{
                alert("La fecha de cierre no puede ser antes que la fecha de apertura")
                incorrect = true;
            }
            
        }else{
            alert("Debes rellenar el campo: de Fecha Apertura/Cierre")
            incorrect = true;
        }
        
        
        if(this.state.selectedList.length !== 0){ 

            var listaPreguntas = []
            for (const key in this.state.selectedListInfo) {
                var pregunta = {}
                pregunta["id"] = key;
                pregunta["punt_positiva"] = this.state.selectedListInfo[key].punt_positiva;
                pregunta["punt_negativa"] = this.state.selectedListInfo[key].punt_negativa;

                listaPreguntas.push(pregunta);
            }
            cuestionario["questionList"] = listaPreguntas
        }else{
            alert("Debes seleccionar al menos 1 pregunta del banco de preguntas")
            incorrect = true;
        }
        
        if(!incorrect){//si se han rellenado todos los campos bien, entonces se envia
            sendCreatedTest(cuestionario).then(data => {
            }).then(data => {
                this.props.changeCurrentPage('index');
                alert("Cuestionario creado correctamente")
            })
        }

        

    }


    createSelectedQuestions = () => {

        const modfPunt = this.modificarPuntuacion

        if(this.state.selectedList.length !== 0){
            return <div className='card m-3 p-3'>
                {this.state.selectedList.map((pregunta,indx) => {
                    return <div className='card'>

                        {pregunta.type === 'text' && <TextQuestion mode="visualize" infoPreg={pregunta} id={pregunta.id}/>}
                        {pregunta.type === 'test' && <TestQuestion mode="visualize" infoPreg={pregunta} id={pregunta.id}/>}

                        <div className="d-flex flex-column justify-content-center visualize-container">
                            <div className='row m-1'>
                                <label className='col-4'>Puntuación positiva: &nbsp;</label>
                                <input className="col-8 m-input" type="number" step="any" onChange={(e) =>modfPunt(pregunta.id,"pos",Number(e.target.value)) }/>
                                <label className='col-4'>Puntuación negativa: &nbsp;</label>
                                <input className="col-8 m-input" type="number" step="any" onChange={(e) =>modfPunt(pregunta.id,"neg",Number(e.target.value)) }/>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type="button" className="btn btn-danger m-1" onClick={() => this.deleteSelectedQuestion(pregunta) }>Eliminar</button>
                        </div>
                    </div>
                })}
                <div className='d-flex justify-content-center'>
                    <button type="button" className="btn btn-primary" onClick={this.enviarCuestionarioCreado}>Guardar</button>
                </div>
                
            </div>
        }
        
    }

    

    
    render() {

        return<div>
                <h1 className='text-center'>Crear cuestionario</h1>
                {this.cuestionarioInfo()}
                <BancoPreguntas createQuiz={true} addQuestion={this.addSelectedQuestion}></BancoPreguntas>
                {this.createSelectedQuestions()}
            </div>
    }
}
