import React from 'react'
import $ from 'jquery'; 
import ErrorModal from './common/modals/ErrorModal';

class TarjetaCuestionario extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            duracion: 0,
            downloaded: false,
            calificacion: 0,
            corregido: false,
            fecha_apertura: "",
            fecha_cierre: "",
            bloqueado: false,
            fecha_apertura_formateada: "",
            fecha_cierre_formateada: "",
        };
       
        
        this.get_info = this.get_info.bind(this);
        this.getTest = this.getTest.bind(this);
        this.comprobar_fecha = this.comprobar_fecha.bind(this);
        this.show_modal = this.show_modal.bind(this);

        this.testIsDownloaded = this.testIsDownloaded.bind(this);
        this.addTestToLocalStorage = this.addTestToLocalStorage.bind(this);
    }

    
    componentDidMount(){
        if(!this.props.offline){
            this.get_info();
        } 
        this.testIsDownloaded();
    }

    //////////////////////////////////////////////////////
    testIsDownloaded = () => {
        var tests = localStorage.getItem("tests");
        if(tests != null){
            var cuestionariosList = JSON.parse(tests);
            for (const cuestionario of cuestionariosList) { 
                var test = JSON.parse(cuestionario)
                if(test.id == this.props.idCuestionario){
                    if(this.props.offline){
                        this.setState({
                            cuestionario: test,
                            downloaded: true,
                            duracion: test.duracion,
                            corregido: false,
                            fecha_apertura_formateada: test.formatted_fecha_apertura,
                            fecha_cierre_formateada: test.formatted_fecha_cierre,
                            fecha_apertura: test.fecha_apertura,
                            fecha_cierre: test.fecha_cierre
                        });
                    }else{
                        this.setState({
                            cuestionario: test,
                            downloaded: true
                        });
                    }
                    
                    break;
                }
            }
        }

        
    }

    addTestToLocalStorage = (jsonObject) => {
        var tests = localStorage.getItem("tests");
        if(tests == null){
            var testList = [jsonObject]
            localStorage.setItem('tests', JSON.stringify(testList));
        }else{
            var cuestionariosList = JSON.parse(tests);
            cuestionariosList.push(jsonObject);
            localStorage.setItem("tests",JSON.stringify(cuestionariosList));
        } 
    }
    /////////////////////////////////////////////////////////////

    getTest = (idCuestionario) => {
        var url = 'http://127.0.0.1:8000/api/test';
        var token = localStorage.getItem('token');

        const data = new Map([["idCuestionario", idCuestionario]]);
        const obj = JSON.stringify(Object.fromEntries(data));
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
            this.addTestToLocalStorage(jsonObject)
            
        });
        
      }

    get_info = () => {

        var token = localStorage.getItem('token');
        const message = new Map([["idCuestionario", this.props.idCuestionario]]);
        const jsonObject = JSON.stringify(Object.fromEntries(message));
        fetch('http://127.0.0.1:8000/api/get-quiz-info', {
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
                fecha_apertura_formateada: data.formattedFechaApertura,
                fecha_cierre_formateada: data.formattedFechaCierre,
                fecha_apertura: data.FechaApertura,
                fecha_cierre: data.FechaCierre
            });

            this.comprobar_fecha();

            if(this.state.calificacion >= 5 && corregido){
                var idCuestionario = "#cuestionario_" + this.props.idCuestionario;
                $(idCuestionario).css("background-color", "#59ac79");
            }
            else if(this.state.calificacion < 5 && corregido){
                var idCuestionario = "#cuestionario_" + this.props.idCuestionario;
                $(idCuestionario).css("background-color", "#9c2400");
            }            
        })
        .catch(error =>{
            
        });
    }

    comprobar_fecha = () => {
        const fechaApertura = new Date(this.state.fecha_apertura);
        const fechaCierre = new Date(this.state.fecha_cierre);
        var today = Date.now();

        today = new Date(today);

        if(fechaApertura > today || today > fechaCierre){
            this.setState({
                bloqueado: true
            });
        }
    }

    show_modal = () => {
        const id = "#fecha_" + this.props.idCuestionario;
        window.$(id).modal('show');
    }


    render() { 
        
        if(this.props.offline == true){

            return(
                <div className="card asignatura-section " name={this.props.cuestionario.title} id={this.props.idCuestionario}>
                    <div id={"cuestionario_" + this.props.idCuestionario} className="header bg-blue-grey">
                        <h2>{this.props.cuestionario.title}</h2>
                    </div>
                    <div className='asignatura-inner-body row'>
                        <div className="col-9">               
                            <p>Duración: {this.state.duracion} minutos</p>
                            <p>Fecha de apertura: {this.state.fecha_apertura_formateada}</p>
                            <p>Fecha de cierre: {this.state.fecha_cierre_formateada}</p>
                        </div>
                       <div className="col-3 button-section">
                            {(this.state.downloaded && !this.state.corregido && !this.state.bloqueado && localStorage.getItem("rol") == "student") && <button className="btn btn-primary login-button" onClick={() => this.props.empezarTest(this.props.idCuestionario,this.state.duracion)}>Realizar</button>}
                            {(this.state.downloaded && !this.state.corregido && this.state.bloqueado && localStorage.getItem("rol") == "student") && <button type="button" className="btn btn-primary" data-toggle="modal" onClick={this.show_modal}>Realizar</button>}
                            {this.state.downloaded && localStorage.getItem("rol") == "teacher" && <button className="btn btn-primary login-button" onClick={() => this.props.empezarTest(this.props.idCuestionario,this.state.duracion)}>Realizar</button>}  
                        </div>
                        <ErrorModal id={"fecha_" + this.props.idCuestionario} message={["El test solo se puede resolver entre las siguientes fechas:", <br/> , this.state.fecha_apertura_formateada, <br/> ,this.state.fecha_cierre_formateada]}></ErrorModal>
                    </div>                        
                </div>                
            );
            
        }else{
            return(
                <div className="card asignatura-section " name={this.props.cuestionario} id={this.props.idCuestionario}>
                    <div id={"cuestionario_" + this.props.idCuestionario} className="header bg-blue-grey">
                        <h2>{this.props.cuestionario}</h2>{this.state.corregido && <h5>Calificación: {this.state.calificacion}</h5>}
                    </div>
                    <div className='asignatura-inner-body row'>
                        <div className="col-9">
                            
                            <p>Duración: {this.state.duracion} minutos</p>
                            <p>Fecha de apertura: {this.state.fecha_apertura_formateada}</p>
                            <p>Fecha de cierre: {this.state.fecha_cierre_formateada}</p>
                            
                            
                        </div>
                       <div className="col-3 button-section">
                            {(this.state.downloaded && !this.state.corregido && !this.state.bloqueado && localStorage.getItem("rol") == "student") && <button className="btn btn-primary login-button" onClick={() => this.props.empezarTest(this.props.idCuestionario,this.state.duracion)}>Realizar</button>}
                            {!this.state.downloaded && !this.state.corregido &&<button className="btn btn-success login-button" onClick={() => this.getTest(this.props.idCuestionario)}>Descargar test</button>}
                            {(this.state.downloaded && !this.state.corregido && this.state.bloqueado && localStorage.getItem("rol") == "student") && <button type="button" className="btn btn-primary" data-toggle="modal" onClick={this.show_modal}>Realizar</button>}
                            {this.state.corregido && localStorage.getItem("rol") == "student" && <button className="btn btn-primary login-button" onClick={() => this.props.revisionTest(this.props.idCuestionario)}>Revisar</button>}
                            {this.state.downloaded && localStorage.getItem("rol") == "teacher" && <button className="btn btn-primary login-button" onClick={() => this.props.empezarTest(this.props.idCuestionario,this.state.duracion)}>Realizar</button>}
                            {localStorage.getItem("rol") == "teacher" && <button className="btn btn-primary login-button" onClick={() => this.props.revisarNotasTest(this.props.idCuestionario)}>Revisar</button>}
                            
                        </div>
                        <ErrorModal id={"fecha_" + this.props.idCuestionario} message={["El test solo se puede resolver entre las siguientes fechas:", <br/> , this.state.fecha_apertura_formateada, <br/> ,this.state.fecha_cierre_formateada]}></ErrorModal>
                    </div>                        
                </div>                
            );
        }
        
    }
}

export default TarjetaCuestionario;