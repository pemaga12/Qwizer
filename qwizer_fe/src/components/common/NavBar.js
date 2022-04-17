import React from 'react'
import NotificationPanel from './NotificationPanel';


class NavBar extends React.Component {
    
  constructor(props){
    super(props);
  }
  
  
  render() {     
            return(
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" onClick={() => this.props.changeCurrentPage("index")}>Qwizer</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" onClick={() => this.props.changeCurrentPage("index")}>Inicio <span className="sr-only"></span></a>
                                
                            </li>
                            {localStorage.getItem("rol") === "teacher" && <li className="nav-item active">
                                <a className="nav-link" onClick={() => this.props.changeCurrentPage("register")}>Añadir alumno<span className="sr-only"></span></a>
                            </li>}
                            {localStorage.getItem("rol") === "teacher" && <div className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Crear cuestionarios
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <a className="nav-link"onClick={() => this.props.changeCurrentPage("upload-questions")}>Subir Preguntas<span className="sr-only"></span></a>
                                <a className="nav-link" onClick={() => this.props.changeCurrentPage("upload")}>Subir test <span className="sr-only"></span></a>
                                <a className="nav-link" onClick={() => this.props.changeCurrentPage("crear-cuestionario")}>Crear Cuestionario<span className="sr-only"></span></a>
                                <a className="nav-link" onClick={() => this.props.changeCurrentPage("banco-preguntas")}>Banco de Preguntas<span className="sr-only"></span></a>
                                </div>
                            </div>}
                            <li className="nav-item active">
                                <a className="nav-link" onClick={() => this.props.changeCurrentPage("offline")}>Offline <span className="sr-only"></span></a>
                            </li>
                           
                            
                        </ul>
                        <NotificationPanel></NotificationPanel>
                        <span className="">
                            <div className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.props.username}
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item" href="#">Mi perfil</a>
                                    <a className="dropdown-item" onClick={this.props.logout}>Cerrar sesión</a>
                                </div>
                            </div>
                        </span>   
                    </div>
                </nav>
            );                
  }

}

export default NavBar;