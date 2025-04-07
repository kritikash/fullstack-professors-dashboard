# Professor Profile Dashboard

A full-stack Angular + Flask web application to visualize detailed academic profiles of professors, including citation trends, publication breakdowns, co-author networks, and publication metadata. Built for an enriched, responsive, and interactive research analytics experience.

---

##  Features

- Dynamic professor profile selector
- Citation trends chart (year-wise)
- Publication breakdown by:
  - Type
  - Language
  - Open Access status
- Co-author network table with chips
- Publication cards with:
  - Metadata (title, authors, journal, citations)
  - Open Access highlighting
- Metrics tab with analytics and bar graphs
- Edit professor info via modal dialog

---

##  Tech Stack

### Frontend
- Angular 17+
- Angular Material
- Chart.js (`ng2-charts`)
- SCSS (custom styling)

### Backend
- Flask (Python)
- Flask-CORS
- REST APIs (JSON)

---

## 📂 Folder Structure
frontend/ ├── app/ │ ├── components/ │ └── services/ ├── assets/ └── styles/ backend/ ├── app.py ├── routes/ └── data/


## Getting Started

1. Clone the repository

git clone https://github.com/your-username/professor-dashboard.git

cd professor-dashboard

 2. Frontend Setup
    
cd frontend
npm install
npm start

3. Backend Setup
   
cd backend
python -m venv venv

source venv/bin/activate  # or venv\Scripts\activate on Windows

pip install -r requirements.txt

python app.py

Runs on: http://localhost:3000

## API Documentation

Option 1: Postman Collection
Download the full collection: https://documenter.getpostman.com/view/43750318/2sB2cVdMJ8

Option 2: API Summary
Base URL : http://localhost:3000/api

### Professor Routes

| Method   | Endpoint           | Description               |
|----------|--------------------|---------------------------|
| `POST`   | `/professors`      | Add multiple professors   |
| `GET`    | `/professors`      | Get all professors        |
| `POST`   | `/professor`       | Add one professor         |
| `GET`    | `/professor/:name` | Get a professor by name   |
| `PUT`    | `/professor/:id`   | Update a professor by ID  |
| `DELETE` | `/professor/:id`   | Delete a professor by ID  |

### Authentication

| Method | Endpoint   | Description          |
|--------|------------|----------------------|
| `POST` | `/auth`    | Authenticate client  |

### Analytics Endpoints

| Method | Endpoint                         | Description                          |
|--------|----------------------------------|--------------------------------------|
| `GET`  | `/analytics/summary`             | Get full analytics summary           |
| `GET`  | `/analytics/citations`           | Get citation trends over time        |
| `GET`  | `/analytics/hindex-distribution` | Get H-index distribution among profs |


