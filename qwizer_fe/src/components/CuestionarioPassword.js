import React from 'react'
import ErrorModal from './common/modals/ErrorModal';



class CuestionarioPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "Contraseña incorrecta!"
          };
    }

    componentDidMount(){
       
    }

    render() {
        return(
            <div class="index-body ">
                    <div className="card tabla-notas">
                        <div className='card-content'>
                            <div class="col">
                                <h3>Introduce la contraseña para empezar el examen!</h3>
                            </div>
                        
                            <div class="p-4 row">
                                <div class="col">
                                    <input type="text" className="center form-control" onChange={this.props.getPass}></input>
                                </div>
                            </div>
                            <div class="p-4 row">
                                <div class="col">
                                    <button type="button" class="btn btn-success" onClick={this.props.unlockTest}>Empezar Test</button>
                                </div>
                            </div>
                            </div>
                            <ErrorModal id={"unlock_error"} message={this.state.message}></ErrorModal>
                        </div>
                </div>  
            );
      }
}

export default CuestionarioPassword;