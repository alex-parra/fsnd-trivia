import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/Header.css';

class Header extends Component {
  navTo(uri) {
    window.location.href = window.location.origin + uri;
  }

  render() {
    return (
      <div className="App-header">
        <Link to="/">
          <h1>Udacitrivia</h1>
        </Link>
        <Link to="/">
          <h2>List</h2>
        </Link>
        <Link to="/add">
          <h2>Add</h2>
        </Link>
        <Link to="/play">
          <h2>Play</h2>
        </Link>
      </div>
    );
  }
}

export default Header;
