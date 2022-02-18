import React from 'react'
import TarjetaCuestionario from './TarjetaCuestionario';



class CuestionariosContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const idCuestionarios = this.props.idCuestionarios;
        const cuestionarios = this.props.cuestionarios;
        const empezarTest = this.props.empezarTest;
        console.log(cuestionarios);
        if(empezarTest){
            return(
                <div className="index-body">
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