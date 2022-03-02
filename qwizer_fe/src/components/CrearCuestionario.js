import React from 'react'
import {getSubjects,getAllSubjects,getSubjectQuestions} from '../utils/manage_subjects.js'
import {sendCreatedTest} from '../utils/manage_test.js'


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
      this.getPregAsignaturas = this.getPregAsignaturas.bind(this);
    }

    componentDidMount(){
        //peticion para conseguir las asignaturas disponibles
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
                Asignatura :<select defaultValue='null' onChange={(e) => this.setState({testSubject:Number(e.target.value)})}>
                            {this.state.asignaturasImpartidas.map((subject,indx) => {
                                            return (
                                                <option key={indx} value={subject.id}>{subject.nombre}</option>
                                            );
                            })}
                            <option key='null' value='null'> Selecciona una Asignatura </option>
                            </select>
                
            </div>
            <div className='row'>
                Secuencial :<select defaultValue='0' onChange={(e) => this.setState({secuencial:Number(e.target.value)})}>
                                <option value="0">No</option>
                                <option value="1">Si</option>
                            </select>
            </div>
            <div className='row'>
                <p>Duracion: <input type="number" name="testDuration" min="10" max="180" 
                            onChange={(e) => this.setState({testDuration:e.target.value})}/>
                                minutos (max 3h)</p>
            </div>
            <div className='row'>
                Fecha Apertura: <input type="datetime-local" name="fechaApertura" onChange={(e) => this.setState({fechaApertura:e.target.value})} />
            
            </div>
            <div className='row'>
                Fecha Cierre: <input type="datetime-local" name="fechaCierre" onChange={(e) => this.setState({fechaCierre:e.target.value})} />
        
            </div>
            
           </div>
    }

    addSelectedQuestion = () => {
        if(this.state.selectedQuestion !== 'null'){
            var listaPregSelec = this.state.selectedList //lista de preguntas seleccionadas para el cuestionario
            var pregunta = this.state.preguntas[this.state.selectedQuestion] 

            if(!listaPregSelec.includes(pregunta)){
                listaPregSelec.push(pregunta)
                var diccionarioPregSelec = this.state.selectedListInfo
                diccionarioPregSelec[pregunta.id] = {punt_positiva:0,punt_negativa:0}
                this.setState({selectedList:listaPregSelec,selectedListInfo:diccionarioPregSelec})
            }
            
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
            console.log(cuestionario)
            sendCreatedTest(cuestionario).then(data => {
                console.log(data)
            }).then(data => {
                this.props.changeCurrentPage('index');
                alert("Cuestionario creado correctamente")
            })
        }

        

    }

    preguntaTest = (pregunta,indx) =>{
        return <div key={indx} className='row'>
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
                        return option.id === pregunta.correct_op && option.op
                    })}
            </div>
            
            
            
        </div>
    }
    preguntaText = (pregunta,indx) =>{
        return <div key={indx} className='row'>
            <div className='row'>
                Pregunta: {pregunta.question}
            </div>
            <div className='row'>
                Respuesta: {pregunta.correct_op}
            </div>
        </div>
    }

    createSelectedQuestions = () => {

        const pregTest = this.preguntaTest
        const pregText = this.preguntaText
        const modfPunt = this.modificarPuntuacion

        if(this.state.selectedList.length !== 0){
            return <div className='card m-3 p-3'>
                {this.state.selectedList.map((pregunta,indx) => {
                    return <div className='card'>

                        {pregunta.type === 'text' && pregText(pregunta,indx)}
                        {pregunta.type === 'test' && pregTest(pregunta,indx)}

                        <div className='row'>
                            <div className='col'>
                                Puntuacion positiva : <input type="number" step="any" onChange={(e) =>modfPunt(pregunta.id,"pos",Number(e.target.value)) }/>
                            </div>
                            <div className='col'>
                                Puntuacion negativa : <input type="number" step="any" onChange={(e) =>modfPunt(pregunta.id,"neg",Number(e.target.value)) }/>
                            </div>
                        </div>
                        
                        <div className='row'>
                            <button type="button" className="btn btn-danger" 
                            onClick={() => this.deleteSelectedQuestion(pregunta) }>
                                Eliminar</button>
                        </div>
                    </div>
                })}
                <button type="button" className="btn btn-primary" onClick={this.enviarCuestionarioCreado}>Guardar</button>
            </div>
        }
        
    }

    bancoPreguntas = () =>{

        if(this.state.listaAsignaturas){
            return <div className="card  m-3 p-3">
                <h1 className='text-center'>Banco de Preguntas</h1>
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
                        Preguntas: {this.state.preguntas && <select defaultValue='null' onChange={(e) => this.setState({selectedQuestion:Number(e.target.value)})}>
                            {this.state.preguntas.map((question,indx) => {
                                return (
                                    <option key={indx} value={indx}>{question.question}</option>
                                );
                            })}
                            <option key='null' value='null'> Selecciona una Pregunta </option>
                        </select>
                        }
                    </div>
                    {this.state.selectedQuestion !== 'null' && 
                        <div className='col'>
                            <button type="button" className="btn btn-success" onClick={this.addSelectedQuestion}>Añadir</button>
                            </div>
                    }
    
                </div>
                
                
                
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
