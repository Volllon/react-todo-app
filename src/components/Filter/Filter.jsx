import React from 'react';
import './Filter.css';

class Filter extends React.Component {
  handleChange = (e) => {
    this.props.onChangeFilterChange(e.target.value);
  }

  render() {
    const {filter} = this.props;

    return (
      <div className={this.props.className}>
        <label className={"filter-button" + (filter === 'All' ? " active-filter-button" : "")}>
          <input
            className="filter"
            type="radio"
            name="filter"
            id="allItems"
            checked={filter === 'All'}
            onChange={this.handleChange}
            value="All"
          />
          All
        </label>
        <label className={"filter-button" + (filter === 'Active' ? " active-filter-button" : "")}>
          <input
            className="filter"
            type="radio"
            name="filter"
            id="activeItems"
            checked={filter === 'Active'}
            onChange={this.handleChange}
            value="Active"
          />
          Active
        </label>
        <label className={"filter-button" + (filter === 'Completed' ? " active-filter-button" : "")}>
          <input
            className="filter"
            type="radio"
            name="filter"
            id="completedItems"
            checked={filter === 'Completed'}
            onChange={this.handleChange}
            value="Completed"
          />
          Completed
        </label>
      </div>
    );
  }
}

export default Filter;