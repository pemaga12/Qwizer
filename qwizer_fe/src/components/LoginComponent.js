import React from 'react'


class LoginComponent extends React.Component {
    
  constructor(props){
    super(props);
    this.state = {
      currentPass:"",
      currentUser:"",
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }

  handleUsernameChange(event){
    this.setState({
      currentUser: event.target.value,
    });
  }


  handlePasswordChange(event){
    this.setState({
      currentPass: event.target.value,
    });
  }


  handleSubmit(event) {
    event.preventDefault();
  }
  
  render() { 
    return(
        <div className="main-container login-body">
        <form onSubmit={this.handleSubmit}>
          <div className="form-inputs">
            <h2 className="title">Qwizer</h2>
            <p></p>
            <br/>
            <h5>Nombre de usuario</h5>
            <input className="form-control" id="username" placeholder="Nombre de usuario" onChange={this.handleUsernameChange}></input>
            <p></p>
            <h5>Contraseña</h5>
            <input type="password" className="form-control" id="password" placeholder="Contraseña" onChange={this.handlePasswordChange}></input>
          </div>
          <p></p>
          <div className="buttons">
            <button className="btn btn-primary login-button" type="submit" onClick={() => this.props.login(this.state.currentUser, this.state.currentPass)}>login</button>
            <p></p>
            <a onClick={this.restorePassword}>¿Has olvidado la contraseña?</a>
          </div>
        </form>
      </div>
    );
 
  }

}

export default LoginComponent;