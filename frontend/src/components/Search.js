import React, { Component } from 'react';

class Search extends Component {
  getInfo = (event) => {
    event.preventDefault();
    this.props.submitSearch();
  };

  render() {
    return (
      <form className="Search" onSubmit={this.getInfo}>
        <input placeholder="Search questions..." value={this.props.value} onChange={(ev) => this.props.onChange(ev.target.value)} />
        <button type="submit" className="button">
          Search
        </button>
      </form>
    );
  }
}

export default Search;
