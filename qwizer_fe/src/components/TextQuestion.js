import React from 'react'



class TextQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          textValue: ""
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
        if(!this.props.revision){
            var answers = localStorage.getItem('answers');
            if (answers != null){
                var json_answers = JSON.parse(answers);
                var rp = "NULL"
                var listaRespuestas = json_answers.respuestas
                
                listaRespuestas.map( respuesta => {
                    
                    if(respuesta.id == this.props.id){
                        rp = respuesta.answr
                    }
                })
                
                if (rp != "NULL") {
                    this.setState({
                        textValue:rp,
                    });
                }
                
            }
        }
        
        
        
    }

    handleChange(event) {
        var id = this.props.id;

        var answer = {
           "id": id, "respuesta" : {"type" : this.props.type, "answer" : event.target.value}
        }
        this.setState({
            textValue: event.target.value,
        });
        
        this.props.addAnswerd(answer);

    }

    render() { 
        if(this.props.revision==false){
            return(
                <div class="p-4 m-2 text-center">
                    <textarea rows="9" cols="70" name="textValue" onChange={this.handleChange} value={this.state.textValue} />
                </div>
             );
        }else{
            return(
                <div class="p-4 m-2 text-center">
                    <p className='bg-secondary rounded'>{this.props.infoPreg.user_op}</p>
                    <div className='bg-warning rounded-pill'>
                         Respuesta Correcta: {this.props.infoPreg.correct_op}
                     </div>
                </div>
             );
        }
        
    }
}

export default TextQuestion;