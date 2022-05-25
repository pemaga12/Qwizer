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
            <div class="container">
                {this.props.listaPreguntas.map(function(pregunta,indx){
                    return (
                        <button type="button" class="btn btn-outline-dark" key={indx} onClick={navigate} value={indx}>{"Pregunta "}{indx+1}</button>
                    );
                    })           

                }

            </div>
        );
 
  }

}

export default QuestionNav;