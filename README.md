# Restaurant Management System – Frontend

A modern and responsive Restaurant Management System frontend built with React.js and Vite. It provides authentication, role-based dashboards, and management interfaces for users and menus.

## Technologies Used

- React.js
- Vite
- JavaScript (ES6+)
- HTML5
- CSS3
- Bootstrap
- AdminLTE
- Axios
- React Router DOM
- Bootstrap Icons
- Laravel REST API
- Laravel Sanctum Authentication

## Features

### Authentication
- User Registration
- User Login and Logout
- Email Verification
- Forgot Password
- Reset Password
- Google Login
- Facebook Login
- Protected Routes

### Dashboard
- Role-based dashboard
- Admin and User access
- Dashboard statistics
- Responsive AdminLTE layout

### User Management (Admin)
- View users
- Create new users
- Edit user details
- Soft delete users
- View deleted users
- Restore deleted users

### Menu Management
- View menus
- Add new menus (Admin)
- Edit menus (Admin)
- Delete menus (Admin)
- View deleted menus (Admin)
- Restore deleted menus (Admin)
- Users can view menus only

### Security
- Laravel Sanctum Bearer Token Authentication
- Protected frontend routes
- Role-based UI permissions
- API integration using Axios
- Secure OAuth login flow

## Project Structure

```text
restaurant-frontend/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── menus/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/emashahzad/restaurant-management-frontend.git
```

### 2. Navigate to Project Folder

```bash
cd restaurant-management-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Make sure the Laravel backend is running and CORS is configured for the frontend URL.

### 5. Start Development Server

```bash
npm run dev
```

Open the local URL provided by Vite, usually:

```text
http://localhost:5173
```

## Backend API

This frontend communicates with the Laravel REST API backend.

**Backend Repository:**  
https://github.com/emashahzad/restaurant-management-backend

## Developer

**Ema Shahzad**

BS Computer Science | Full Stack Web Development

GitHub: https://github.com/emashahzad

---

*Developed as a full-stack Restaurant Management System project using React.js and Laravel.*