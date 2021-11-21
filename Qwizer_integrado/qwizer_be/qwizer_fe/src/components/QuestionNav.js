import React from 'react'


class QuestionNav extends React.Component {
    
  constructor(props){
    super(props);
    this.navigateQuestion = this.navigateQuestion.bind(this);
  }

  navigateQuestion = (e) =>{
    this.props.navigationHandler(parseInt(e.target.value));
  }
  
  render() { 
    
    const navigate = this.navigateQuestion;
    return(
            <div>
                {this.props.listaPreguntas.map(function(pregunta,indx){
                    return (
                        <button key={indx} onClick={navigate} value={indx}>{"Pegunta : "}{indx+1}</button>
                    );
                    })           

                }

            </div>
        );
 
  }

}

export default QuestionNav;