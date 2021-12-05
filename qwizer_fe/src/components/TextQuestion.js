import React from 'react'



class TextQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          textValue: ""
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        var id = this.props.id;

        var answer = {
           "id": id, "respuesta" : {"type" : this.props.type, "answer" : event.target.value}
        }
        
        this.props.addAnswerd(answer);

    }

    render() {  
        return(
            <div class="p-4 m-2 text-center">
                <textarea rows="9" cols="70" name="textValue" onChange={this.handleChange} />
            </div>
         );
      }
}

export default TextQuestion;