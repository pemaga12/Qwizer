import React, { Component } from 'react'
import $ from 'jquery'; 
import ErrorModal from './common/modals/ErrorModal';
import SuccessModal from './common/modals/SuccessModal';



export default class UploadFile extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         file:'',
         message: undefined
      };

      this.setFile = this.setFile.bind(this);
      this.uploadFile = this.uploadFile.bind(this);
      
    }
    
    setFile = (e) =>{
        this.setState({file: e.target.files[0]})
        e.target.value = ''
    }

    uploadFile = () => {
        if(this.state.file.name !== ""){
            let reader = new FileReader();
            reader.readAsText(this.state.file,'utf-8');
            reader.onload = (e) =>{               
                const fichero_yaml = new Map([["fichero_yaml", e.target.result]]);
                const jsonObject = JSON.stringify(Object.fromEntries(fichero_yaml));
                var token = localStorage.getItem('token');

                fetch('http://127.0.0.1:8000/api/upload', {
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
                    if(data.inserted == "false"){
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


    render() {

        return (
            <div className="upload-body">
                <div className="card upload-section ">
                    <div className="header bg-blue-grey">
                        <h2>Sube tu cuestionario en formato : YAML</h2>
                    </div>
                    <div className='upload-inner-body'>
                        <h4><label htmlFor="myfile">Selecciona un archivo:</label></h4>
                        <div className="input-group">
                            <div className="custom-file">
                                <input type="file" className="custom-file-input" aria-describedby="inputGroupFileAddon01" onChange={(e) => this.setFile(e)} id="myfile"  name="myfile"/>
                                    <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.file.name}</label>
                            </div>
                        </div>
                        <div className="upload-message-section">
                        {this.state.file !== '' && 
                            <button type="button" className="btn btn-success btn-submit" onClick={this.uploadFile}>Subir Cuestionario</button>
                        }
                        </div>
                    </div>                        
                </div>
                <ErrorModal id={"inserted_error"} message={this.state.message}></ErrorModal>
                <SuccessModal id={"inserted_success"} message={this.state.message}></SuccessModal>
            </div>
        )
       
    }
}
