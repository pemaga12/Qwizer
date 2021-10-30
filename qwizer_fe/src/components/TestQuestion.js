import React  from 'react'



class TestQuestion extends React.Component {

    constructor(props){
        super(props);
    }

    render() { 
        const preguntaId = this.props.id; 
        if(this.props.options){
            return(
            
                <table>
                    <tbody>
                        {this.props.options.map(function(option,indx){
                         return (<tr key={option.id}><td>
                                     <input type="radio"  id={option.id} name={"opciones" + preguntaId} 
                                     value={indx}></input>
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