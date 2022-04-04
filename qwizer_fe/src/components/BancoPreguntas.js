import React from 'react'
import {getAllSubjects,getSubjectQuestions} from '../utils/manage_subjects.js'
import ErrorModal from './common/modals/ErrorModal.js'
import SuccessModal from './common/modals/SuccessModal.js'
import DataTable from 'react-data-table-component'
import yaml from 'js-yaml'
import VisualizarPregunta from './VisualizarPregunta.js'


export default class BancoPreguntas extends React.Component {

    constructor(props) {
      super(props)
    
      this.state = {
        selectedAsignatura:undefined,
        listaAsignaturas:undefined, //lista de asignaturas del banco de preguntas
        columns: undefined, 
        data: undefined,
        title: undefined,
        preguntasSeleccionadas: undefined
      }

      this.getPregAsignaturas = this.getPregAsignaturas.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSelectChange = this.handleSelectChange.bind(this);
      this.generar_tabla = this.generar_tabla.bind(this);
      this.downloadselectedList = this.downloadselectedList.bind(this);
      this.downloadButton = this.downloadButton.bind(this);
    }

    componentDidMount(){
        this.getAsignaturas();
    }


    getAsignaturas = () => {
        getAllSubjects().then(data => {
            this.setState({
              listaAsignaturas: data.asignaturas,
            }); 
            this.state.listaAsignaturas.map(function(asignatura,indx){
                window.$("#subject-selector").append(new Option(asignatura.asignatura, asignatura.id));
              });

        })
    }

    getPregAsignaturas = (idAsignatura) =>{
        getSubjectQuestions(idAsignatura).then(data => {
            this.setState({
                selectedAsignatura:idAsignatura,
                preguntas: data.preguntas,
            }); 
            this.generar_tabla()
          });
          
          
    }

    generar_tabla = () => {
        var columns = [
          {
            name: 'Id',
            selector: row => row.id,
            sortable: true,
            omit: true,
          },
          {
            name: 'objeto',
            selector: row => row.objeto,
            omit: true,
          },
          {
            name: 'Título',
            selector: row => row.title,
            sortable: true,
          },
          {
            name: 'Pregunta',
            selector: row => row.question,
            sortable: true
          }
        ];
        
        var data = [];
        this.state.preguntas.map(function(pregunta,indx){
            let row = {
            id : pregunta.id,
            objeto : pregunta,
            title : pregunta.title,
            question : pregunta.question
          }
          data.push(row);
        });
    
          
        this.setState({
          columns: columns,
          data: data,
          title: "Preguntas de la asignatura" 
        });
      }
    
  
    handleChange = ({ selectedRows }) => {
        this.setState({
          preguntasSeleccionadas: selectedRows
        })
        
    }

    handleSelectChange = () => {
        this.getPregAsignaturas(window.$("#subject-selector").val());
        
    }
    
   
    deleteQuestion = (idPregunta) =>{

      var token = localStorage.getItem('token');
      var url = "http://127.0.0.1:8000/api/delete-question";

      const message = new Map([["idPregunta", idPregunta]]);
      const obj = JSON.stringify(Object.fromEntries(message));

      fetch(url , {
          method: 'POST',
          headers:{
          'Content-type': 'application/json',
          'Authorization': token
          },
          body: obj
      }).then(data => data.json())
      .then(e => this.getPregAsignaturas(this.state.selectedAsignatura))
      .catch(e => console.log(e))

    }
    
    updateEditedQuestion = (question) => {

      var token = localStorage.getItem('token');
      var url = "http://127.0.0.1:8000/api/update-question";

      const message = new Map([["preguntaActualizada", question]]);
      const preguntaObj = JSON.stringify(Object.fromEntries(message));

      return fetch(url , {
          method: 'POST',
          headers:{
          'Content-type': 'application/json',
          'Authorization': token
          },
          body: preguntaObj
      })
      .then( e => this.getPregAsignaturas(this.state.selectedAsignatura))
      .catch(e => console.log(e))
    }

    downloadselectedList = () => { //Funcion para descargar las preguntas seleccionadas en formato yaml

        var listaSeleccionadas = this.state.preguntasSeleccionadas.map(seleccionada =>{
            return seleccionada.id;
        });
        
        var preguntas = this.state.preguntas.filter(pregunta => listaSeleccionadas.includes(pregunta.id));
        
        var listaPreguntas = []
        preguntas.map(pregunta =>{

            var question = {}
            question["tipo"] = pregunta.type
            question["pregunta"] = pregunta.question
            question["opciones"] = pregunta.options

            if(pregunta.type == "test"){
                question["opciones"] = pregunta.options
            }

            question["op_correcta"] = pregunta.correct_op

            listaPreguntas.push(question)
        })

        var jsonObj = {"preguntas": listaPreguntas}

        //Convet JSON to Yaml

        var yamlObj = yaml.dump(jsonObj)

        //Crear enlace

        var data = new Blob ([yamlObj],{type :'text/yml'})
        let elemx = window.document.createElement('a');
        elemx.href = window.URL.createObjectURL(data);
        elemx.download = "preguntas.yaml";
        elemx.style.display = "none";
        document.body.appendChild(elemx);
        elemx.click();
        document.body.removeChild(elemx);
    }

    downloadButton = () => {
        return <><button className="btn btn-success"  onClick={this.downloadselectedList}>Descargar</button></> 
    } 

    ExpandedComponent = ({ data }) => <VisualizarPregunta data={data.objeto}
                                        deleteQuestion={this.deleteQuestion}
                                        updateEditedQuestion={this.updateEditedQuestion}>
                                      </VisualizarPregunta>;

    render() {

      
        
        return <div className="index-body">
          <div className="card tabla-notas">
            <div className='card-content'>
              <h4 className='d-flex justify-content-center'>Banco de preguntas</h4>
              <label>Selecciona una asignatura para visualizar sus preguntas</label>
              <select className="form-select" id="subject-selector" onChange={this.handleSelectChange} aria-label="Default select example">
                <option hidden defaultValue>Selecciona una asignatura</option>
              </select>
              <br/>
              <DataTable
                  pointerOnHover
                  selectableRows 
                  pagination
                  theme={"default"}	
                  title= {this.state.title}
                  columns={this.state.columns}
                  data={this.state.data}
                  onSelectedRowsChange={this.handleChange}
                  expandableRows
                  expandableRowsComponent={this.ExpandedComponent}
                  contextActions={this.downloadButton()}>      
              </DataTable>
            </div>
          </div>
          <ErrorModal id={"inserted_error"} message={this.state.message}></ErrorModal>
          <SuccessModal id={"inserted_success"} message={this.state.message}></SuccessModal>
        </div>
      
      
       
    }
}
