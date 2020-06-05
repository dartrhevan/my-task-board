import React from "react";
import Task from "./Task";
import "./Column.css";
import AddTask from "./AddTask";
import Field from "../Field";

class Column extends React.Component {
    moveLeft = event => {
        this.props.moveLeft(this.props.column._id);
    };
    moveRight = event => {
        this.props.moveRight(this.props.column._id);
    };
    addTask = (name, workerId, description, date) => {
        //TODO:implement sending to server new task
        this.props.addTask(name, workerId, description, date, this.props.column._id);
    };/*
    constructor() {
        super();
        this.state = { name: "Title", tasks: [ {name: "sdcvsds" } ], editing: false};
    }*/

    delete = event =>
        this.props.delete(this.props.column._id);

    edit = this.props.changeColumn.bind(null, this.props.column._id);

    deleteTask = this.props.deleteTask.bind(null, this.props.column._id);

    render() {
        console.log('props' + this.props);
        return  (
                <div className='Column content'>
                    <span onClick={this.moveLeft} className='arrow' style={{float: "left"}}>&lt;</span>
                    {/* <span className='arrow edit' onClick={this.edit}>&#10000;</span>*/}
                    <span className='arrow' onClick={this.delete}>&#10006;</span>
                    <span onClick={this.moveRight} className='arrow' style={{float: "right"}}>&gt;</span>
                    <h3><Field name='name' onEdit={this.edit}>{this.props.column.name}</Field></h3>
                    {this.props.column.tasks.filter(this.props.filter)
                        .filter(t => Object.keys(t).length !== 0).map(b =>
                        <Task columns={this.props.columns} members={this.props.members} onDelete={this.deleteTask} key={b._id} id={b._id} task={b} />)}
                    <AddTask onSubmit={this.addTask} members={this.props.members}/>
                </div>
        );
    }
}

export default Column;
