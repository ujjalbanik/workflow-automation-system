# API Design

## Authentication

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/profile

---

## Workflows

GET    /api/workflows/
POST   /api/workflows/
GET    /api/workflows/{id}/
PUT    /api/workflows/{id}/
DELETE /api/workflows/{id}/

---

## Workflow Steps

GET    /api/workflows/{id}/steps/
POST   /api/workflows/{id}/steps/
PUT    /api/steps/{id}/
DELETE /api/steps/{id}/

---

## Triggers

GET    /api/workflows/{id}/trigger/
PUT    /api/workflows/{id}/trigger/

---

## Workflow Execution

POST   /api/workflows/{id}/execute/

---

## Webhooks

POST   /api/webhooks/{workflow_id}/

---

## Workflow Runs

GET    /api/workflows/{id}/runs/
GET    /api/runs/{id}/

---

## Execution Logs

GET    /api/runs/{id}/logs/

---

## Monitoring Dashboard

GET    /api/dashboard/summary/
GET    /api/dashboard/recent-runs/