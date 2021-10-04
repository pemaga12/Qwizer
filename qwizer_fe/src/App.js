import logo from './logo.svg';
import './App.css';
import React from 'react';
import CryptoJS from 'crypto-js'

import {BrowserRouter as Router,Route,Link,Redirect,Switch} from 'react-router-dom';



class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      contra:"",
      questionList:[],
      allow:false
    };
    
    this.getTest = this.getTest.bind(this);
    this.cifrarTest = this.cifrarTest.bind(this);
    this.descifrarTest = this.descifrarTest.bind(this);
    this.comprobarPassword = this.comprobarPassword.bind(this);
    this.getPass = this.getPass.bind(this);
    
  };

  cifrarTest(data){
    var cifradas =  CryptoJS.AES.encrypt(JSON.stringify(data),"m09sb4uXbs02W");
    localStorage.setItem('questions',cifradas.toString());
  }

  componentWillMount(){
    this.getTest();
  }

  getTest = () => {
    fetch('http://127.0.0.1:8000/api/test')
    .then(function(response){return response.json();})
    .then(data => {
      this.setState({
        password: data.password
      });
      this.cifrarTest(data);
    })
  }

  
  descifrarTest = () => {
    var cifradas = localStorage.getItem('questions');
    var descifradas = CryptoJS.AES.decrypt(cifradas,"m09sb4uXbs02W");
    descifradas = JSON.parse(descifradas.toString(CryptoJS.enc.Utf8));
    this.setState({
      questionList: descifradas.questions,
      allow:true
    });
    

  }
  
  comprobarPassword = () => {

    if(this.state.contra != ""){
      
      if(this.state.contra == this.state.password){
        this.descifrarTest();
        
      }else{
        alert("Wrong Password");
      }

      
    }
    
  }

  getPass = event => {
    this.setState({contra: event.target.value});
  }

  renderLink = () =>{
    if(this.state.allow){
      return <p><Link to="/test">Test</Link></p>
    }
  }

  render(){
    
    return <div>
    <Router>
    <Switch>
      <Route exact path="/" render={() => {
        return <div>
            <h1> Bienvenido! </h1>
            <input type="text" onChange={this.getPass}></input>
            <button onClick={this.comprobarPassword}>Empezar Test</button>
            {this.renderLink()}
          </div>
      }}>
      </Route>
      
      <Route exact path="/test" render={() => {
        return <div>
                <h1> El Test ha empezado! </h1>
                <div id="questions">
                    {this.state.questionList.map(function(pregunta,indx){
                        return (
                          <div key={pregunta.id}>
                              <h2>{indx+1}.- {pregunta.question}</h2>
                              
                              <table><tbody>{pregunta.options.map(function(option,indx){
                                return <tr><td>
                                  <input type="radio" id={""+pregunta.id + indx} name="opciones" 
                                  value={indx}></input>
                                  <label htmlFor={""+pregunta.id + indx}>{indx+1}.- {option}</label>
                                </td></tr>
                              })}
                              </tbody></table>
                          </div>
                        )
                    }
                    )}
                </div>
        </div>
      }}>
      </Route>
    </Switch>
    </Router>
    </div>
  }
  
}

export default App;
