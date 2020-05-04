import React, { Component } from 'react';

import '../stylesheets/App.css';
import Question from './Question';
import Search from './Search';
import $ from 'jquery';
import api from '../api';

class QuestionView extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      page: 1,
      perPage: 10,
      totalQuestions: 0,
      categories: {},
      currentCategory: null,
    };
  }

  componentDidMount() {
    this.getQuestions();
  }

  getQuestions = async () => {
    if (this.state.currentCategory) return this.getByCategory(this.state.currentCategory);

    try {
      const data = await api.getQuestions(this.state.page);
      this.setState({
        questions: data.questions,
        totalQuestions: data.total_questions,
        page: data.page,
        perPage: data.per_page,
        categories: data.categories,
        currentCategory: data.current_category,
      });
    } catch {
      alert('Unable to load questions. Please try your request again');
    }
  };

  selectPage(num) {
    this.setState({ page: num }, () => this.getQuestions());
  }

  createPagination() {
    let pageNumbers = [];
    let maxPage = Math.ceil(this.state.totalQuestions / this.state.perPage);
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`page-num ${i === this.state.page ? 'active' : ''}`}
          onClick={() => {
            this.selectPage(i);
          }}
        >
          {i}
        </span>
      );
    }
    return pageNumbers;
  }

  getByCategory = async (id) => {
    try {
      const data = await api.getCategoryQuestions(id);
      this.setState({
        questions: data.questions,
        totalQuestions: data.total_questions,
        currentCategory: data.current_category,
      });
    } catch {
      alert('Unable to load questions. Please try your request again');
    }
  };

  submitSearch = (searchTerm) => {
    $.ajax({
      url: `/questions`, //TODO: update request URL
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ searchTerm: searchTerm }),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: result.current_category,
        });
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again');
        return;
      },
    });
  };

  questionAction = (id) => (action) => {
    if (action === 'DELETE') {
      const confirm = window.confirm('are you sure you want to delete the question?');
      if (!confirm) return;
      api
        .deleteQuestion(id)
        .then(this.getQuestions)
        .catch(() => alert('Unable to load questions. Please try your request again'));
    }
  };

  render() {
    return (
      <div className="question-view">
        <div className="categories-list">
          <h2 onClick={() => this.getQuestions()}>Categories</h2>
          <ul>
            {Object.keys(this.state.categories).map((id) => (
              <li key={id} onClick={() => this.getByCategory(id)}>
                {this.state.categories[id]}
                <img className="category" src={`${this.state.categories[id]}.svg`} alt="" />
              </li>
            ))}
          </ul>
          <Search submitSearch={this.submitSearch} />
        </div>
        <div className="questions-list">
          <h2>Questions</h2>
          {this.state.questions.map((q, ind) => (
            <Question key={q.id} question={q.question} answer={q.answer} category={this.state.categories[q.category]} difficulty={q.difficulty} questionAction={this.questionAction(q.id)} />
          ))}
          <div className="pagination-menu">{this.createPagination()}</div>
        </div>
      </div>
    );
  }
}

export default QuestionView;
