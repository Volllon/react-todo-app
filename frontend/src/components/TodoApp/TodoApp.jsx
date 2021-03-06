import React from 'react';
import Logo from '../Logo/Logo.jsx';
import TodoHeader from '../TodoHeader/TodoHeader.jsx';
import List from '../List/List.jsx';
import TodoFooter from '../TodoFooter/TodoFooter.jsx';
import UserEmail from '../UserEmail/UserEmail.jsx';
import LogoutButton from '../LogoutButton/LogoutButton.jsx';
import TodoUserEmail from '../TodoUserEmail/TodoUserEmail.jsx';
import notification from '../../javaScript/notification';
import { userApi, taskApi } from '../../controller/api';
import './style.css';

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      taskList: [],
      itemsCounter: 0,
      activeItemsCounter: 0,
      completedItemsCounter: 0,
      isAllCompletedTasks: false,
      filter: 'All',
      email: null
    };
  }

  componentDidMount = async () => {
    this.updateTaskList();

    if (this.state.email === null) {
      const email = await userApi.getEmail();

      this.setState({ email });
    }
  }

  updateTaskList = () => {
    taskApi.getTaskList().then(async (response) => {
      if (response.success) {
        this.updateStateOn(response.taskList);
      } else {
        this.props.setNotification(notification.error(response.message));
      }
    });
  }

  handleAddTaskChange = (taskDescription) => {
    this.handleTaskApiResponse(taskApi.addTask(taskDescription));
  }

  handleRemoveTaskChange = (taskId) => {
    this.handleTaskApiResponse(taskApi.removeTask(taskId));
  }

  handleChangeTaskMarkChange = (taskId) => {
    let {taskList} = this.state;
    let isDone = null;

    taskList.forEach((task) => {
      if (task.id === taskId) isDone = !task.isDone;
    });

    this.handleTaskApiResponse(taskApi.changeTaskMark(taskId, isDone));
  }

  handleChangeFilterChange = (filterStatus) => {
    this.setState({ filter: filterStatus });
  }

  handleRemoveCompletedTasksChange = () => {
    let {taskList} = this.state;

    const completedTasks = taskList.filter((task) => {
      return task.isDone;
    });

    let taskIds = [];

    completedTasks.forEach((task) => {
      taskIds.push(task.id);
    });

    this.handleTaskApiResponse(taskApi.removeCompletedTasks(taskIds));
  }

  handleChangeAllTaskMarksChange = () => {
    this.handleTaskApiResponse(
      taskApi.changeAllTaskMarks(!this.state.isAllCompletedTasks)
    );
  }

  handleChangeTaskDescriptionChange = (taskId, taskDescription) => {
    this.handleTaskApiResponse(
      taskApi.changeTaskDescription(taskId, taskDescription)
    );
  }

  handleTaskApiResponse = (promise) => {
    promise.then((response) => {
      const responseStatus = response.success ? 'success' : 'error';
      
      this.props.setNotification(notification[responseStatus](response.message));

      if (response.success) {
        this.updateTaskList();
      }
    });
  }

  updateStateOn = (nextTaskList) => {
    const nextState = this.getNextStateOn(nextTaskList);

    const {
      nextItemsCounter,
      nextActiveItemsCounter,
      nextCompletedItemsCounter,
      nextIsAllCompletedTasks
    } = nextState;

    this.setState({
      taskList: nextTaskList,
      itemsCounter: nextItemsCounter,
      activeItemsCounter: nextActiveItemsCounter,
      completedItemsCounter: nextCompletedItemsCounter,
      isAllCompletedTasks: nextIsAllCompletedTasks
    });
  }
  
  getNextStateOn = (nextTaskList) => {
    const {
      nextItemsCounter,
      nextActiveItemsCounter,
      nextCompletedItemsCounter
    } = this.getNextCountersOn(nextTaskList);

    const nextIsAllCompletedTasks = 
      this.getNextIsAllCompletedTasksOn(nextItemsCounter, nextCompletedItemsCounter);

    return {
      nextItemsCounter,
      nextActiveItemsCounter,
      nextCompletedItemsCounter,
      nextIsAllCompletedTasks
    }
  }

  getNextCountersOn = (nextTaskList) => {
    let nextActiveItemsCounter = 0;
    let nextCompletedItemsCounter = 0;

    nextTaskList.map((task) => {
      if (!task.isDone) nextActiveItemsCounter += 1;
      if (task.isDone) nextCompletedItemsCounter += 1;

      return task;
    });

    return {
      nextActiveItemsCounter,
      nextCompletedItemsCounter,
      nextItemsCounter: nextActiveItemsCounter + nextCompletedItemsCounter,
    };
  }

  getNextIsAllCompletedTasksOn (nextItemsCounter, nextCompletedItemsCounter) {
    return nextItemsCounter !== 0 && nextItemsCounter === nextCompletedItemsCounter;;
  }
  
  getTaskList(filter) {
    const {taskList} = this.state;

    return taskList.filter((task) => {
      switch(filter) {
        case 'All':
          return true;
        case 'Active':
          return !task.isDone;
        case 'Completed':
          return task.isDone;
        default:
          return false;
      }
    });
  }

  hasCompletedTasks() {
    return Boolean(this.state.completedItemsCounter);
  }

  isEmptyTaskList() {
    return !Boolean(this.state.itemsCounter);
  }

  getTodoFooter() {
    let todoFooter = '';

    if (!this.isEmptyTaskList()) {
      todoFooter = (
        <TodoFooter
          className="row justify-content-center"
          itemsCounter={this.state.itemsCounter}
          activeItemsCounter={this.state.activeItemsCounter}
          completedItemsCounter={this.state.completedItemsCounter}
          filter={this.state.filter}
          handleChangeFilterChange={this.handleChangeFilterChange}
          shouldShowClearCompletedItemsButton={this.hasCompletedTasks()}
          handleRemoveCompletedTasksChange={this.handleRemoveCompletedTasksChange}
        />
      );
    }

    return todoFooter;
  }

  render() {
    return (
      <div className={this.props.className + " todo-app"}>
        <TodoUserEmail>
          <UserEmail>{ this.state.email }</UserEmail>
          <LogoutButton>Exit</LogoutButton>
        </TodoUserEmail>
        <Logo className="row"/>
        <div className="row todo-wrap">
          <div className="col">
            <TodoHeader
              className="row align-items-center"
              handleAddTaskChange={this.handleAddTaskChange}
              shouldShowListStatusCheckbox={!this.isEmptyTaskList()}
              shouldActiveListStatusCheckbox={this.state.isAllCompletedTasks}
              handleChangeAllTaskMarksChange={this.handleChangeAllTaskMarksChange}
            />
            <List
              className="row"
              taskList={this.getTaskList(this.state.filter)}
              handleChangeTaskMarkChange={this.handleChangeTaskMarkChange}
              handleRemoveTaskChange={this.handleRemoveTaskChange}
              handleChangeTaskDescriptionChange={this.handleChangeTaskDescriptionChange}
            />
            {this.getTodoFooter()}
          </div>
        </div>
      </div>
    );
  }
}

export default TodoApp;
