# Phoneme Activity Builder

Phoneme Activity Builder is a web application designed to help teachers create phoneme-based learning activities for students.

The application currently supports two activity types:

- Wordle-style phoneme activities
- Word Search activities

The project was originally developed as a frontend application for Assessment 1 and has been extended for Assessment 2 with a backend API, PostgreSQL database, Prisma ORM, CRUD functionality, validation, and Docker support.

## Student Information

**Name:** Kim Long Hoang  
**Student ID:** 22666484

## Project Architecture

The application is divided into three main services:

1. **Frontend** - Next.js user interface
2. **API** - Next.js REST API
3. **Database** - PostgreSQL database

The application uses Prisma ORM to communicate between the API and PostgreSQL.

```
Browser
   |
   |-- http://localhost
   |        |
   |        v
   |   Frontend
   |
   |-- http://localhost:4080
            |
            v
           API
            |
            v
          Prisma
            |
            v
        PostgreSQL
```

## Technologies

- Next.js
- React
- JavaScript
- Node.js
- PostgreSQL
- Prisma ORM
- Docker
- Docker Compose
- Git and GitHub

## Project Structure

```
phoneme-builder/
|
|-- frontend/
|   |-- src/
|   |-- public/
|   |-- Dockerfile
|   |-- package.json
|
|-- api/
|   |-- app/
|   |   |-- api/
|   |   |   |-- activities/
|   |   |   |-- word-lists/
|   |   |   `-- words/
|   |   `-- health/
|   |
|   |-- lib/
|   |-- prisma/
|   |   |-- migrations/
|   |   `-- schema.prisma
|   |
|   |-- Dockerfile
|   `-- package.json
|
|-- docker-compose.yml
`-- README.md
```

## Main Features

### Wordle

Teachers can:

- Enter a phoneme word and its English equivalent
- Select a difficulty level
- Configure hints
- Configure the number of guesses
- Save activity configurations
- Load previously saved activities
- Update saved activities
- Delete saved activities
- Generate a standalone HTML activity

### Word Search

Teachers can:

- Enter phoneme words and English equivalents
- Select a grid size
- Select a difficulty level
- Regenerate the puzzle grid
- Save the generated puzzle
- Load previously saved puzzles
- Update saved activities
- Delete saved activities
- Generate a standalone HTML activity

The generated puzzle configuration is stored in the database so that a saved Word Search can restore the same generated grid.

## Database

PostgreSQL is used to store the application data.

The main data models are:

- WordList
- Word
- Phoneme
- Activity

Phonemes are stored separately from words so that each word can contain multiple phoneme symbols and each phoneme can have a defined position.

Activities store configuration information such as:

- Activity name
- Activity type
- Difficulty
- Hint setting
- Number of guesses
- Grid size
- Word Search puzzle data
- Associated word list
- Associated Wordle word

Prisma is used to manage the database schema, relationships, and migrations.

## API

The backend provides REST API routes for managing the application data.

### Word Lists

```
GET    /api/word-lists
POST   /api/word-lists
PATCH  /api/word-lists?id={id}
DELETE /api/word-lists?id={id}
```

### Words and Phonemes

```
GET    /api/words
GET    /api/words?wordListId={id}
POST   /api/words
PATCH  /api/words?id={id}
DELETE /api/words?id={id}
```

### Activities

```
GET    /api/activities
GET    /api/activities?type=WORDLE
GET    /api/activities?type=WORD_SEARCH
POST   /api/activities
PATCH  /api/activities?id={id}
DELETE /api/activities?id={id}
```

## Health Check

The API provides a health endpoint:

```
GET /health
```

When the API and database are working correctly, it returns a successful response showing that the database is connected.

When running with Docker, the endpoint is available at:

```
http://localhost:4080/health
```

## Running the Application with Docker

### Requirements

Install:

- Docker Desktop
- Git

### Start the Application

From the root project directory run:

```bat
docker compose up -d --build
```

Docker Compose starts:

```
Frontend     http://localhost
API          http://localhost:4080
PostgreSQL   localhost:5432
```

Open the application in a browser:

```
http://localhost
```

Check the API health endpoint:

```
http://localhost:4080/health
```

### Check Running Containers

```
docker compose ps
```

### View Logs

```
docker compose logs
```

To view only the API logs:

```
docker compose logs api
```

### Stop the Application

```
docker compose down
```

The PostgreSQL data is stored in a Docker named volume, so normal `docker compose down` does not remove the saved database data.

## Docker Database Startup

PostgreSQL includes a Docker health check.

The API waits for PostgreSQL to become healthy before starting.

When the API container starts, it automatically runs:

```
npx prisma migrate deploy --config prisma7.config.ts
```

This applies any pending Prisma migrations before the Next.js API starts.

## Local Development

The frontend and API can also be run outside Docker.

### Start PostgreSQL

PostgreSQL can remain running through Docker:

```
docker compose up -d postgres
```

### Start the API

Open a terminal:

```
cd api
npm install
npm run dev -- -p 4080
```

The API will be available at:

```
http://localhost:4080
```

### Start the Frontend

Open another terminal:

```
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```
http://localhost:3000
```

## Validation and Error Handling

The API validates incoming data before storing it.

Examples include:

- Activity names cannot be empty
- English words cannot be empty
- At least one valid phoneme is required
- Word lists must exist before words are created
- Activity type must be WORDLE or WORD_SEARCH
- Difficulty must be EASY, MEDIUM, or HARD
- Wordle guess limits are validated
- Word Search grid sizes are validated

API errors are returned to the frontend and displayed to the user where appropriate.

## Data Persistence

PostgreSQL data is stored using the Docker named volume:

```
postgres_data
```

This allows saved activities, words, phonemes, and word lists to remain available after the containers are stopped and restarted.

## Generated Activities

The frontend retrieves saved activity data from the backend before generating downloadable standalone HTML activities.

This ensures that saved backend data is used as the source for generated Wordle and Word Search activities.

## Git Development

Assessment 2 development is performed on the branch:

```
assessment-2-backend
```

Git commits are used to record meaningful development milestones such as database setup, CRUD APIs, frontend integration, validation, and Docker configuration.