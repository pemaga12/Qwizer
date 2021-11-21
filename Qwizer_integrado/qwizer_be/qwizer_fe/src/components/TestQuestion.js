import React  from 'react'



class TestQuestion extends React.Component {

    constructor(props){
        super(props);

        this.handleOnClick = this.handleOnClick.bind(this);
    }
    

    handleOnClick(event) {
        var id = this.props.id;

        var answer = {
           "id": id, "respuesta" : {"type" : this.props.type, "answer" : event.target.value}
        }
        
        this.props.addAnswerd(answer);
    }


    render() { 
        const preguntaId = this.props.id; 
        const onclick = this.props.handleOnClick;

        if(this.props.options){
            return(
            
                <table onChange={this.handleOnClick}>
                    <tbody>
                        {this.props.options.map(function(option,indx){
                         return (<tr key={option.id}><td>
                                     <input type="radio"  id={option.id} name={"opciones" + preguntaId} 
                                     value={option.id}></input>
                                     <label htmlFor={option.id}>{indx+1}.- {option.op}</label>
                                 </td></tr>);
                         })}            
                     </tbody>
                 </table>
                 
             );
        }
        
        return null;
      }
}

export default TestQuestion;