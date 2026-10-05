# Phoneme Activity Builder

Phoneme Activity Builder is a web application designed to help teachers create, save, manage, and generate phoneme-based learning activities for students.

The application supports two activity types:

- Wordle-style phoneme activities
- Word Search activities

The project was originally developed as a frontend application for Assessment 1. Assessment 2 extended the application with a backend API, PostgreSQL database, Prisma ORM, CRUD functionality, validation, and Docker support. Assessment 3 extends the system with reporting, usage monitoring, operational alerts, cloud deployment, automated end-to-end testing, load testing, and accessibility testing.

## Student Information

**Name:** Kim Long Hoang  
**Student ID:** 22666484

## Project Architecture

The application is divided into three main services:

1. **Frontend** - Next.js user interface
2. **API** - Next.js REST API
3. **Database** - PostgreSQL database

Prisma ORM is used by the API to communicate with PostgreSQL.

```text
Browser
   |
   v
Frontend
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

Docker Compose is used to run the frontend, API, and PostgreSQL services together.

## Technologies

- Next.js
- React
- JavaScript
- Node.js
- PostgreSQL
- Prisma ORM
- Docker
- Docker Compose
- AWS EC2
- Playwright
- Apache JMeter
- Google Lighthouse
- Git and GitHub

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
- Save generated puzzles
- Load previously saved puzzles
- Update saved activities
- Delete saved activities
- Generate a standalone HTML activity

The generated Word Search puzzle configuration is stored in the database so that a saved activity can restore the same generated grid.

## Activity Overview Dashboard

Assessment 3 introduces an Activity Overview dashboard for reporting and monitoring application usage.

The dashboard displays:

- API status
- Database connection status
- Number of saved Wordle activities
- Number of saved Word Search activities
- Wordle HTML generation usage
- Word Search HTML generation usage
- Most generated activity type
- Average time on page
- Successful HTML generations
- Failed HTML generations
- Operational alerts
- Recently stored activities
- Total number of saved activities

The dashboard retrieves live data from the backend rather than using hard-coded reporting values.

## Usage Monitoring and Observability

The application records usage and monitoring information in PostgreSQL.

A `UsageEvent` model is used to record events including:

- Page views
- Activity usage
- HTML generation attempts
- Simulated input events

Usage events can contain information such as:

- Event type
- Activity type
- Page
- Duration
- Success or failure status
- Message
- Creation time

Wordle and Word Search generation actions record successful and failed generation attempts.

Page duration events are also recorded so that average time on page can be reported.

## Operational Alerts

The Activity Overview includes operational status information.

The monitoring system checks for conditions such as:

- Failed activity generations
- Empty stored activity data
- API availability
- Database connectivity

When no monitored problems are detected, the dashboard displays that the system is operating normally.

Failed generation events can be stored and reported through the monitoring system so that unusual application behaviour can be identified.

## Database

PostgreSQL is used to persist application and monitoring data.

The main data models include:

- WordList
- Word
- Phoneme
- Activity
- UsageEvent

Phonemes are stored separately from words so that each word can contain multiple phoneme symbols with defined positions.

Activities store configuration information including:

- Activity name
- Activity type
- Difficulty
- Hint setting
- Number of guesses
- Grid size
- Word Search puzzle data
- Associated word list
- Associated Wordle word
- Creation metadata

The database also stores usage information used by the reporting and observability features.

Prisma is used to manage the database schema, relationships, queries, and migrations.

## API

The backend provides REST API routes for application data and monitoring.

### Word Lists

```text
GET    /api/word-lists
POST   /api/word-lists
PATCH  /api/word-lists?id={id}
DELETE /api/word-lists?id={id}
```

### Words and Phonemes

```text
GET    /api/words
GET    /api/words?wordListId={id}
POST   /api/words
PATCH  /api/words?id={id}
DELETE /api/words?id={id}
```

### Activities

```text
GET    /api/activities
GET    /api/activities?type=WORDLE
GET    /api/activities?type=WORD_SEARCH
POST   /api/activities
PATCH  /api/activities?id={id}
DELETE /api/activities?id={id}
```

### Usage Events

```text
GET    /api/usage-events
POST   /api/usage-events
```

## Health Check and Metrics

The API provides a health endpoint:

```text
GET /health
```

The endpoint reports API and database status and provides reporting metrics used by the Activity Overview.

Metrics include:

- Saved Wordle activities
- Saved Word Search activities
- Wordle generation usage
- Word Search generation usage
- Most generated activity type
- Successful generations
- Failed generations
- Average time on page

When running with Docker locally, the endpoint is available at:

```text
http://localhost:4080/health
```

## Data Persistence

PostgreSQL data is stored using the Docker named volume:

```text
postgres_data
```

This allows saved activities, words, phonemes, word lists, and usage events to remain available after containers are stopped and restarted.

## Validation and Error Handling

The API validates incoming data before storing it.

Validation includes:

- Activity names cannot be empty
- English words cannot be empty
- At least one valid phoneme is required
- Word lists must exist before words are created
- Activity type must be WORDLE or WORD_SEARCH
- Difficulty must be EASY, MEDIUM, or HARD
- Wordle guess limits are validated
- Word Search grid sizes are validated

API errors are returned to the frontend and displayed to the user where appropriate.

The health endpoint also returns an appropriate unavailable status if the database health check fails.

## Generated Activities

The application can generate standalone HTML versions of Wordle and Word Search activities.

Saved backend data can be loaded before generation so that persisted activity configuration is used by the generated activity.

Generation attempts are monitored so that successful and failed generations can contribute to the reporting and operational monitoring system.

## Automated End-to-End Testing

Playwright is used for automated end-to-end testing.

The automated tests cover two important workflows.

### Builder CRUD Workflow

The Wordle builder test:

1. Creates a Wordle activity
2. Saves it
3. Loads the saved activity
4. Updates its configuration
5. Confirms the updated values
6. Deletes the activity

### Generated Activity Workflow

The user workflow test:

1. Creates and saves a Wordle activity
2. Loads the saved activity
3. Generates the standalone HTML activity
4. Confirms that the HTML file is downloaded
5. Deletes the test activity

The final Playwright test run completed successfully with:

```text
2 passed
```

## Load Testing

Apache JMeter was used to test application behaviour under increasing concurrent traffic.

The load test contains four requests:

1. Open Wordle Builder
2. Check API Health
3. Get Stored Activities
4. Open Activity Overview

Each simulated user performs all four requests.

The final staged results were:

| Users | Samples | Average Response Time | Maximum Response Time | Error Rate | Throughput |
|------:|--------:|----------------------:|----------------------:|-----------:|-----------:|
| 10 | 40 | 426 ms | 543 ms | 0% | 15.45 requests/sec |
| 20 | 80 | 426 ms | 536 ms | 0% | 30.02 requests/sec |
| 30 | 120 | 431 ms | 574 ms | 0% | 44.64 requests/sec |
| 40 | 160 | 434 ms | 566 ms | 0% | 58.61 requests/sec |
| 50 | 200 | 430 ms | 548 ms | 0% | 74.63 requests/sec |
| 100 | 400 | 489 ms | 777 ms | 0% | 137.17 requests/sec |
| 200 | 800 | 710 ms | 1621 ms | 0% | 200.70 requests/sec |

The tests used a 1-second ramp-up period and one loop at each traffic level.

Performance remained relatively stable between 10 and 50 users. Initial performance degradation became visible at 100 users. At 200 users, average response time increased to 710 ms and the maximum response time reached 1621 ms.

All 800 requests at the 200-user level completed successfully with a 0% error rate.

At 200 users, the API-related requests showed greater response times than the frontend page requests:

| Request | Average Response Time | Maximum Response Time | Error Rate |
|---|---:|---:|---:|
| Open Wordle Builder | 488 ms | 538 ms | 0% |
| Check API Health | 1182 ms | 1621 ms | 0% |
| Get Stored Activities | 925 ms | 1188 ms | 0% |
| Open Activity Overview | 247 ms | 298 ms | 0% |

The results show that backend/API processing experienced greater performance pressure at the highest tested traffic level, while all tested requests continued to complete successfully.

## Accessibility Testing

Google Lighthouse was used to perform automated accessibility audits on key application pages using the Desktop configuration.

Results:

| Page | Accessibility Score |
|---|---:|
| Wordle Builder | 100/100 |
| Word Search Builder | 100/100 |
| Activity Overview | 100/100 |

All three tested pages passed the automated Lighthouse accessibility checks with a score of 100.

A Lighthouse score of 100 represents the result of the automated checks performed and does not replace manual accessibility evaluation.

## AWS Deployment

Assessment 3 was deployed to an AWS EC2 instance.

The cloud deployment runs the same Docker-based architecture:

```text
Internet
   |
   v
AWS EC2
   |
   +-- Frontend container
   |
   +-- API container
   |
   `-- PostgreSQL container
```

The public deployment is configured so that:

- The frontend is served through HTTP
- The API is available on port 4080
- PostgreSQL is not publicly exposed through the AWS security group
- Docker services automatically use the PostgreSQL persistent volume
- Database migrations are applied during API startup

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

```text
Frontend     http://localhost
API          http://localhost:4080
PostgreSQL   localhost:5432
```

Open the application:

```text
http://localhost
```

Check the API health endpoint:

```text
http://localhost:4080/health
```

### Check Running Containers

```bat
docker compose ps
```

### View Logs

```bat
docker compose logs
```

To view only the API logs:

```bat
docker compose logs api
```

### Stop the Application

```bat
docker compose down
```

Normal `docker compose down` does not delete the PostgreSQL named volume.

## Docker Database Startup

PostgreSQL includes a Docker health check.

The API waits for PostgreSQL to become healthy before starting.

When the API container starts, it automatically runs:

```text
npx prisma migrate deploy --config prisma7.config.ts
```

This applies pending Prisma migrations before the Next.js API starts.

## Local Development

The frontend and API can also be run outside Docker.

### Start PostgreSQL

```bat
docker compose up -d postgres
```

### Start the API

```bat
cd api
npm install
npm run dev -- -p 4080
```

The API will be available at:

```text
http://localhost:4080
```

### Start the Frontend

Open another terminal:

```bat
cd frontend
npm install
npm run dev
```

The frontend development server will be available at:

```text
http://localhost:3000
```

## Git Development

Assessment 3 development is performed on the branch:

```text
assessment-3-dashboard
```

Assessment 2 remains preserved on:

```text
assessment-2-backend
```
