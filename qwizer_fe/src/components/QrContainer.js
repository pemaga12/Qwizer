import React from 'react'
import QRCode from "react-qr-code";



class QrContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
        this.generateUrl = this.generateUrl.bind(this);
    }

    componentWillMount(){
        this.generateUrl()  
    }

    generateUrl = () => { 
        var url = "http://localhost:3000/scanner/" + this.props.userId + "/" + this.props.currentTest + "/" + this.props.generatedHash;
        this.setState({
            qUrl: url
        });
        console.log(this.state.qUrl);
    }

    render() {
            return(
                <div className='index-body'>
                    <div className='d-flex justify-content-center mt-3'>
                        <h4>Actualmente te encuentras sin conexión a internet</h4>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <p>Se ha generado un código QR para que se lo muestres al profesor</p>
                    </div>
                    <div className='d-flex justify-content-center mt-4'>
                        <QRCode value={this.state.qUrl}/>
                    </div>
                </div>
             );
        
      }
}

export default QrContainer;