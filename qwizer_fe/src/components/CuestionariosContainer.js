import React from 'react'
import TarjetaCuestionario from './TarjetaCuestionario';
import SideBar from './SideBar';



class CuestionariosContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const idCuestionarios = this.props.idCuestionarios;
        const empezarTest = this.props.empezarTest;
        const asignatura = this.props.asignatura;
        const revisarTest = this.props.revisionTest;
        const rol = this.props.rol;
        const revisarNotasTest = this.props.revisarNotasTest;
        const revisionTestProfesor = this.props.revisionTestProfesor;
        
        if(empezarTest){
            return(
                <div className="index-body row">
                    
                        <div className='section-title'><h1>{asignatura}</h1></div>  
                        { this.props.cuestionarios.map(function(cuestionario,indx){
                            return (
                                <div className='d-flex justify-content-center'>
                                    <TarjetaCuestionario offline={false} cuestionario={cuestionario} idCuestionario={idCuestionarios[indx]} empezarTest={empezarTest} revisionTest={revisarTest} rol={rol} revisarNotasTest={revisarNotasTest} revisionTestProfesor={revisionTestProfesor}></TarjetaCuestionario>
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

export default CuestionariosContainer;