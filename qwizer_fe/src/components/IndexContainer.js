import React from 'react'



class IndexContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {  
        return(
            <div className="index-body">
                <div className="card-container">
                    <div className="card">
                        <div className="card-content">
                            <h3>Fundamentos de la algoritmia</h3>
                            <p>Numero de test: 3</p>
                            <p>Numero de tests corregidos: 2</p>
                            <p>Numero de tests pendientes 1</p>
                        </div>
                    </div>
                </div> 
                <div className="card-container">
                    <div className="card">
                        <div className="card-content">
                            <h3>Fundamentos de la algoritmia</h3>
                            <p>Numero de test: 3</p>
                            <p>Numero de tests corregidos: 2</p>
                            <p>Numero de tests pendientes 1</p>
                        </div>
                    </div>
                </div> 
            </div>
         );
      }
}

export default IndexContainer;