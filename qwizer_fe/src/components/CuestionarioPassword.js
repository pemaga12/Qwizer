import React from 'react'
import ErrorModal from './common/modals/ErrorModal';




class CuestionarioPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "Contraseña incorrecta"
          };
    }

    componentDidMount(){
       
    }

    render() {
        return(
            <div class="index-body">
                    <div className="card tabla-notas">
                        <div className='card-content'>
                            <div class="col text-center">
                                <h3>Introduce la contraseña para empezar el examen!</h3>
                            </div>
                        
                            <div class="p-4 row">
                                <div class="col text-center">
                                    <input type="text" className="center form-control" onChange={this.props.getPass}></input>
                                </div>
                            </div>
                            <div class="p-4 row">
                                <div class="col text-center">
                                    <button type="button" class="btn btn-success" onClick={this.props.unlockTest}>Empezar Test</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ErrorModal id={"password_error"} message={this.state.message}></ErrorModal>
                </div>  
            );
      }
}

export default CuestionarioPassword;