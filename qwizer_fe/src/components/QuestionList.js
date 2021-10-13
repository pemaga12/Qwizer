import React, { Component } from 'react'


import Question from './Question.js'

class QuestionList extends React.Component {
    
    render() {  

        console.log(this.props.questionList);
        return(
          <div id="questions">
            {this.props.questionList.map(function(pregunta,indx){
                  return (
                      <div key={pregunta.id}>
                        <Question question={pregunta.question} options={pregunta.options} id={indx}/>
                      </div>
                  )
              }
              )}
          </div>
        );
      }
}

export default QuestionList;