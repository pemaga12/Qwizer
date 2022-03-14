import React from 'react'
import TarjetaAsignatura from './TarjetaAsignatura';



class IndexContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.getAsignaturas();
    }

    render() {
        
        const empezarTest = this.props.empezarTest;
        const getCuestionarios = this.props.getCuestionarios;

        if(empezarTest && this.props.asignaturas){
            return(
                <div className="index-body">
                    { this.props.asignaturas.map(function(asignatura,indx){
                      return (
                        <div key={indx} className='d-flex justify-content-center'>
                            <TarjetaAsignatura asignatura={asignatura.nombre} idAsignatura={asignatura.id} getCuestionarios={getCuestionarios}></TarjetaAsignatura>
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