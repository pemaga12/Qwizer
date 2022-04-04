import React from 'react'



class TextQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          textValue: ""
        };

        this.handleChange = this.handleChange.bind(this);
    }
    // this.props.mode puede tomar los siguientes valores: test, revision, visualize

    componentDidMount(){
        if(this.props.mode === "test"){
            var answers = localStorage.getItem('answers');
            if (answers !== null){
                var json_answers = JSON.parse(answers);
                var rp = "NULL"
                var listaRespuestas = json_answers.respuestas
                
                listaRespuestas.map( respuesta => {
                    
                    if(respuesta.id === this.props.id){
                        rp = respuesta.answr
                    }
                })
                
                if (rp !== "NULL") {
                    this.setState({
                        textValue:rp,
                    });
                }
                
            }
        }
        
        
        
    }

    handleChange(event) {

        var answer = {
           "id": this.props.id, "respuesta" : {"type" : this.props.type, "answer" : event.target.value}
        }
        this.setState({textValue: event.target.value});
        
        this.props.addAnswerd(answer);
    }

    testMode = () =>{
        return(
            <div className="p-4 m-2 text-center">
                <textarea rows="9" cols="70" name="textValue" onChange={this.handleChange} value={this.state.textValue} />
            </div>
        );
    }

    revisionMode = () =>{
        return(
            <div className="p-4 m-2 text-center">
                <p className='bg-secondary rounded'>{this.props.infoPreg.user_op}</p>
                <div className='bg-warning rounded-pill'>
                     Respuesta Correcta: {this.props.infoPreg.correct_op}
                 </div>
            </div>
         );
    }

    visualizeMode = () =>{
        return(
            <div className="p-4 m-2 text-center">
                <h2>{this.props.infoPreg.question}</h2>
                <p className='p-4 m-2 bg-light rounded'>Respuesta : {this.props.infoPreg.correct_op}</p>
            </div>
         );
    }

    render() { 

        if(this.props.mode==="test"){ return this.testMode();}
        else if (this.props.mode==="revision" && this.props.infoPreg){return this.revisionMode();}
        else if (this.props.mode==="visualize" && this.props.infoPreg){return this.visualizeMode();}
        
    }
}

export default TextQuestion;