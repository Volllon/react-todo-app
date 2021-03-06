import React from 'react';
import ListItemStatusCheckbox from '../ListItemStatusCheckbox/ListItemStatusCheckbox.jsx';
import ListItemTaskDescription from '../ListItemTaskDescription/ListItemTaskDescription.jsx';
import ListItemDeleteButton from '../ListItemDeleteButton/ListItemDeleteButton.jsx';
import './style.css';

class ListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasMouseOver: false,
      isEditTask: false,
    };
  }

  toogleMouseOver = () => {
    const { hasMouseOver } = this.state;
    this.setState({ hasMouseOver: !hasMouseOver });
  }

  handleIsEditTaskChange = (isEditTask) => {
    this.setState({isEditTask});

    if (!isEditTask) {
      this.setState({
        hasMouseOver: false
      })
    }
  }

  render() {
    const { task } = this.props;

    return (
      <li
        className={this.props.className + " list-item"}
        onMouseOver={this.toogleMouseOver}
        onMouseOut={this.toogleMouseOver}
      >
        <div className="col-1">
          <ListItemStatusCheckbox
            className={this.state.isEditTask ? 'd-none' : ''}
            taskId={task.id}
            isChecked={task.isDone}
            onChangeTaskMarkChange={this.props.handleChangeTaskMarkChange}
          />
        </div>
        <ListItemTaskDescription
          className="col"
          task={task}
          onChangeTaskDescriptionChange={this.props.handleChangeTaskDescriptionChange}
          onRemoveTaskChange={this.props.handleRemoveTaskChange}
          isEdit={this.state.isEditTask}
          onIsEditTaskChange={this.handleIsEditTaskChange}
        />
        <div className="col-1">
          <ListItemDeleteButton
            taskId={task.id}
            onRemoveTaskChange={this.props.handleRemoveTaskChange}
            shouldShowButton={!this.state.isEditTask && this.state.hasMouseOver}
          />
        </div>
      </li>
    );
  }
}

export default ListItem;
