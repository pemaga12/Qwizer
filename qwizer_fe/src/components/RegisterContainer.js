import React from 'react'
import DataTable from 'react-data-table-component';
import ErrorModal from './common/modals/ErrorModal';
import SuccessModal from './common/modals/SuccessModal';


class RegisterContainer extends React.Component {
    
  constructor(props){
    super(props);
    this.state = {
      asignaturas: undefined,
      alumnos: undefined,
      columns: undefined,
      data: undefined,
      title: undefined,
      alumnosSeleccionados: undefined,
      message: undefined
    };
    this.getAsignaturas = this.getAsignaturas.bind(this);
    this.getAlumnos = this.getAlumnos.bind(this);
    this.generar_tabla = this.generar_tabla.bind(this);
    this.registrarAlumnos = this.registrarAlumnos.bind(this);
    this.handleChange = this.handleChange.bind(this);
  };

  componentWillMount(){
    this.getAsignaturas();
    this.getAlumnos();
  }

  getAsignaturas = () => { 
    this.props.getSubjects().then(data => {
      this.setState({
        asignaturas: data.asignaturas,
      });
      this.state.asignaturas.map(function(asignatura,indx){
        window.$("#subject-selector").append(new Option(asignatura.nombre, asignatura.id));
      }); 
    });
  }
  
  getAlumnos = () => { 
    this.props.getStudents().then(data => {
      //console.log(data)
      this.setState({
        alumnos: data.alumnos,
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
        name: 'Nombre',
        selector: row => row.nombre,
        sortable: true,
      },
      {
        name: 'Apellidos',
        selector: row => row.apellidos,
        sortable: true
      }
    ];
    
    var data = [];
    this.state.alumnos.map(function(alumno,indx){
      let row = {
        id : alumno.id,
        nombre : alumno.nombre,
        apellidos : alumno.apellidos
      }
      data.push(row);
    });

      
    this.setState({
      columns: columns,
      data: data,
      title: "Alumnos matriculados en el centro" 
    });
  }

  registrarAlumnos = () => {
    var alumnos = this.state.alumnosSeleccionados;
    
    var asignatura = window.$("#subject-selector").val();
    

    if(asignatura == "Selecciona una asignatura" || alumnos == undefined || alumnos.length == 0){
      this.setState({
        message: "Selecciona una asignatura y al menos un alumno"
      })
      window.$("#inserted_error").modal("show");
    }
    else{
      
      const alumn_info = new Map([["alumnos", alumnos], ["asignatura", asignatura]]);
      const jsonObject = JSON.stringify(Object.fromEntries(alumn_info));
      var url = "http://127.0.0.1:8000/api/enroll-students";
      var token = localStorage.getItem('token');
      

      fetch(url, {
        method: 'POST',
        headers:{
            'Content-type': 'application/json',
            'Authorization': token
        },
        body: jsonObject
        })
        .then(response => response.json())
        .then(data => {
          
          if(data.insertados){
            this.setState({
              message: "Los alumnos han sido matriculados correctamente."
            })
            window.$("#inserted_success").modal("show");
          }
          else{
            var errormsg = "Los siguientes alumnos no se han podido matricular: \n"
            
            data.errors.map(function(error,indx){
              
              errormsg += error + "\n";
            });
                       
            this.setState({
              message: errormsg
            })
            window.$("#inserted_error").modal("show");
          }
        })
        .catch(error => console.log(error));
    }

  }

  handleChange = ({ selectedRows }) => {
    this.setState({
      alumnosSeleccionados: selectedRows
    })
  }

  

  render() { 
    
    const navigate = this.navigateQuestion;
    return(
            <div className="index-body">
              <div className="card tabla-notas">
                <div className='card-content'>
                  <h4 className='d-flex justify-content-center'>Registro de alumnos en asignaturas</h4>
                  <label>Selecciona la asignatura a la que quieras añadir a los alumnos</label>
                  <select className="form-select" id="subject-selector" aria-label="Default select example">
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
                    >
                  </DataTable>
                  <div className='d-flex justify-content-center'>
                    <button className='btn btn-primary' onClick={this.registrarAlumnos}>Registrar alumnos</button>
                  </div>
                </div>
              </div>
              <ErrorModal id={"inserted_error"} message={this.state.message}></ErrorModal>
              <SuccessModal id={"inserted_success"} message={this.state.message}></SuccessModal>
            </div>
        );
 
  }

}

export default RegisterContainer;