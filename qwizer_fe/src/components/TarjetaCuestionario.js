import React from 'react'
import $ from 'jquery'; 


class TarjetaCuestionario extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            duracion: 0,
            downloaded: false,
            calificacion: 0,
            corregido: false,
            fecha_apertura: "",
            fecha_cierre: ""
        };
       
        
        this.get_info = this.get_info.bind(this);
        this.getTest = this.getTest.bind(this);
    }

    
    componentWillMount(){
        this.get_info();
        if(localStorage.getItem("test_" + this.props.idCuestionario) != null){
            console.log(localStorage.getItem("test_" + this.props.idCuestionario));
            this.setState({
                downloaded: true
            });
        }
    }



    getTest = (idCuestionario) => {
        var url = 'http://127.0.0.1:8000/api/test';
        var token = localStorage.getItem('token');

        const data = new Map([["idCuestionario", idCuestionario]]);
        const obj = JSON.stringify(Object.fromEntries(data));
        console.log(obj)
        fetch(url , {
          method: 'POST',
          headers:{
            'Authorization': token,
            'Content-type': 'application/json'
          },
          body: obj
          })
        .then(function(response){return response.json();})
        .then(data => {
           
            this.setState({
                downloaded: true,
            });
            const jsonObject = JSON.stringify(data);
            var nombre = "test_" + idCuestionario;
            localStorage.setItem(nombre, jsonObject);
            
        });
        
      }

    get_info = () => {

        var token = localStorage.getItem('token');
        const message = new Map([["idCuestionario", this.props.idCuestionario]]);
        const jsonObject = JSON.stringify(Object.fromEntries(message));
        fetch('http://127.0.0.1:8000/api/get-info-cuestionario', {
        method: 'POST',
        headers:{
            'Content-type': 'application/json',
            'Authorization': token
        },
        body: jsonObject
        })
        .then(response => response.json())
        .then(data => {
            var corregido = true;
            if(data.corregido == 0)
                corregido = false;
            this.setState({
                duracion: data.duracion,
                calificacion: data.nota,
                corregido: corregido,
                fecha_apertura: data.fechaApertura,
                fecha_cierre: data.fechaCierre
            });
            
            if(this.state.calificacion >= 5 && corregido){
                var idCuestionario = "#cuestionario_" + this.props.idCuestionario;
                $(idCuestionario).css("background-color", "#59ac79");
            }
            else if(this.state.calificacion < 5 && corregido){
                var idCuestionario = "#cuestionario_" + this.props.idCuestionario;
                $(idCuestionario).css("background-color", "#9c2400");
            }            
        })
        .catch(error => console.log(error));
    }

    render() { 
        return(
            <div className="card asignatura-section " name={this.props.cuestionario} id={this.props.idCuestionario}>
                <div id={"cuestionario_" + this.props.idCuestionario} className="header bg-blue-grey">
                    <h2>{this.props.cuestionario}</h2>
                </div>
                <div className='asignatura-inner-body row'>
                    <div className="col-9">
                        <p>Duracion: {this.state.duracion} minutos</p>
                        <p>Fecha de apertura: {this.state.fecha_apertura}</p>
                        <p>Fecha de cierre: {this.state.fecha_cierre}</p>
                        {this.state.corregido && <p>Calificación: {this.state.calificacion}</p>}
                        
                    </div>
                   <div className="col-3 button-section">
                        {(this.state.downloaded && !this.state.corregido) && <button className="btn btn-primary login-button" onClick={() => this.props.empezarTest(this.props.idCuestionario)}>Realizar</button>}
                        {!this.state.downloaded && <button className="btn btn-success login-button" onClick={() => this.getTest(this.props.idCuestionario)}>Descargar test</button>}
                        {this.state.corregido && <button className="btn btn-primary login-button" >Revisar</button>}
                    </div>
                </div>                        
            </div>                
        );
      }
}

export default TarjetaCuestionario;