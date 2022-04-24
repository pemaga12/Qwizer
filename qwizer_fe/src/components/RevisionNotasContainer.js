import { data } from 'jquery';
import React from 'react'
import DataTable from 'react-data-table-component';

const paginationComponentOptions = {
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
  selectAllRowsItemText: 'Todos',
};

class RevisionNotasContainer extends React.Component {
    
  constructor(props){
    super(props);
    this.state ={
      notasCuestionario: undefined,
      columns: undefined,
      data: undefined
    }
    this.getNotas = this.getNotas.bind(this);
    this.generar_tabla = this.generar_tabla.bind(this);
  }

  componentDidMount(){
    this.getNotas();
  }

  getNotas = () => {   
    var token = localStorage.getItem('token');
    const message = new Map([["idCuestionario", this.props.currentCuestionario]]);
    
    const jsonObject = JSON.stringify(Object.fromEntries(message));
    fetch('http://127.0.0.1:8000/api/get-notas-de-test', {
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
        notasCuestionario: data.notas,
      });
      this.generar_tabla();
    })
    .catch(error => console.log(error));
  }

  generar_tabla = () => {
    
    var columns = [
      {
          name: '#',
          selector: row => row.numero,
          sortable: true
      },
      {
          name: 'id',
          selector: row => row.id,
          sortable: true,
          omit: true
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
      },
      {
        name: 'Nota',
        selector: row => row.nota,
        conditionalCellStyles: [
          {
            when: row => row.nota > 6,
            style: {
              backgroundColor: 'rgba(63, 195, 128, 0.9)',
              color: 'white',
            },
          },
          {
            when: row => row.nota >= 5 && row.nota <= 6,
            style: {
              backgroundColor: 'rgba(248, 148, 6, 0.9)',
              color: 'white',
            },
          },
          {
            when: row => row.nota < 5 || row.nota == "No presentado",
            style: {
              backgroundColor: '#963d46',
              color: 'white',
            },
          }
        ]
      },
      {
        cell:(row) => <button className='btn btn-primary' id={row.id} onClick={() => this.props.revisionTestProfesor(this.props.currentCuestionario, row.id)}>Revisar</button>,
        ignoreRowClick: true,
        allowOverflow: true,
      },
    ];
    
    var data = [];
    this.state.notasCuestionario.map(function(nota,indx){
      let row = {
        numero : indx,
        id : nota.id,
        nombre : nota.nombre,
        apellidos : nota.apellidos,
        nota : nota.nota,
      }
      data.push(row);
    });

      
    this.setState({
      columns: columns,
      data: data,
      title: "Revisión de las notas del cuestionario " + this.props.currentCuestionario
    });
  }

  render() { 
    if(this.state.notasCuestionario && this.state.data){
      return(
            <div className='index-body'>
              <div className='card tabla-notas'>
                <DataTable
                  pointerOnHover
                  theme={"default"}	
                  title= {this.state.title}
                  columns={this.state.columns}
                  data={this.state.data}
                  pagination paginationComponentOptions={paginationComponentOptions}
                />
              </div>
            </div>
          );
        }
        else{
          return <div>LOADING</div>
        }

 
  }

}

export default RevisionNotasContainer;