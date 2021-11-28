import React from 'react'



class TarjetaAsignatura extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {  
        return(
            <div className="card-container">
                <div className="card">
                    <div className="card-content row">
                        <div className="col-9">
                            <h3>{this.props.asignatura}</h3>
                            <p>Numero de test: 3</p>
                            <p>Numero de tests corregidos: 2</p>
                            <p>Numero de tests pendientes 1</p>
                        </div>
                        <div className="col-3 button-section">
                            <button className="btn btn-primary login-button">Ver mas</button>
                        </div>
                    </div>
                </div>
            </div>
         );
      }
}

export default TarjetaAsignatura;