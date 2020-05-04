import os
from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random

from models import setup_db, Question, Category

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

    @app.route('/categories')
    def get_categories():
        categories = Category.query.all()
        return jsonify({
            'categories': [c.format() for c in categories]
        })

    '''
    get_questions returns paginated list of questions
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
  @TODO: 
  Create an endpoint to DELETE question using a question ID. 

  TEST: When you click the trash icon next to a question, the question will be removed.
  This removal will persist in the database and when you refresh the page. 
  '''

    '''
  @TODO: 
  Create an endpoint to POST a new question, 
  which will require the question and answer text, 
  category, and difficulty score.

  TEST: When you submit a question on the "Add" tab, 
  the form will clear and the question will appear at the end of the last page
  of the questions list in the "List" tab.  
  '''

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
  @TODO: 
  Create a GET endpoint to get questions based on category. 

  TEST: In the "List" tab / main screen, clicking on one of the 
  categories in the left column will cause only questions of that 
  category to be shown. 
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

    return app
