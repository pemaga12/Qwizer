import React from 'react'



class TarjetaAsignatura extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nCuestionarios: 0
        };
       
        
        this.get_info = this.get_info.bind(this);
    }

    
  componentWillMount(){
    this.get_info();
   
  }


    get_info = () => {

        var token = localStorage.getItem('token');
        const message = new Map([["idAsignatura", this.props.idAsignatura]]);
        const jsonObject = JSON.stringify(Object.fromEntries(message));
        fetch('http://127.0.0.1:8000/api/get-info-asignatura', {
        method: 'POST',
        headers:{
            'Content-type': 'application/json',
            'Authorization': token
        },
        body: jsonObject
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                nCuestionarios: data.nCuestionarios
            });         
            })
        .catch(error => console.log(error));
    }

    render() { 
        
        //const startTest = this.props.startTest;
        return(
            <div className="card asignatura-section" name={this.props.asignatura} id={this.props.idAsignatura}>
                <div className="header bg-blue-grey">
                    <h2>{this.props.asignatura}</h2>
                </div>
                <div className='asignatura-inner-body row'>
                    <div className="col-9">
                        <p>Numero de test: {this.state.nCuestionarios}</p>
                        <p>Numero de tests corregidos: 2</p>
                        <p>Numero de tests pendientes 1</p>
                    </div>
                    <div className="col-3 button-section">
                        <button className="btn btn-primary login-button" onClick={() => this.props.getCuestionarios(this.props.idAsignatura)}>Ver mas</button>
                    </div>
                </div>                        
            </div>                
        );
      }
}

export default TarjetaAsignatura;