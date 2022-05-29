import React from 'react'
import ErrorModal from './common/modals/ErrorModal';
import SuccessModal from './common/modals/SuccessModal';


class InsercionManual extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
        this.guardarDatos = this.guardarDatos.bind(this);
    }

    componentWillMount(){
        this.guardarDatos()  
    }

    guardarDatos = () => { 
        var token = localStorage.getItem('token');
        var url = "http://127.0.0.1:8000/api/insert-qr";
        const message = new Map([["idUsuario", this.props.userId], ["idCuestionario", this.props.cuestionario], ["hash", this.props.generatedHash]]); 
        const obj = JSON.stringify(Object.fromEntries(message));

        
        fetch(url, {
            method: 'POST',
            headers:{
            'Content-type': 'application/json',
            'Authorization': token
            },
            body: obj
        }).then(response => response.json()).then(data => {
            this.setState({
                file: "",
                message: data.message
            });
            if(!data.inserted){
                window.$("#inserted_error").modal('show');
            } 
            else{
                window.$("#inserted_success").modal('show');
            } 
                     
        }).catch(error => console.log(error));
    }

    render() {
            return(
                <div className='index-body'>
                    <div className='d-flex justify-content-center mt-4'>
                        <h4>Escaneado de códigos QR</h4>
                    </div>
                    <ErrorModal id={"inserted_error"} message={this.state.message}></ErrorModal>
                    <SuccessModal id={"inserted_success"} message={this.state.message}></SuccessModal>
                </div>
             );
        
      }
}

export default InsercionManual;