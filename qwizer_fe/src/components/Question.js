import React, { Component } from 'react'



class Question extends React.Component {

    render() { 
        const preguntaId = this.props.id; 
        return(
            <div>
                {console.log("He entrado a question.js")}
                <h2> {this.props.id + 1}.- {this.props.question}</h2>
                
                <table><tbody>{this.props.options.map(function(option,indx, ){
                    return (<tr><td>
                    {console.log(preguntaId)}
                    <input type="radio" id={"" + preguntaId + indx} name={"opciones" + preguntaId} 
                    value={indx}></input>
                    <label htmlFor={"" + preguntaId + indx}>{indx+1}.- {option}</label>
                    </td></tr>
                    );
                })}            
                </tbody></table>
            </div>
        );
      }
}

export default Question;