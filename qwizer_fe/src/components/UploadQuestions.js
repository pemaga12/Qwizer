import React, { Component } from 'react'
import $ from 'jquery'; 
import ErrorModal from './common/modals/ErrorModal';
import SuccessModal from './common/modals/SuccessModal';
import {getSubjects} from '../utils/manage_subjects.js'


export default class UploadQuestions extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         file:'',
         message: undefined
      };

      this.setFile = this.setFile.bind(this);
      this.uploadFile = this.uploadFile.bind(this);
      this.getImparteAsignaturas = this.getImparteAsignaturas.bind(this);
      
    }

    componentDidMount(){
        this.getImparteAsignaturas();
    }

    getImparteAsignaturas = () => {
        getSubjects().then(data => {
            this.setState({
              asignaturasImpartidas: data.asignaturas,
            }); 
          })
    }

    setFile = (e) =>{
        this.setState({file: e.target.files[0]})
        e.target.value = ''
    }

    uploadFile = () => {
        if(this.state.file.name !== "" && this.state.idAsignatura){
            let reader = new FileReader();
            reader.readAsText(this.state.file,'utf-8');
            reader.onload = (e) =>{               
                const fichero_yaml = new Map([["fichero_yaml", e.target.result],["idAsignatura",this.state.idAsignatura]]);
                const jsonObject = JSON.stringify(Object.fromEntries(fichero_yaml));
                var token = localStorage.getItem('token');

                fetch('http://127.0.0.1:8000/api/upload-questions', {
                method: 'POST',
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': token
                },
                body: jsonObject
                })
                .then(response => response.json())
                .then(data => {
                
                    this.setState({
                        file: "",
                        message: data.message
                    });
                    if(data.inserted === "false"){
                        window.$("#inserted_error").modal('show');
                    } 
                    else{
                        window.$("#inserted_success").modal('show');
                    } 
                             
                    })
                .catch(error => console.log(error));
            }
        }
    }

    seleccionaAsignatura = () => {
        return <div className='row'>
                    <h3>Selecciona una asignatura:</h3>
                    <select defaultValue='null' onChange={(e) => this.setState({idAsignatura:Number(e.target.value)})}>
                                {this.state.asignaturasImpartidas.map((subject,indx) => {
                                                return (
                                                    <option key={indx} value={subject.id}>{subject.nombre}</option>
                                                );
                                })}
                                <option key='null' value='null'> Selecciona una Asignatura </option>
                                </select>
                    
                </div>
    }

    render() {

        if(this.state.asignaturasImpartidas){
            return (
                <div className="upload-body">
                    <div className="card upload-section ">
                        <div className="header bg-blue-grey">
                            <h2>Sube tus preguntas en formato : YAML</h2>
                        </div>
                        <div className='upload-inner-body'>
                            <h4><label htmlFor="myfile">Selecciona un archivo:</label></h4>
                            <div className="input-group">
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" aria-describedby="inputGroupFileAddon01" onChange={(e) => this.setFile(e)} id="myfile"  name="myfile"/>
                                     <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.file.name}</label>
                                </div>
                            </div>
                            
                            {this.seleccionaAsignatura()}
                            
                            <div className="upload-message-section">
                            {this.state.file !== '' && this.state.idAsignatura && 
                                <button type="button" className="btn btn-success btn-submit" onClick={this.uploadFile}>Subir Preguntas</button>
                            }
                            </div>
                        </div>   

                    </div>
                    <ErrorModal id={"inserted_error"} message={this.state.message}></ErrorModal>
                    <SuccessModal id={"inserted_success"} message={this.state.message}></SuccessModal>
                </div>
            )
        }else{
            return <h1>Loading..</h1>
        }
    }
}
