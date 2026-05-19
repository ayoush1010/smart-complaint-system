# 🛡️ AI-Based Smart Complaint Management System

A full-stack MERN application that allows users to register and track complaints online with AI-powered analysis for priority detection, department recommendation, and automated responses.

## ✨ Features

- **Complaint Registration** — Submit complaints with name, email, title, description, category, and location
- **Complaint Tracking** — View, filter, search, and update complaint status
- **AI-Based Analysis** — Automatic complaint urgency detection, department suggestion, summary, and auto-response
- **JWT Authentication** — Secure login/signup with bcrypt password hashing and protected routes
- **Responsive UI** — Modern dark-themed design with glassmorphism effects

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| AI | Google Gemini API (with smart fallback) |
| Auth | JWT, bcrypt |
| Deployment | Render |

## 📁 Folder Structure

```
smart-complaint-system/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   └── aiController.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── complaints.js
│   │   └── ai.js
│   ├── server.js
│   └── package.json
├── frontend/
│   └── src/
│       ├── api/axios.js
│       ├── components/
│       ├── context/AuthContext.jsx
│       └── pages/
├── render.yaml
└── README.md
```

## 🚀 API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user

### Complaints
- `POST /api/complaints` — Add complaint
- `GET /api/complaints` — Get all complaints
- `GET /api/complaints/:id` — Get single complaint
- `PUT /api/complaints/:id` — Update complaint status
- `DELETE /api/complaints/:id` — Delete complaint
- `GET /api/complaints/search?location=Ghaziabad` — Search by location

### AI
- `POST /api/ai/analyze` — AI-based complaint analysis

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ayoush1010/smart-complaint-system.git
cd smart-complaint-system

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

## ▶️ Running Locally

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
cd frontend && npm run dev
```

## 🌐 Deployment

This project uses a `render.yaml` Blueprint for easy deployment on Render.

## 👤 Author

**Ayoush Bhatnagar** — B.Tech CSE (AIML), 4th Semester
