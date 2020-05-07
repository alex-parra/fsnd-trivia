import React, { Component } from 'react';
import api from '../api';
import $ from 'jquery';

import '../stylesheets/QuizView.css';

const questionsPerPlay = 5;
const initialState = {
  quizCategory: null,
  previousQuestions: [],
  showAnswer: false,
  numCorrect: 0,
  currentQuestion: null,
  guess: '',
  forceEnd: false,
};

class QuizView extends Component {
  constructor(props) {
    super();
    this.state = { ...initialState };
  }

  async componentDidMount() {
    const { categories = {} } = await api.getCategories().catch(() => ({}));
    this.setState({ categories });
  }

  selectCategory = (ev, { id, label }) => {
    ev.preventDefault();
    const quizCategory = { id, type: label };
    this.setState({ quizCategory }, this.getNextQuestion);
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  getNextQuestion = async () => {
    const previousQuestions = this.state.previousQuestions.slice();
    const { currentQuestion, quizCategory } = this.state;
    if (currentQuestion) previousQuestions.push(currentQuestion.id);

    try {
      const categId = Number(quizCategory.id) || null;
      const data = await api.quizNextQuestion({ previousQuestions, quizCategory: categId });
      this.setState({
        showAnswer: false,
        previousQuestions,
        currentQuestion: data.question,
        guess: '',
        forceEnd: data.question ? false : true,
      });
    } catch {
      alert('Unable to load question. Please try your request again');
    }
  };

  submitGuess = (event) => {
    event.preventDefault();
    let evaluate = this.evaluateAnswer();
    this.setState({
      numCorrect: !evaluate ? this.state.numCorrect : this.state.numCorrect + 1,
      showAnswer: true,
    });
  };

  restartGame = () => {
    this.setState({ ...initialState });
  };

  renderPrePlay() {
    const categories = { '0': 'ALL', ...this.state.categories };
    return (
      <div className="quiz-play-holder">
        <div className="choose-header">Choose Category</div>
        <div className="category-holder">
          {Object.entries(categories).map(([id, label]) => {
            return (
              <a href="#0" key={id} className="play-category" onClick={(ev) => this.selectCategory(ev, { id, label })}>
                {label}
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  renderFinalScore() {
    return (
      <div className="quiz-play-holder">
        <div className="final-header">
          Your Final Score is
          <strong>{this.state.numCorrect}</strong>
        </div>
        <div>
          <button className="play-again button" onClick={this.restartGame}>
            Play Again?
          </button>
        </div>
      </div>
    );
  }

  evaluateAnswer = () => {
    const formatGuess = this.state.guess.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').toLowerCase();
    return formatGuess === this.state.currentQuestion.answer.toLowerCase();
  };

  renderCorrectAnswer() {
    let evaluate = this.evaluateAnswer();
    return (
      <div className="quiz-play-holder">
        <div className="quiz-question">{this.state.currentQuestion.question}</div>
        <div className="quiz-answer">
          The answer is <br /> <strong>{this.state.currentQuestion.answer}</strong>
        </div>
        <div className={`answer-result ${evaluate ? 'correct' : 'wrong'}`}>{evaluate ? 'You were correct!' : 'You were incorrect'}</div>
        <div>
          <button className="next-question" onClick={this.getNextQuestion}>
            Next Question
          </button>
        </div>
      </div>
    );
  }

  renderPlay() {
    return this.state.previousQuestions.length === questionsPerPlay || this.state.forceEnd ? (
      this.renderFinalScore()
    ) : this.state.showAnswer ? (
      this.renderCorrectAnswer()
    ) : this.state.currentQuestion == null ? (
      <div className="loading">Loading...</div>
    ) : (
      <div className="quiz-play-holder">
        <div className="quiz-question">{this.state.currentQuestion.question}</div>
        <form onSubmit={this.submitGuess} autoComplete="off">
          <input type="text" name="guess" placeholder="Enter your answer..." onChange={this.handleChange} autoFocus autoComplete="off" />
          <button className="submit-guess button" type="submit">
            Submit Answer
          </button>
        </form>
      </div>
    );
  }

  render() {
    return this.state.quizCategory ? this.renderPlay() : this.renderPrePlay();
  }
}

export default QuizView;
