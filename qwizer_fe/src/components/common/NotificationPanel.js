import React from 'react'



class NotificationPanel extends React.Component {
    
  constructor(props){
    super(props);
  }

  
  render() { 
    return (
        <span className="">
            <div className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="material-icons">notifications</span>
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a className="dropdown-item" href="#">#####</a>
                    <a className="dropdown-item" href="#">#####</a>
                    </div>
                </div>
        </span> 
    );            
  }

}

export default NotificationPanel;