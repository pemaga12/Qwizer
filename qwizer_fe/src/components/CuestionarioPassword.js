import React from 'react'




class CuestionarioPassword extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount(){
       
    }

    render() {
        return(
            <div class="index-body row align-items-center">
                    <div className="card margin-password">
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
            );
      }
}

export default CuestionarioPassword;