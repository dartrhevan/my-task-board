import React from "react";
import Task from "./Task";
import "./Column.css";
import AddTask from "./AddTask";
import Field from "../Field";
import WsClient from "./WsClient";

class Column extends React.Component {
    moveLeft = event => {
        this.props.moveLeft(this.props.column._id);
    };
    moveRight = event => {
        this.props.moveRight(this.props.column._id);
    };
    addTask = (name, workerId, description, date) =>
        this.props.WsClient.addTask(name, workerId, description, date, this.props.column._id);

    delete = event => this.props.WsClient.delete(this.props.column._id, 'Column', undefined, {
    collection: 'Task',
    field: 'tasks'
});

    edit = this.props.changeColumn.bind(null, this.props.column._id);

    deleteTask = this.props.deleteTask.bind(null, this.props.column._id);

    editTask = this.props.changeTask.bind(null, this.props.column._id);



    onDragLeave = (event) => {
        if ( event.target.className === "Column content") {
            event.target.style.background = "linear-gradient(rgba(230,230,230, 0.9),rgba(210,210,210, 0.8))";
            event.target.style.border = ""
        }
    };

    onDragEnd = (event) => {
        this.props.onDragEnd(event, this.props.column._id);
    };

    onDrop = (event) => {
        event.target.style.background = "linear-gradient(rgba(230,230,230, 0.9),rgba(210,210,210, 0.8))";
        event.target.style.border = ""
    };

    onDragStart = (event) => {
        this.props.onDragStart(event, this.props.column._id)
    };

    onDragEnter = (event) => {
        this.props.onDragEnter(event, this.props.column._id);
    };

    render() {
        console.log('props' + this.props);
        return  (
                <div draggable="true" className='Column content' onDragEnter={this.onDragEnter}
                     onDragStart={this.onDragStart} onDragLeave={this.onDragLeave}
                     onDragOver={this.props.onDragOver} onDragEnd={this.onDragEnd}
                     onDrop={this.onDrop}>

                    <span onClick={this.moveLeft} className='arrow' style={{float: "left"}}>&lt;</span>
                    <span className='arrow' onClick={this.delete}>&#10006;</span>
                    <span onClick={this.moveRight} className='arrow' style={{float: "right"}}>&gt;</span>
                    <h3><Field name='name' onEdit={this.edit}>{this.props.column.name}</Field></h3>

                    {this.props.column.tasks.filter(this.props.filter)
                        .filter(t => Object.keys(t).length !== 0).map(b =>
                        <Task columns={this.props.columns} members={this.props.members}
                              onEdit={this.editTask} columnId={this.props.column._id}
                              toggleDoneTask={this.props.WsClient.toggleDoneTask}
                              onDelete={this.deleteTask} key={b._id} id={b._id} task={b} />)}

                    <AddTask onSubmit={this.addTask} members={this.props.members}/>
                </div>
        );
    }
}

export default Column;
