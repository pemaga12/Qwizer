import React, { Component } from 'react'




export default class UploadFile extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
         file:'',
      };

      this.setFile = this.setFile.bind(this);
      this.uploadFile = this.uploadFile.bind(this);
      
    }
    
    setFile = (e) =>{
        this.setState({file: e.target.files[0]})
        console.log(e.target.files[0]);
    }

    uploadFile = () => {
        
        let reader = new FileReader();
        reader.readAsText(this.state.file,'utf-8');
        reader.onload = (e) =>{
            
            const fichero_yaml = new Map([["fichero_yaml", e.target.result]]);
            const jsonObject = JSON.stringify(Object.fromEntries(fichero_yaml));
            console.log(jsonObject)
      
            fetch('http://127.0.0.1:8000/api/upload', {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
              },
            body: jsonObject
            })
            .then(response => response.json())
            .then(success => {
                alert("Test Subido correctamente")
            })
            .catch(error => console.log(error));
        }

        
 
    }


    render() {
        if(this.state.file != ''){
            return (
                <div>
                    <h1>Sube tu cuestionario en formato : YAML</h1>
                    <label htmlFor="myfile">Select a file:</label>
                    <input type="file" onChange={(e) => this.setFile(e)} id="myfile"  name="myfile"/>
                    <button type="button" className="btn btn-success" onClick={this.uploadFile}>Subir Cuestionario</button>
                </div>
            )
        }else{
            return (
                <div>
                    <h1>Sube tu cuestionario en formato : YAML</h1>
                    <label htmlFor="myfile">Select a file:</label>
                    <input type="file" onChange={(e) => this.setFile(e)} id="myfile"  name="myfile"/>
                </div>
            )
        }
        
    }
}
