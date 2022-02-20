import React from 'react'


class SuccessModal extends React.Component {
    
  constructor(props){
    super(props);

    this.close_modal = this.close_modal.bind(this);
  }

  close_modal = () => {
    window.$(this.props.id).modal("hide");
  }
  
  render() { 
            return(
                <div className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                        <div className="modal-header success-modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Todo ha ido bien</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.close_modal}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.message}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" data-dismiss="modal" onClick={this.close_modal}>Cerrar</button>
                        </div>
                        </div>
                    </div>
                </div>
            );                
  }

}

export default SuccessModal;