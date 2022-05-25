import React from 'react'


export default class EditTestQuestion extends React.Component {

    //Se le pasa el objecto pregunta por props
    constructor(props) {
        super(props)
        this.state = {
            nombre:"",
            options: [],
            correct:undefined,
          };
        this.actualizarPregunta = this.actualizarPregunta.bind(this);
        this.updateOptions = this.updateOptions.bind(this);
    }

    componentDidMount(){
        var ordenOptions ={};
        this.props.pregunta.options.map((opcion,indx) =>{
            ordenOptions[indx] = opcion
        })
        
        this.setState({
            titulo: this.props.pregunta.title,
            nombre:this.props.pregunta.question,
            correct:this.props.pregunta.correct_op,
            options:this.props.pregunta.options,
            dicOptions:ordenOptions,
        })
    }

    

    actualizarPregunta = () => {
        var question = this.props.pregunta
        question["title"] = this.state.titulo
        question["question"] = this.state.nombre
        question["options"] = this.state.options
        question["correct_op"] = this.state.correct
        this.props.updateEditQuestion(question);
    }

    updateOptions = (e) =>{
        var idOpcion = Number(e.target.name)
        var opcion = this.state.options.find(elemento => elemento.id == idOpcion)
        opcion["op"] = e.target.value;

        var ordenOptions = this.state.dicOptions

        var listaOpciones =  []
        for (let k in ordenOptions) {
            if(ordenOptions[k].id == idOpcion){
                ordenOptions[k] = opcion
            }
            listaOpciones.push(ordenOptions[k])
        }

        this.setState({
            options:listaOpciones,
            dicOptions:ordenOptions,
        });

    }

    render () {
        
        return(
            <div class="p-4 m-2 text-center">
                <label className='col-4'>Título: &nbsp;</label>
                <input className="col-8 m-input" name="titulo" type="text" value={this.state.titulo} onChange={(e) => this.setState({titulo:e.target.value})}/>
                
                <label className='col-4'>Pregunta: &nbsp;</label>
                <input className="col-8 m-input" name="nombre" type="text" value={this.state.nombre} onChange={(e) => this.setState({nombre:e.target.value})}/>
                
                {this.state.options.map((opcion,indx) => {
                                        return (
                                            <div key={opcion.id} className='row m-1'>
                                                <label className='col-4'>{indx + 1 + ".- Opción :"} &nbsp;</label>
                                                <input className="col-8 m-input" name={opcion.id} type="text" value={opcion.op} onChange={(e) => this.updateOptions(e)}/>
                                            </div>
                                        );
                                    })}

                <div className='row m-1'>
                    <label className='col-4'>Respueta Correcta: &nbsp;</label>
                        <select  className="col-8 m-input" onChange={(e) => this.setState({correct:Number(e.target.value)})}>
                                            {this.state.options.map((opcion,indx) => {
                                                return (
                                                    <option key={indx} value={opcion.id} defaultValue={opcion.id==this.state.correct}>{opcion.op}</option>
                                                );
                                            })}
                                    </select>
                </div>

                <button class="btn btn-success" onClick={() => this.actualizarPregunta()}> Actualizar </button>
            </div>
        );
      
        
    }
}    