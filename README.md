# Deployed

A job application tracker. Log the roles you've applied to, track their status, and attach your resume to each application. Built with a React + Vite frontend and an Express + MongoDB backend, with Supabase for authentication and resume storage.

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Tailwind CSS
- Supabase JS (auth) + Axios (API calls)

**Backend**
- Express 5
- MongoDB (Mongoose)
- Supabase (auth verification + Storage for resume uploads)
- Multer (file handling)

## Project Structure

```
deployed/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Layout, ProtectedRoute, StatusBadge
│       ├── context/      # AuthContext
│       ├── lib/          # api.js (axios), supabase.js
│       └── pages/        # Dashboard, Applications, Login, etc.
└── server/          # Express API
    ├── models/      # Application model
    ├── routes/      # applications, upload
    └── middleware/  # Supabase auth
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or Atlas)
- A Supabase project (for auth + storage)

### 1. Clone and install

```bash
git clone https://github.com/DhritiVaz/deployed.git
cd deployed

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Configure environment variables

Copy the example files and fill in your own values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**`server/.env`**

| Variable | Description |
| --- | --- |
| `PORT` | Port for the API server (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |

**`client/.env`**

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_API_URL` | Backend API URL (e.g. `http://localhost:5000`) |

### 3. Run

```bash
# Terminal 1 — API
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

The frontend runs on Vite's dev server (default `http://localhost:5173`) and the API on `http://localhost:5000`.

## API Endpoints

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/applications` | List applications |
| `POST` | `/api/applications` | Create an application |
| `GET` | `/api/applications/stats/dashboard` | Dashboard summary stats |
| `GET` | `/api/applications/:id` | Get one application |
| `PUT` | `/api/applications/:id` | Update an application |
| `DELETE` | `/api/applications/:id` | Delete an application |
| `POST` | `/api/upload` | Upload a resume to Supabase Storage |

All application routes are protected and require a valid Supabase auth token.
