# Job Application & Career Management System

A full-stack web application to manage job applications, companies, application status, and interview schedules in one place.

## Features

- Secure user registration and login using JWT authentication
- Add, edit, and delete companies, applications, and interviews (CRUD)
- Search applications by role or company, and filter by status
- Dashboard with statistics: totals, applications per status, upcoming interviews
- Each user can only see their own data
- Responsive React frontend

## Tech Stack

- **Backend:** Python, Django, Django REST Framework, SimpleJWT
- **Database:** MySQL
- **Frontend:** React.js (Vite), React Router, Axios

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/register/ | Create an account |
| POST | /api/token/ | Login, returns JWT tokens |
| GET | /api/dashboard/ | Dashboard statistics |
| CRUD | /api/companies/ | Manage companies |
| CRUD | /api/applications/ | Manage applications (supports `?search=` and `?status=`) |
| CRUD | /api/interviews/ | Manage interviews |

## Setup

### Prerequisites

Python 3.10+, Node.js, MySQL 8.0+

### 1. Database

Create an empty database in MySQL:

```sql
CREATE DATABASE job_tracker CHARACTER SET utf8mb4;
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your own values (secret key and MySQL password). Then run:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API runs at http://127.0.0.1:8000/api/

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173

## Author

Nithish Benadict S N - [GitHub](https://github.com/Nithishbenadict)