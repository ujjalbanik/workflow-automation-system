# Distributed Workflow Automation System

## Overview

This project is a backend workflow automation platform inspired by tools like Zapier and n8n.

A workflow is executed when a trigger occurs.

Example:

User Registered
    ↓
Check Condition
    ↓
Send Welcome Email
    ↓
Log Execution
    ↓
Finish

---

## Technology Stack

Backend
- Python
- Django
- Django REST Framework

Database
- PostgreSQL

Queue
- Redis

Background Processing
- Celery

Authentication
- JWT

Deployment
- Docker

---

## High-Level Architecture

Client
    │
    ▼
Django REST API
    │
    ▼
Workflow Engine
    │
    ▼
Redis Queue
    │
    ▼
Celery Worker
    │
    ▼
Action Execution
    │
    ▼
PostgreSQL

---

## Core Components

- Authentication
- Workflow Management
- Trigger System
- Workflow Engine
- Background Workers
- Execution Logging
- Monitoring Dashboard

---

## Project Goals

- Production-style architecture
- Async task processing
- Modular design
- Scalable backend
- Clean separation of responsibilities