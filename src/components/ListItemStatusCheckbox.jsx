import React from 'react';

class ListItemStatusCheckbox extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.onChangeTaskMarkChange(this.props.taskId);
  }

  render() {
    return <input type="checkbox" checked={this.props.isChecked} onChange={this.handleChange}/>;
  }
}

export default ListItemStatusCheckbox;