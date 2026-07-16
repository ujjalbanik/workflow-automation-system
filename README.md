# 🚀 Workflow Automation System

A modern Workflow Automation Platform built as an MCA Final Year Project, inspired by tools like **n8n**, **Zapier**, and **Make.com**. The application enables users to create, manage, and execute multi-step automation workflows while demonstrating asynchronous task processing using Celery and Redis.

---

## 📖 Overview

Workflow Automation System allows users to define workflows consisting of multiple sequential steps such as sending emails, waiting for a specified duration, and making HTTP requests. The backend executes these workflows asynchronously using Celery workers, while the frontend provides a modern SaaS-style interface with live execution monitoring and analytics.

This project demonstrates concepts such as:

* Workflow Orchestration
* Asynchronous Task Processing
* REST API Architecture
* Background Job Queues
* Event-driven Execution
* Execution Monitoring
* Modern Responsive UI Design

---

## ✨ Features

### 🔐 Authentication

* User Registration
* Email OTP Verification
* Secure Login
* JWT Authentication
* Protected Routes

---

### ⚙️ Workflow Management

* Create Workflow
* Edit Workflow
* Delete Workflow
* View Workflow Details
* Execute Workflow
* Enable/Disable Workflows

---

### 🧩 Workflow Steps

Supported workflow steps include:

* 📧 Send Email
* ⏳ Wait (Delay)
* 🌐 HTTP Request

Each workflow can contain multiple ordered steps that are executed sequentially.

---

### ⚡ Live Workflow Execution

* Real-time execution updates using API polling
* Live step-by-step status updates
* Animated execution progress
* Progress bar
* Current running step highlighting
* Automatic polling stop after completion

---

### 📜 Execution Timeline

* Animated vertical timeline
* Step execution history
* Timestamp tracking
* Success, Running, Failed and Pending indicators
* Smooth Framer Motion animations

---

### 📊 Dashboard Analytics

Modern dashboard with:

* Total Workflows
* Active Workflows
* Total Executions
* Success Rate
* Failed Executions
* Average Runtime
* Execution Trend Chart
* Status Distribution Chart
* Recent Executions
* Activity Feed

---

### 📄 Execution Details

Detailed execution monitoring including:

* Execution Metadata
* Runtime Information
* Timeline
* Execution Logs
* JSON Payload Viewer
* Copy JSON Button
* Download Logs

---

### 🎨 Modern UI

* SaaS-inspired design
* Responsive Layout
* Smooth Page Transitions
* Loading Skeletons
* Toast Notifications
* Reusable Components
* Beautiful Confirmation Dialogs
* Mobile Friendly

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* React Router
* Tailwind CSS
* Framer Motion
* Lucide React
* React Hot Toast
* Recharts

### Backend

* Django
* Django REST Framework
* Celery
* Redis
* PostgreSQL

---

## 🏗 System Architecture

```text
                React Frontend
                      │
                      ▼
            Django REST Framework API
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
 PostgreSQL Database          Celery Worker
                                      │
                                      ▼
                                 Redis Queue
                                      │
                                      ▼
                            Workflow Execution
```

---

## 📂 Project Structure

```text
workflow-automation-system/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   ├── authentication/
│   ├── workflows/
│   ├── executions/
│   ├── workers/
│   ├── config/
│   └── manage.py
│
└── README.md
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/your-username/workflow-automation-system.git
cd workflow-automation-system
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run migrations

```bash
python manage.py migrate
```

Start Django

```bash
python manage.py runserver
```

---

## Redis

Start Redis server

```bash
redis-server
```

---

## Celery

Run Celery worker

```bash
celery -A config worker -l info
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Workflow Execution Example

```text
Workflow

↓

Send Email

↓

Wait 10 Seconds

↓

HTTP Request

↓

Completed
```

---

## Screenshots

Add screenshots here.

* Login Page
* Dashboard
* Workflow List
* Create Workflow
* Workflow Details
* Live Execution
* Execution Timeline
* Dashboard Analytics
* Execution Details

---

## Learning Outcomes

This project demonstrates practical implementation of:

* React Frontend Development
* Django REST APIs
* JWT Authentication
* Background Task Processing
* Celery Workers
* Redis Queue Management
* PostgreSQL Integration
* Workflow Orchestration
* RESTful Architecture
* Responsive UI/UX Design
* Component-based Development
* State Management
* Data Visualization

---

## Future Enhancements

* Drag-and-Drop Workflow Builder
* Workflow Templates
* Scheduled Workflows
* WebSocket-based Live Updates
* Role-Based Access Control
* Team Collaboration
* Workflow Versioning
* File Processing Steps
* Webhook Triggers
* External Service Integrations

---

## Author

**Ujjal Banik**

MCA Final Year Project

---

## License

This project was developed for educational purposes as part of the Master of Computer Applications (MCA) curriculum.
