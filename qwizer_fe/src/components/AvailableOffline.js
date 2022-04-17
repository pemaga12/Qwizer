import React from 'react'
import TarjetaCuestionario from './TarjetaCuestionario';



class AvailableOffline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cuestionarios:undefined,
        }
    }

    componentDidMount(){
        
        var tests = localStorage.getItem("tests");
        if(tests != null){
            var cuestionariosList = []
            var cuestionarios = JSON.parse(tests);
            for (const cuestionario of cuestionarios) { 
                var test = JSON.parse(cuestionario)
                cuestionariosList.push(test)
            }
            this.setState({cuestionarios:cuestionariosList})
        }
        
            
    }

    render() {

        const empezarTest = this.props.empezarTest;
        const rol = localStorage.getItem("rol");
        
        if(empezarTest && this.state.cuestionarios != undefined){
            return(
                <div className="index-body row">
                    
                        <div className='section-title'><h1>Cuestionarios Descargados</h1></div>  
                        { this.state.cuestionarios.map(function(cuestionario,indx){
                            return (
                                <div className='d-flex justify-content-center'>
                                    <TarjetaCuestionario offline={true} cuestionario={cuestionario} idCuestionario={cuestionario.id} empezarTest={empezarTest} rol={rol}></TarjetaCuestionario>
                                </div>
                            )
                        })
                        }
                                       
                </div>
             );
        }else{
            return <div className='section-title'>
                    <h1>Cuestionarios Descargados</h1> 
                    <div className='text-center'>
                        <h4>No tienes descargado ningun Test</h4>
                    </div>           
            </div>
        }
      }
}

export default AvailableOffline;