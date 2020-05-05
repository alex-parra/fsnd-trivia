import os
from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random

from models import setup_db, db, Question, Category

QUESTIONS_PER_PAGE = 10


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    setup_db(app)

    CORS(app)

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods',
                             'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        return response

    '''
    Get all categories
    '''
    @app.route('/categories')
    def get_categories():
        categories = Category.query.all()
        return jsonify({
            'categories': {c.id: c.type for c in categories}
        })

    '''
    Get questions paginated
    '''
    @app.route('/questions')
    def get_questions():
        per_page = 10
        page = request.args.get('page', 1, type=int)
        start = (page - 1) * per_page
        stop = start + per_page - 1
        questions = Question.query.slice(start, stop).all()
        total_questions = Question.query.count()
        categories = Category.query.all()
        return jsonify({
            'questions': [q.format() for q in questions],
            'total_questions': total_questions,
            'per_page': per_page,
            'page': page,
            'categories': {c.id: c.type for c in categories},
            'current_category': None
        })

    '''
    Delete a question by it's ID
    '''
    @app.route('/questions/<int:question_id>', methods=['DELETE'])
    def delete_question(question_id):
        question = Question.query.get(question_id)
        if question is None:
            return abort(404)
        db.session.delete(question)
        db.session.commit()
        return jsonify({'success': True})

    '''
    Create question
    '''
    @app.route('/questions', methods=['POST'])
    def add_question():
        data = request.get_json(force=True)
        # TODO: Validation with marshmallow
        fields = ('question', 'answer', 'category', 'difficulty')
        question = Question(**{k: data[k] for k in fields if k in data})
        db.session.add(question)
        db.session.commit()
        return jsonify(question.format())

    '''
  @TODO: 
  Create a POST endpoint to get questions based on a search term. 
  It should return any questions for whom the search term 
  is a substring of the question. 

  TEST: Search by any phrase. The questions list will update to include 
  only question that include that string within their question. 
  Try using the word "title" to start. 
  '''

    '''
    Get paginated questions of specified category
    '''
    @app.route('/category/<int:category_id>/questions')
    def get_category_questions(category_id):
        per_page = 10
        page = request.args.get('page', 1, type=int)
        start = (page - 1) * per_page
        stop = start + per_page - 1
        questions = Question.query.filter(
            Question.category == category_id).slice(start, stop).all()
        total_questions = Question.query.filter(
            Question.category == category_id).count()
        return jsonify({
            'questions': [q.format() for q in questions],
            'total_questions': total_questions,
            'per_page': per_page,
            'page': page,
            'current_category': category_id
        })

    '''
  @TODO: 
  Create a POST endpoint to get questions to play the quiz. 
  This endpoint should take category and previous question parameters 
  and return a random questions within the given category, 
  if provided, and that is not one of the previous questions. 

  TEST: In the "Play" tab, after a user selects "All" or a category,
  one question at a time is displayed, the user is allowed to answer
  and shown whether they were correct or not. 
  '''

    '''
  @TODO: 
  Create error handlers for all expected errors 
  including 404 and 422. 
  '''

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({error: 'Not Found'}), 404

    @app.errorhandler(422)
    def bad_request(error):
        return jsonify({error: 'Bad request or data'}), 422

    return app
