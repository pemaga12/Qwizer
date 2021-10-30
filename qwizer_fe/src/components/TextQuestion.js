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
        this.setState({textValue: event.target.value});
    }

    render() {  
        return(
            <div>
                <textarea rows="9" cols="70" name="textValue" onChange={this.handleChange} />
            </div>
         );
      }
}

export default TextQuestion;