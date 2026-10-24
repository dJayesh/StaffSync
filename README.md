# StaffSync — Human Resource Management System

A full-stack **MERN-based Human Resource Management System (HRMS)** designed to simplify employee management and everyday HR operations through a centralized, user-friendly dashboard.

## 🌐 Live Demo
**Live Application:** https://staff-sync-ivory.vercel.app/
**Backend:** https://staffsync-h09t.onrender.com

> Note: The frontend uses Vercel, the backend runs on Render, and MongoDB Atlas provides cloud database storage.

## ✨ Features
- 🔐 **Authentication** — User registration and login with JWT-based authentication.
- 👥 **Role-Based Access** — Dedicated roles for HR, Managers, and Employees.
- 🧑‍💼 **Employee Management** — Manage employee information and records.
- 📅 **Attendance Management** — Track employee attendance.
- 📝 **Leave Management** — Submit and manage leave requests.
- 📢 **Announcements** — Share important organizational updates.
- 🎓 **Training Programs** — Manage employee training activities.
- 📊 **Dashboard** — Access HR information through a centralized interface.
- 📱 **Responsive UI** — A user-friendly interface for different screen sizes.

## 🛠️ Tech Stack
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Express.js | Backend framework |
| React.js | Frontend library |
| Node.js | Backend runtime |
| JWT | Authentication |
| Vite | Frontend build tool |
| CSS | Styling and responsive design |
| Git & GitHub | Version control |
| Render | Backend deployment |
| Vercel | Frontend deployment |

## 👤 User Roles
| Role | Description |
|---|---|
| HR | HR operations and employee management |
| Manager | Manager-specific employee operations |
| Employee | Employee-facing features |

*Access permissions depend on the application's configured role-based authorization.*


## 📁 Project Structure

```text
StaffSync/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/                 # Node.js + Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started
Follow these steps to run StaffSync locally.

### Prerequisites
- Node.js and npm
- MongoDB local instance or MongoDB Atlas
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/dJayesh/StaffSync.git
cd StaffSync
```
### 2. Set Up the Backend
```bash
cd server
npm install
```
Create a `.env` file inside the `server` directory:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```
Replace the example values with your own configuration. Use a strong, randomly generated JWT secret.
Start the backend using the appropriate script from `server/package.json`. For example:
```bash
npm start
```

### 3. Set Up the Frontend
Open a second terminal in the project directory:
```bash
cd client
npm install
```
Create or update the frontend environment file, if required by the application:

```env
VITE_API_URL=http://localhost:8000/api
```
Start the frontend:

```bash
npm run dev
```
Open the local development URL displayed in the terminal.

## ☁️ Deployment Architecture

StaffSync uses the following deployment setup:
| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend API | Render |
| Database | MongoDB Atlas |
For production, configure the frontend API URL to use the deployed backend. Set database credentials and the JWT secret through Render's environment variables.

## 🔒 Security

- Never commit `.env` files or database credentials to GitHub.
- Use a strong, unique JWT secret in production.
- Configure backend CORS to allow the intended frontend origin.
- Keep production credentials private.
- Avoid running database seed scripts against a production database containing real data.

## 🎯 Project Objective
StaffSync aims to streamline routine HR operations by bringing employee records, attendance, leave requests, announcements, and training programs into a single web application.

## 👨‍💻 Developer

**Jayesh Deshmukh**


⭐ If you find this project useful, consider giving the repository a star!
