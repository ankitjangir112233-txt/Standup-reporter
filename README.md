# Standup Reporter

A full-stack automation tool that eliminates manual daily standups for tech startups. Team members submit their updates through a web form, and the system automatically emails a formatted summary to the entire team.

---

## The Problem

Every tech startup runs daily standups. Most teams do this manually — someone messages teammates on Slack, waits for replies, writes a summary, and emails it. This wastes 15–30 minutes every single day.

## The Solution

Standup Reporter automates the entire workflow. Team members fill a simple form, and the admin receives a formatted summary email with one click — no manual work required.

---

## Features

- JWT based authentication with role based access (admin / member)
- Members submit daily standup via a clean form
- Double submission prevention — one update per person per day
- Admin dashboard to view all standups filtered by date or member
- Blockers highlighted in red on the dashboard
- Who hasn't submitted today section for admins
- One click summary email to the whole team
- One click reminder emails to members who haven't submitted
- Automated cron job that fires at 9 AM daily

---

## Screenshots

### Login
![Login](screenshots/1-login.png)

### Register
![Register](screenshots/2-register.png)

### Daily Standup Form
![Submit Form](screenshots/3-submit-form.png)

### Success Page
![Success](screenshots/4-success-page.png)

### Admin Dashboard
![Dashboard](screenshots/5-dashboard.png)

### Blockers Highlighted
![Blockers](screenshots/6-blockers.png)

### Email Summary
![Email](screenshots/7-email-summary.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Email | Nodemailer, Gmail |
| Scheduler | node-cron |

---

## Project Structure

standup-reporter/
├── Backend/
│   ├── Config/
│   │   └── db.js
│   ├── Models/
│   │   ├── User.js
│   │   └── Update.js
│   ├── Routes/
│   │   ├── auth.js
│   │   └── updates.js
│   ├── Middleware/
│   │   └── auth.js
│   ├── Services/
│   │   └── emailService.js
│   ├── scheduler.js
│   └── server.js
└── Frontend/
    └── frontend/
        └── src/
            ├── pages/
            │   ├── Login.jsx
            │   ├── Register.jsx
            │   ├── Submit.jsx
            │   ├── Success.jsx
            │   └── Dashboard.jsx
            └── components/
                ├── Navbar.jsx
                └── ProtectedRoute.jsx

---

## How to Run Locally

### Backend

cd Backend
npm install

Create a .env file in the Backend folder:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
TEAM_EMAIL=team@company.com

node server.js

### Frontend

cd Frontend/frontend
npm install
npm start

---

## API Routes

| Method | Route | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login, returns JWT |
| POST | /api/updates | Member | Submit standup |
| GET | /api/updates | Admin | Get all standups |
| GET | /api/updates/today | Admin | Get today's standups |
| GET | /api/updates/mine | Member | Check if submitted today |
| POST | /api/updates/send-summary | Admin | Send summary email |
| POST | /api/updates/send-reminders | Admin | Send reminder emails |

---

## What I Learned

- Building a full REST API with Node.js and Express
- JWT authentication with role based access control
- MongoDB data modeling with Mongoose
- Automating emails with Nodemailer and Gmail
- Scheduling tasks with node-cron
- Connecting a React frontend to a Node.js backend
- Handling CORS, protected routes, and form validation

---

Built by Ankit Jangir