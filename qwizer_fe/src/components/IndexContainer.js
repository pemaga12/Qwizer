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
        const conexion = navigator.onLine;

        if (!conexion){
            return (<div className="index-body">
                    <div className='pt-5 ml-1 mr-1'>
                        <div className='d-flex justify-content-center'>
                            <span align='center ' className="material-icons xxl-icon justify-content-center"> wifi_off </span>
                        </div>
                        <div className='d-flex justify-content-center text-center'>
                            <h4>Actualmente no dispones de conexión a internet</h4>
                        </div>  
                        <div className='d-flex justify-content-center text-center'>
                            <p>Haz uso de la pestaña offline</p>
                        </div> 
                    </div>                                        
                </div>)
        }else if(empezarTest && this.props.asignaturas){
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