import React, { Component } from 'react';

import '../stylesheets/App.css';
import Question from './Question';
import Search from './Search';
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
      search: '',
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
        <a
          key={i}
          href="#0"
          className={`page-num ${i === this.state.page ? 'active' : ''}`}
          onClick={(ev) => {
            ev.preventDefault();
            this.selectPage(i);
          }}
        >
          {i}
        </a>
      );
    }
    return pageNumbers;
  }

  getByCategory = async (ev, id) => {
    ev.preventDefault();

    if (!id) {
      return this.setState({ currentCategory: null }, this.getQuestions);
    }

    try {
      const data = await api.getCategoryQuestions(id);
      this.setState({
        questions: data.questions,
        totalQuestions: data.total_questions,
        currentCategory: data.current_category,
        search: '',
      });
    } catch {
      alert('Unable to load questions. Please try your request again');
    }
  };

  setSearch = (searchTerm) => {
    this.setState({ search: searchTerm });
  };

  submitSearch = async () => {
    try {
      const data = await api.searchQuestions(this.state.search, this.state.currentCategory);
      this.setState({
        questions: data.questions,
        totalQuestions: data.questions.length,
      });
    } catch {
      alert('Unable to load questions. Please try your request again');
    }
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
    const categories = [
      { id: 0, label: 'All Categories' },
      ...Object.entries(this.state.categories)
        .map(([id, label]) => ({ id: Number(id), label }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    ];

    return (
      <div className="question-view">
        <div className="categories-list">
          <h2>Categories</h2>
          {categories.map(({ id, label }) => (
            <a key={id} className={id === this.state.currentCategory ? 'active' : ''} href="#0" onClick={(ev) => this.getByCategory(ev, id)}>
              {label} {id > 0 && <img className="category" src={`${label}.svg`} alt="" />}
            </a>
          ))}
        </div>
        <div className="questions-list">
          <div className="header">
            <h2>Questions</h2>
            <Search value={this.state.search} onChange={this.setSearch} submitSearch={this.submitSearch} />
          </div>
          {this.state.questions.map((q, ind) => (
            <Question key={q.id} question={q} category={this.state.categories[q.category]} action={this.questionAction(q.id)} />
          ))}
          <div className="pagination-menu">{this.createPagination()}</div>
        </div>
      </div>
    );
  }
}

export default QuestionView;
