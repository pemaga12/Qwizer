import React from 'react'
import TarjetaAsignatura from './TarjetaAsignatura';



class IndexContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        
        const empezarTest = this.props.empezarTest;
        const idAsignaturas = this.props.idAsignaturas;
        const getCuestionarios = this.props.getCuestionarios;
        if(empezarTest){
            return(
                <div className="index-body">
                    { this.props.asignaturas.map(function(asignatura,indx){
                      return (
                          <div key={asignatura}>
                            <TarjetaAsignatura startTest={empezarTest} asignatura={asignatura} idAsignatura={idAsignaturas[indx]} getCuestionarios={getCuestionarios}></TarjetaAsignatura>
                          </div>
                      )
                    })
                    }   
                </div>
             );
        }else{
            return <h1>Loading...</h1>
        }
        
      }
}

export default IndexContainer;