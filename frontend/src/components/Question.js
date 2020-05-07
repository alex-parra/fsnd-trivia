import React, { Component } from 'react';
import '../stylesheets/Question.css';

class Question extends Component {
  constructor() {
    super();
    this.state = {
      visibleAnswer: false,
    };
  }

  flipVisibility() {
    this.setState({ visibleAnswer: !this.state.visibleAnswer });
  }

  render() {
    const { question, category } = this.props;
    return (
      <div className="Question-holder">
        <div className="infos">
          <div className="category">
            <img src={`${category}.svg`} alt="" />
            <span>{category}</span>
          </div>
          <div className="difficulty">Difficulty: {question.difficulty}</div>
          <img src="delete.png" alt="" className="delete" onClick={() => this.props.action('DELETE')} />
        </div>

        <h3 className="Question">{question.question}</h3>

        <div className="answer-holder">
          <button className="show-answer button" onClick={() => this.flipVisibility()}>
            {this.state.visibleAnswer ? 'Hide' : 'Show'} Answer
          </button>
          <span style={{ visibility: this.state.visibleAnswer ? 'visible' : 'hidden' }}>Answer: {question.answer}</span>
        </div>
      </div>
    );
  }
}

export default Question;
