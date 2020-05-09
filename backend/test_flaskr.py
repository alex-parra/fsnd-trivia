import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app, paginate
from models import setup_db, Question, Category


class TriviaTestCase(unittest.TestCase):
    '''This class represents the trivia test case'''

    def setUp(self):
        '''Define test variables and initialize app.'''
        self.app = create_app()
        self.client = self.app.test_client
        self.database_name = "trivia_test"
        self.database_path = "postgres://{}@{}/{}".format(
            'postgres:123456', 'localhost:5432', self.database_name)
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)

    def tearDown(self):
        '''Executed after each test'''
        pass

    def test_paginate(self):
        (start, stop, per_page) = paginate(1)
        self.assertEqual(start, 0)
        self.assertEqual(stop, start + per_page - 1)

        (start, stop, per_page) = paginate(2)
        self.assertEqual(start, per_page)
        self.assertEqual(stop, start + per_page - 1)

        (start, stop, per_page) = paginate(1, 20)
        self.assertEqual(start, 0)
        self.assertEqual(stop, 19)
        self.assertEqual(per_page, 20)

    def test_get_categories(self):
        '''Test get_categories '''
        res = self.client().get('/categories')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(isinstance(res.json.get('categories'), dict))

    def test_get_questions(self):
        '''Test get_questions '''
        res = self.client().get('/questions')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(isinstance(res.json.get('questions'), list))
        self.assertTrue(isinstance(res.json.get('total_questions'), int))
        self.assertTrue(isinstance(res.json.get('per_page'), int))
        self.assertTrue(res.json.get('page') == 1)
        self.assertTrue(isinstance(res.json.get('categories'), dict))
        self.assertTrue(res.json.get('currentCategory') == None)

    def test_get_questions_page_2(self):
        '''Test get_questions_page_2 '''
        res = self.client().get('/questions?page=2')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(isinstance(res.json.get('questions'), list))
        self.assertTrue(isinstance(res.json.get('total_questions'), int))
        self.assertTrue(isinstance(res.json.get('per_page'), int))
        self.assertTrue(res.json.get('page') == 2)
        self.assertTrue(isinstance(res.json.get('categories'), dict))
        self.assertTrue(res.json.get('currentCategory') == None)

    def test_create_question(self):
        '''Test create_question '''
        test_question = {'question': 'Test Question',
                         'answer': 'Test Answer', 'difficulty': 1, 'category': 1}
        res = self.client().post('/questions', json=test_question)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json.get('id'))
        self.assertEqual(res.json.get('question'),
                         test_question.get('question'))

    def test_create_question_validation(self):
        '''Test create_question validation '''
        test_question = {'question': '', 'answer': ''}
        res = self.client().post('/questions', json=test_question)
        self.assertEqual(res.status_code, 400)
        self.assertTrue(res.json.get('error'))

    def test_delete_question(self):
        '''Test delete_question'''
        test_question = {'question': 'Test Question',
                         'answer': 'Test Answer', 'difficulty': 1, 'category': 1}
        res = self.client().post('/questions', json=test_question)
        id = res.json.get('id')
        resDelete = self.client().delete('/questions/{}'.format(id))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(resDelete.json.get('success'), True)
        self.assertEqual(resDelete.json.get('id'), id)

    def test_delete_question_404(self):
        '''Test delete_question 404'''
        res = self.client().delete('/questions/{}'.format(9999))
        self.assertEqual(res.status_code, 404)

    def test_search_question(self):
        '''Test search_question'''
        search_data = {'searchTerm': 'what'}
        res = self.client().post('/questions/searches', json=search_data)
        self.assertEqual(res.status_code, 200)
        self.assertGreater(len(res.json.get('questions')), 0)

    def test_search_question_none(self):
        '''Test search_question none'''
        search_data = {'searchTerm': 'zzzzzzzzz'}
        res = self.client().post('/questions/searches', json=search_data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json.get('questions')), 0)

    def test_get_categ_questions(self):
        '''Test get_categ_questions '''
        res = self.client().get('/category/1/questions')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(isinstance(res.json.get('questions'), list))
        self.assertTrue(isinstance(res.json.get('total_questions'), int))
        self.assertTrue(isinstance(res.json.get('per_page'), int))
        self.assertTrue(res.json.get('page') == 1)
        self.assertEqual(res.json.get('current_category'), 1)

    def test_get_categ_questions_404(self):
        '''Test get_categ_questions 404 '''
        res = self.client().get('/category/999/questions')
        self.assertEqual(res.status_code, 404)

    def test_quiz_question(self):
        '''Test get_quiz_question'''
        quiz_data = {'quizCategory': None, 'previousQuestions': []}
        res = self.client().post('/quizzes', json=quiz_data)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(isinstance(res.json.get('question'), dict))

    def test_quiz_question_bad_categ(self):
        '''Test get_quiz_question bad categ'''
        quiz_data = {'quizCategory': 999, 'previousQuestions': []}
        res = self.client().post('/quizzes', json=quiz_data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json.get('question'), None)

    def test_quiz_question_categ(self):
        '''Test get_quiz_question bad categ'''
        quiz_data = {'quizCategory': 2, 'previousQuestions': []}
        res = self.client().post('/quizzes', json=quiz_data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json.get('question')['category'], 2)

    def test_quiz_question_random(self):
        '''Test get_quiz_question random'''
        quiz_data = {'quizCategory': None, 'previousQuestions': []}
        res1 = self.client().post('/quizzes', json=quiz_data)
        self.assertEqual(res1.status_code, 200)
        self.assertTrue(res1.json.get('question'))

        res2 = self.client().post('/quizzes', json=quiz_data)
        self.assertEqual(res2.status_code, 200)
        self.assertTrue(res2.json.get('question'))

        id1 = res1.json.get('question')['id']
        id2 = res2.json.get('question')['id']
        self.assertNotEqual(id1, id2)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
