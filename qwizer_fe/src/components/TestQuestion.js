import React  from 'react'



class TestQuestion extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedOp:null
        };
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    // this.props.mode puede tomar los siguientes valores: test, revision, visualize

    componentDidMount(){

        if(!this.props.mode === "test"){
            var answers = localStorage.getItem('answers');
            if (answers !== null){
                var json_answers = JSON.parse(answers);
                var opcion = "NULL"
                var listaRespuestas = json_answers.respuestas
                
                listaRespuestas.map( respuesta => {
                    
                    if(respuesta.id === this.props.id){
                        opcion = respuesta.answr
                    }
                })
                
                if (opcion !== "NULL") {
                    opcion = Number(opcion)
                    this.setState({
                        selectedOp:opcion,
                    });
                }
                
            }
        }
        
    }

    handleOnClick(event) {

        var answer = {
           "id": this.props.id, "respuesta" : {"type" : this.props.type, "answer" : event.target.value}
        }

        this.setState({selectedOp:Number(event.target.value)});

        this.props.addAnswerd(answer);
    }

    testMode = () =>{
        const preguntaId = this.props.id; 
        const opcionSelec = this.state.selectedOp;
        const handle = this.handleOnClick
        return(
            <table class="m-4" >
                <tbody>
                    {this.props.options.map(function(option,indx){
                     return (<tr key={option.id}><td>
                                <input type="radio"  id={option.id} name={"opciones" + preguntaId} 
                                    value={option.id} onChange={handle} checked={opcionSelec === option.id}></input>
                                <label htmlFor={option.id}>{indx+1}.- {option.op}</label>
                             </td></tr>);
                     })}            
                 </tbody>
             </table>
             
         );
    }

    revisionMode = () =>{
        const preguntaId = this.props.id; 
        const questionData = this.props.infoPreg;
            
        return(
            <div>
                <table class="m-4 bg-secondary rounded" >
                    <tbody>
                        {questionData.options.map(function(option,indx){
                        return (<tr key={option.id}><td>
                                    <input type="radio"  id={option.id} name={"opciones" + preguntaId} 
                                        value={option.id} checked={questionData.user_op === option.id}></input>
                                    <label htmlFor={option.id}>{indx+1}.- {option.op}</label>
                                </td></tr>);
                        })}            
                    </tbody>
                </table>
                <div className='bg-warning rounded-pill'>
                Respuesta Correcta: {questionData.options.map(function(option,indx){
                    return questionData.correct_op === option.id && questionData.options[indx].op 
                })}
                </div>
            </div>
            );
    }

    visualizeMode = () =>{
        const preguntaId = this.props.id; 
        const questionData = this.props.infoPreg;

        return(
            <div>
                <h2 className='p-4 m-2 text-center' >{questionData.question}</h2>
                <table class="p-4 m-2 bg-light rounded" >
                    <tbody>
                        {questionData.options.map(function(option,indx){
                        return (<tr key={option.id}><td>
                                    <input type="radio"  id={option.id} name={"opciones" + preguntaId} 
                                        value={option.id} checked={questionData.correct_op === option.id}></input>
                                    <label htmlFor={option.id}>{indx+1}.- {questionData.correct_op === option.id ?
                                                                                                 option.op + " (Correcta)":
                                                                                                 option.op}</label>
                                </td></tr>);
                        })}            
                    </tbody>
                </table>
            </div>
         );
    }

    render() { 

        if(this.props.mode==="test" && this.props.options){ return this.testMode();}
        else if (this.props.mode==="revision" && this.props.infoPreg){return this.revisionMode();}
        else if (this.props.mode==="visualize" && this.props.infoPreg){return this.visualizeMode();}
    }
}

export default TestQuestion;