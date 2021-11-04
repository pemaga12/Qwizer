import logo from './logo.svg';
import './App.css';
import React from 'react';
import CryptoJS from 'crypto-js'

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';


import QuestionContainer from './components/QuestionContainer.js'

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      contra:"",
      questionList:[],
      allow:false,
     /* answers:{
        'respuestas':[
          {
            'question_id': 1,
            'question_answr': 'answr_id' or 'blabla'
          }
        ]
      }*/
      answers:{
        'respuestas':[]
      }
    };
    
    this.getTest = this.getTest.bind(this);
    this.sendTest = this.sendTest.bind(this);
    
    this.descifrarTest = this.descifrarTest.bind(this);
    this.cifrarResultados = this.cifrarResultados.bind(this);
    this.pad_message = this.pad_message.bind(this);
    this.comprobarPassword = this.comprobarPassword.bind(this);
    this.getPass = this.getPass.bind(this);
    
  };

  componentWillMount(){
    this.getTest();
  }

  getTest = () => {
    fetch('http://127.0.0.1:8000/api/test')
    .then(function(response){return response.json();})
    .then(data => {
      this.setState({
        password: data.password,
        iv: data.iv
      });
      localStorage.setItem('questions', data.encrypted_message);
    })
  }

  sendTest = () => {
    var url = "http://127.0.0.1:8000/api/response";
    this.cifrarResultados();
    console.log(JSON.stringify(this.state.questionList));
    fetch(url, {
      method: 'POST',
      headers:{
        'Content-type': 'application/json',
      },
      body: JSON.stringify(this.state.questionList)
    }).catch(function(error){
      console.log("Error", error)
    })
  }
  
  
  cifrarResultados = () => {
    //Necesitamos cifrar mediante RSA, ya que no podemos usar la misma clave 
  }

  pad_message = () => {
    var len = this.state.questionList
  }

  descifrarTest = () => {
    var cifradas = localStorage.getItem('questions');
    
    var key = CryptoJS.enc.Hex.parse(this.state.password);
    var iv = CryptoJS.enc.Hex.parse(this.state.iv);
    var cipher = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Base64.parse(cifradas)
    });

    var result = CryptoJS.AES.decrypt(cipher, key, {iv: iv, mode: CryptoJS.mode.CFB});

    var text = result.toString(CryptoJS.enc.Utf8);

    text = JSON.parse(text);

    this.setState({
      questionList: text.questions,
      allow:true
    });
    console.log(this.state.questionList);
  }
  
  comprobarPassword = () => {

    if(this.state.contra != ""){
      if(CryptoJS.SHA256(this.state.contra) == this.state.password){
        this.descifrarTest();
        
      }else{
        alert("Wrong Password");
      }
    }
    
  }

  getPass = event => {
    this.setState({contra: event.target.value});
  }

  render(){
    
    if(!this.state.allow){
      return  <Router>
          <Switch>
            <Route render={() => {
              return <div>
                  <h1> Bienvenido! </h1>
                  <input type="text" onChange={this.getPass}></input>
                  <button onClick={this.comprobarPassword}>Empezar Test</button>
                </div>
            }}>
            </Route>
          </Switch>
        </Router>
    }
    else{
      return <Router>
        <Switch>       
          <Route render={() => {
            return <div>
              <h1> El Test ha empezado! </h1>
              <QuestionContainer questionList={this.state.questionList} 
              sendTest = {this.sendTest}
              />
            </div>
          }}>
          </Route>
        </Switch>
      </Router>
    }
  }
  
}

export default App;
