# Trivia App - Udacity Fullstack Nanodegree

## Run locally

1. Clone repo
2. cd into `backend`
3. init virtual env: `python3 -m venv env`
4. activate venv: `source ./env/bin/activate`
5. install backend dependencies: `python3 -m pip install -r requirements.txt`
6. start postgres container: `docker-compose up -d`
7. seed the database: `sh boot.sh db-seed`
8. start flask: `sh boot.sh dev`
9. cd out of `backend` and into `frontend`
10. install frontend dependencies: `npm run install`
11. start frontend: `npm run start`

## Run tests

1. seed test db: `sh boot.sh db-test-seed`
2. run tests: `sh boot.sh test`

## API Endpoints

`GET /questions`  
Get list of questions, paginated

**Request Params**

- `page`: `int`

**Response JSON**

```js
{
  "questions": [] // list of question DTOs
  "total_questions": int // total questions in db
  "per_page": int // page size
  "page": int // page returned
  "categories": {} // dict of 'id': 'title' pairs
  "current_category": null // always null
}
```

---

`POST /questions`  
Create a question in the db

**Request Params**

- _No query params supported_

**Request Body (JSON)**

```js
{
  "question": string // the question to be asked
  "answer": string // the correct answer
  "category": int // the category id the question belongs to
  "difficulty": int // the difficulty level [1 - 5]
}
```

**Response JSON**

```js
{
  // See Question DTO
}
```

---

`DELETE /questions/<id>`  
Delete a question from the db

**Request Params**

- _No query params supported_

**Response JSON**

```js
{
  "success": boolean
  "id": int // id of question deleted
}
```

---

`POST /questions/searches`  
Search questions by 'question' content

**Request Params**

- _No query params supported_

**Request Body (JSON)**

```js
{
  "searchTerm": string // the text entered by the user
  "categoryId": int // narrow search to questions of this category
}
```

**Response JSON**

```js
{
  "questions": [] // list of question DTOs
}
```

---

`GET /categories`  
Get all categories in the system.

**Request Params**

- _No query params supported_

**Response JSON**

```js
{
  "categories": {} // dict of 'id': 'title' pairs
}
```

---

`GET /category/<id>/questions`  
Get list of questions, paginated and belonging to specified category

**Request Params**

- `page`: `int`

**Response JSON**

```js
{
  "questions": [] // list of question DTOs
  "total_questions": int // total questions in db
  "per_page": int // page size
  "page": int // page returned
  "current_category": int // id of cagtegory specified
}
```

---

`POST /quizzes`  
Get next question for quiz

**Request Params**

- _No query params supported_

**Request Body (JSON)**

```js
{
  "previousQuestions": [] // list of question ids already answered
  "quizCategory": int // narrow search to questions of this category
}
```

**Response JSON**

```js
{
  "question": {} || null // question DTO or null if no more questions exist
}
```

---

## DTOs - Data Transfer Objects

```js
// Question DTO
{
  "id": int // id of the created question
  "question": string // the question to be asked
  "answer": string // the correct answer
  "category": int // the category id the question belongs to
  "difficulty": int // the difficulty level [1 - 5]
}
```

---

## Full Stack Trivia

Udacity is invested in creating bonding experiences for its employees and students. A bunch of team members got the idea to hold trivia on a regular basis and created a webpage to manage the trivia app and play the game, but their API experience is limited and still needs to be built out.

That's where you come in! Help them finish the trivia app so they can start holding trivia and seeing who's the most knowledgeable of the bunch. The application must:

1. Display questions - both all questions and by category. Questions should show the question, category and difficulty rating by default and can show/hide the answer.
2. Delete questions.
3. Add questions and require that they include question and answer text.
4. Search for questions based on a text query string.
5. Play the quiz game, randomizing either all questions or within a specific category.

Completing this trivia app will give you the ability to structure plan, implement, and test an API - skills essential for enabling your future applications to communicate with others.

## Tasks

There are `TODO` comments throughout project. Start by reading the READMEs in:

1. [`./frontend/`](./frontend/README.md)
2. [`./backend/`](./backend/README.md)

We recommend following the instructions in those files in order. This order will look familiar from our prior work in the course.

## Starting and Submitting the Project

[Fork](https://help.github.com/en/articles/fork-a-repo) the [project repository]() and [Clone](https://help.github.com/en/articles/cloning-a-repository) your forked repository to your machine. Work on the project locally and make sure to push all your changes to the remote repository before submitting the link to your repository in the Classroom.

## About the Stack

We started the full stack application for you. It is desiged with some key functional areas:

### Backend

The `./backend` directory contains a partially completed Flask and SQLAlchemy server. You will work primarily in app.py to define your endpoints and can reference models.py for DB and SQLAlchemy setup.

### Frontend

The `./frontend` directory contains a complete React frontend to consume the data from the Flask server. You will need to update the endpoints after you define them in the backend. Those areas are marked with TODO and can be searched for expediency.

Pay special attention to what data the frontend is expecting from each API response to help guide how you format your API.

[View the README.md within ./frontend for more details.](./frontend/README.md)
