import React from 'react'
import TarjetaAsignatura from './TarjetaAsignatura';



class IndexContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {  
        return(
            <div className="index-body">
                {this.props.asignaturas.map(function(asignatura,indx){
                  return (
                      <div key={asignatura}>
                        <TarjetaAsignatura asignatura={asignatura}></TarjetaAsignatura>
                      </div>
                  )
                })}   
            </div>
         );
      }
}

export default IndexContainer;