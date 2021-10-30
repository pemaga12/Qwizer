import React from 'react'


import TestQuestion from './TestQuestion.js'
import TextQuestion from './TextQuestion.js'



class QuestionList extends React.Component {
    
  constructor(props){
    super(props);
    this.questionType = this.questionType.bind(this);
  }

  questionType = (pregunta) => {

    if(pregunta != null){

      if(pregunta.type == 'test'){
        return  <TestQuestion key={pregunta.id} question={pregunta.question} options={pregunta.options} id={pregunta.id}/>
      } // else type = 'text'

      return <TextQuestion key={pregunta.id} question={pregunta.question} id={pregunta.id}/>
    }
  
  }

  render() {  
      const renderQtype = this.questionType
      return(
        <div id="questions">
          {this.props.questionList.map(function(pregunta,indx){
                return (
                    <div key={pregunta.id}>
                      <h2> {indx + 1}.- {pregunta.question}</h2>
                      {renderQtype(pregunta)}
                    </div>
                );
            }
            )}
        </div>
      );
    }
}

export default QuestionList;