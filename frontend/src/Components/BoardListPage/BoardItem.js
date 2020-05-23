import React from "react";
import './boards.css';
import Field from "../Field";
class BoardItem extends React.Component {

    componentDidMount() {
    }

    onClick = () => {
        document.location.href = `/item/${this.props.id}`
        //window.
    };
    delete = event => {
        event.stopPropagation();
        //TODO: Make deletion
        alert("deletion")
    };
    click = event => {
        //event.preventDefault();
        event.stopPropagation();
    };
    render() {
        console.log(this.props);
        return (
            <div onClick={this.onClick} className='content board'>
                <span className='arrow board-delete' onClick={this.delete}>&#10006;</span>
                <h2>
                    <Field description='Title'>{this.props.name}</Field>
                </h2>
                <b>Creator</b> {this.props.creator.login} ({this.props.creator.email})
                <Field description='Description'>{this.props.description}</Field>
                <br/>
                <b>Begin:</b> {this.props.addingDate}
                <br/>
                <b>End:</b> {this.props.endDate}
                <details onClick={this.click}>
                    <summary>
                        <b>Members:</b>
                    </summary>
                    {this.props.members.map(m => <div key={m.login}>{m.login} ({m.email})</div>)}
                </details>
            </div>
        );
    }
}

export default BoardItem;
