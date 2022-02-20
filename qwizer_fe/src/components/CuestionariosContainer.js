import React from 'react'
import TarjetaCuestionario from './TarjetaCuestionario';
import SideBar from './SideBar';



class CuestionariosContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const idCuestionarios = this.props.idCuestionarios;
        const cuestionarios = this.props.cuestionarios;
        const empezarTest = this.props.empezarTest;
        const asignatura = this.props.asignatura;
        if(empezarTest){
            return(
                <div className="index-body row">
                    
                        <div className='section-title'><h1>{asignatura}</h1></div>  
                        { this.props.cuestionarios.map(function(cuestionario,indx){
                            return (
                                <div className='d-flex justify-content-center'>
                                    <TarjetaCuestionario cuestionario={cuestionario} idCuestionario={idCuestionarios[indx]} empezarTest={empezarTest}></TarjetaCuestionario>
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