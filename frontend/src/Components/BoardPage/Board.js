import React from "react";
import Column from "./Column";
import getWSURL from "../getWSURL";
import {LoadingWheel} from "../LoadingWheel";
//import { useParams } from "react-router-dom";
class Board extends React.Component {
    constructor() {
        super();
        this.state = {board: {name: "", description: ""}, columns: null};
    }

    componentDidMount() {

        this.ws = new WebSocket(getWSURL(`ws/get_detailed_board/${this.props.match.params.id}`));
        //this.ws = new WebSocket(`ws:localhost:8000/ws/get_detailed_board/${this.props.match.params.id}`);
        this.ws.onmessage = msg => {
            const data = JSON.parse(msg.data);
            console.log(data);
            if(data.error)
                alert(data.error);
            else
                this.setState(data);
        };
    }

    render() {
        //const { id } = useParams();
        console.log(this.state);
        return (
            <div >
                <h1>Board: {this.state.board.name}</h1>
                <div align='center' className='description'>
                    {this.state.board.description}
                </div>
                <div className='columns' >
                    {
                        this.state.columns ?
                        this.state.columns.map(c => <Column key={c._id} column={c}/>) :
                        <LoadingWheel/>
                    }
                </div>
            </div>
        );
    }
}

export default Board;
