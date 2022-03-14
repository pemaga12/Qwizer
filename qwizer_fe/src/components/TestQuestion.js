import React  from 'react'



class TestQuestion extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedOp:null
        };
        this.handleOnClick = this.handleOnClick.bind(this);
    }
    
    componentDidMount(){

        if(!this.props.revision){
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
        var id = this.props.id;

        var answer = {
           "id": id, "respuesta" : {"type" : this.props.type, "answer" : event.target.value}
        }
        this.setState({
            selectedOp:event.target.value,
        });
        this.props.addAnswerd(answer);
    }


    render() { 
        const preguntaId = this.props.id; 
        //const onclick = this.props.handleOnClick;
        const opcionSelec = this.state.selectedOp;
        const handle = this.handleOnClick
        if(this.props.revision===false && this.props.options){
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
        }else{
            const questionData = this.props.infoPreg;
            
            return(
                <div>
                    <table class="m-4 bg-secondary rounded" >
                        <tbody>
                            {questionData.options.map(function(option,indx){
                            return (<tr key={option.id}><td>
                                        <input type="radio"  id={option.id} name={"opciones" + preguntaId} 
                                            value={option.id} onChange={handle} checked={questionData.user_op === option.id}></input>
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
        
        
    }
}

export default TestQuestion;