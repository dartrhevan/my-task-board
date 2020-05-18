import React from "react";
import Task from "./Task";
import "./Column.css";
import AddTask from "./AddTask";

class Column extends React.Component {
    constructor() {
        super();
        this.state = { name: "Title", addingDate: "", endDate: "", tasks: [ {name: "sdcvsds" } ]};
    }

    componentDidMount() {
    }

    render() {
        console.log('props' + this.props);
        return  (
                <div className='Column content'>
                    <span style={{float: "right"}}>&lt;&gt;</span>
                    <h2>{this.props.column.name}</h2>
                    {this.props.column.tasks.map(b => <Task key={b._id} task={b} />)}
                    <AddTask/>
                </div>
        );
    }
}

export default Column;
