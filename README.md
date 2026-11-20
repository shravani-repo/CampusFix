# 🏫 CampusFix
### A Better Campus Starts with a Better Way to Report Problems.

**CampusFix** is a smart campus complaint management system designed to simplify communication between students and college administration.

It provides a centralized platform where students can report campus-related issues, track complaint progress, and stay informed about resolutions, while administrators can efficiently manage complaints and prioritize important issues.

> **Report smarter. Resolve faster. Build a better campus.**

<p align="center">
  <a href="https://github.com/shravani-repo/CampusFix">
    <strong>View Repository</strong>
  </a>
</p>

---

## 📌 Problem Statement

Campus infrastructure issues such as damaged classroom equipment, poor Wi-Fi connectivity, electrical problems, and maintenance requirements are often reported through informal communication channels.

This can lead to:
- Delayed complaint handling.
- Lack of transparency.
- Difficulty tracking complaint progress.
- Inefficient communication between students and administration.

CampusFix addresses these challenges through a structured digital complaint management platform.

---

## ✨ Key Features

### 👨‍🎓 Student Portal
- Submit campus-related complaints.
- Provide issue descriptions and details.
- View previously submitted complaints.
- Track complaint status.
- Monitor resolution progress.

### 🛠️ Admin Portal
- View all submitted complaints.
- Manage and prioritize reported issues.
- Update complaint statuses.
- Monitor resolution progress.
- Access complaint analytics.

### 🤖 Smart Priority Detection
- Automatically identifies complaint priority.
- Uses rule-based priority detection in the current demo.
- Helps administrators identify issues requiring attention.

### 📊 Complaint Tracking
- Centralized complaint management.
- Complaint status tracking:
  - Pending
  - Processing
  - Resolved
- Complaint timeline and progress monitoring.

---

## 🖥️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Python |
| Serverless Computing | AWS Lambda |
| API Management | Amazon API Gateway |
| Database | Amazon DynamoDB |
| File Storage | Amazon S3 |
| Workflow Automation | AWS Step Functions |
| Notifications | Amazon SNS |
| Infrastructure as Code | AWS SAM |

---

## 🏗️ System Architecture

CampusFix is designed around a serverless AWS architecture.

```text
             STUDENT / ADMIN
                    |
                    ▼
              REACT FRONTEND
                    |
                    ▼
              API GATEWAY
                    |
                    ▼
               AWS LAMBDA
                    |
          ┌─────────┼──────────┐
          ▼         ▼          ▼
      DynamoDB     S3     Step Functions
          |                    |
          |                    ▼
          |              Priority Detection
          |                    |
          |                    ▼
          |              Complaint Triage
          |                    |
          └─────────┬──────────┘
                    |
                    ▼
                 AWS SNS
               Notifications
```

*Note: This represents the planned AWS backend architecture. The current local demonstration primarily uses mock mode.*

---

## 📂 Project Structure

```text
CampusFix/
│
├── backend/
│   ├── src/
│   │   ├── handlers/
│   │   ├── common.py
│   │   └── priority.py
│   │
│   ├── statemachine/
│   ├── tests/
│   ├── requirements-dev.txt
│   └── template.yaml
│
├── docs/
│   └── ARCHITECTURE.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

Follow these instructions to run CampusFix locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/shravani-repo/CampusFix.git
```

### 2. Navigate to the Project

```bash
cd CampusFix/frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create your local environment file.

**Windows CMD:**

```cmd
copy .env.example .env
```

Update the environment variables according to your configuration.

### 5. Run the Application

```bash
npm run dev
```

Open the local development URL displayed in your terminal. By default, Vite usually uses:

```text
http://localhost:5173
```

---

## 🧪 Demo Mode

CampusFix currently supports a mock-data demonstration mode.

The demo allows users to explore the core application workflows without requiring a live AWS deployment.

Available demonstration features:

- Student login.
- Admin login.
- Complaint submission.
- Rule-based priority detection.
- Complaint status updates.
- Student and admin dashboards.

**Current limitations:**
- Authentication is demonstration-only and is not production-grade.
- Mock data may reset after refreshing the application.
- Full AWS backend integration and deployment are not yet confirmed.

---

## 🧪 Backend Testing

The backend includes Python tests for priority detection and workflow definitions.

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```cmd
venv\Scripts\activate
```

Install development dependencies:

```bash
pip install -r requirements-dev.txt
```

Run tests:

```bash
pytest
```

---

## 🔮 Future Enhancements

- Secure authentication and role-based access control.
- Complete AWS backend integration.
- Real-time complaint notifications.
- Image attachments for complaints.
- Advanced analytics and reporting.
- Complaint history and feedback.
- Improved mobile responsiveness.

---

## 🎯 Project Vision

CampusFix aims to transform traditional campus complaint handling into a more organized, transparent, and efficient digital experience.

By connecting students and administrators through a centralized platform, it helps create a campus environment where problems are easier to report, track, and resolve.

---

## 👩‍💻 Developer

**Shravani Raut**

GitHub: [@shravani-repo](https://github.com/shravani-repo)

Project: [CampusFix](https://github.com/shravani-repo/CampusFix)

---

<p align="center">
  <strong>CampusFix</strong>
  <br>
  Making campus management smarter, one complaint at a time. 🏫
</p>