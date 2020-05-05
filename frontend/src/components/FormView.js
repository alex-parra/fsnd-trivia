import React, { Component } from 'react';
import api from '../api';
import '../stylesheets/FormView.css';

class FormView extends Component {
  constructor(props) {
    super();
    this.state = {
      categories: {},
      form: {
        question: '',
        answer: '',
        difficulty: 1,
        category: 1,
      },
    };
  }

  async componentDidMount() {
    const { categories = {} } = await api.getCategories().catch(() => ({}));
    this.setState({ categories });
  }

  submitQuestion = async (ev) => {
    ev.preventDefault();
    try {
      await api.addQuestion(this.state.form);
      this.props.history.replace('/');
    } catch {
      alert('Unable to add question. Please try your request again');
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((state) => ({ form: { ...state.form, [name]: value } }));
  };

  render() {
    const difficulties = [1, 2, 3, 4, 5];
    const categIds = Object.keys(this.state.categories);

    return (
      <div id="add-form">
        <h2>Add a New Trivia Question</h2>
        <form className="form-view" id="add-question-form" onSubmit={this.submitQuestion}>
          <label>
            <strong>Question:</strong> <input type="text" name="question" onChange={this.handleChange} autoFocus />
          </label>
          <label>
            <strong>Answer:</strong> <input type="text" name="answer" onChange={this.handleChange} />
          </label>
          <label>
            <strong>Difficulty:</strong>
            <select name="difficulty" onChange={this.handleChange}>
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label>
            <strong>Category:</strong>
            <select name="category" onChange={this.handleChange}>
              {categIds.map((id) => (
                <option key={id} value={id}>
                  {this.state.categories[id]}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="button">
            Save Question
          </button>
        </form>
      </div>
    );
  }
}

export default FormView;
