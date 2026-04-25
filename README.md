# SmartSeason Field Monitoring System

A comprehensive, full-stack web application designed to help agricultural coordinators and field agents track crop progress across multiple fields during a growing season. 

**Live Demo (Frontend):** [https://smart-season-rho.vercel.app/](https://smart-season-rho.vercel.app/)  
**Live API (Backend):** [https://smartseason-api-a0ss.onrender.com](https://smartseason-api-a0ss.onrender.com)

---

##  Architecture Design

SmartSeason is structured as a **Monorepo** containing both the frontend client and the backend API. This ensures tight coupling of data types and simplified full-stack deployment.

- **Frontend (Client):** React 18, Vite, TypeScript, Tailwind CSS, Zustand (State Management), React Router.
- **Backend (API):** Node.js, Express, TypeScript, Prisma ORM, Zod (Validation), JSON Web Tokens (Auth).
- **Database:** PostgreSQL (Hosted on Neon).
- **Storage:** Cloudinary (For Profile Images).
- **Deployment:** Vercel (Frontend) and Render (Backend).

---

##  Core Requirements & Implementation

### 1. Users & Access
The system supports strict Role-Based Access Control (RBAC):
- **Admin (Coordinator):** Can create fields, assign agents, delete agents, and view global system statistics.
- **Field Agent:** Can only view fields explicitly assigned to them, and submit stage updates or notes.
- *Security:* JWT-based authentication with Bcrypt password hashing. Middleware protects sensitive API routes based on user role.

### 2. Field Management
Fields are the core entity. Admins register fields with a Name, Crop Type, Planting Date, and Location. They then assign these fields to registered agents through the dashboard. 

### 3. Field Updates & History
Agents use their workspace to submit **Field Updates**. An update consists of a stage transition (e.g., PLANTED to GROWING) and optional observational notes. The system maintains an immutable chronological audit trail of all updates.

### 4. Field Stages
Fields follow a strict, linear agricultural lifecycle:
`PLANTED` ➔ `GROWING` ➔ `READY` ➔ `HARVESTED`

---

##  Field Status Logic (Computed)

To provide immediate actionable insights without manual data entry, each field's "Status" is dynamically computed on the backend (`FieldService.computeStatus`) based on its data footprint:

1. **COMPLETED:** If the field's `currentStage` is marked as `HARVESTED`, the lifecycle is over, and it is completed.
2. **AT RISK:** If the field is not completed, the system checks the timestamp of the *last update* (or the planting date if no updates exist). If more than **7 days** have passed without an agent submitting an update or observation, the field is flagged as "At Risk" to alert the Admin of potential neglect.
3. **ACTIVE:** If the field is not completed and has received an update within the last 7 days, it is healthy and active.

---

##  Design Decisions & Assumptions

### Design Decisions
- **Custom UI / Tailwind CSS:** Instead of relying on heavy component libraries (like Material UI), the interface was built using highly customized Tailwind CSS components. This prioritized a premium, glassmorphic, and dynamic aesthetic that is lightweight and fully responsive.
- **Zustand over Redux:** Zustand was chosen for global state management (Authentication and User Profile) due to its zero-boilerplate nature and seamless React integration, keeping the frontend fast and clean.
- **CommonJS Compilation:** The backend TypeScript is explicitly compiled down to CommonJS (`dist/`) rather than ES Modules to ensure flawless, out-of-the-box compatibility with Render's Node.js runtime environment.

### Assumptions Made
1. **Agent Registration:** It is assumed that Field Agents are allowed to self-register via the portal, but they remain essentially powerless until an Admin explicitly assigns them a field.
2. **Linear Stages:** The crop stages are assumed to only move forward. Agents report the *current* reality on the ground.
3. **Cloudinary for Media:** Local disk storage is volatile on cloud providers like Render. Profile photos are piped directly to Cloudinary using memory buffers to ensure persistent media storage across server restarts.

---

##  Setup Instructions (Local Development)

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (Local or Neon/Supabase)
- Cloudinary Account (Free tier)

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory:
```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secure_random_string"
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

Initialize the database and start the server:
```bash
# Push the schema to your database
npx prisma db push

# Seed the database with the Admin account and dummy data
npm run seed

# Start the development server
npm run dev
```

### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `/frontend` directory:
```env
VITE_API_URL="http://localhost:3000/api"
```

Start the frontend development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

##  Demo Credentials

To test the live application or your local seeded database, use the following credentials:

**Admin (Coordinator) Account:**
- **Email:** `admin@smartseason.com`
- **Password:** `admin123`

**Field Agent Account:**
- **Email:** `agent@smartseason.com`
- **Password:** `123agent`
*(Note: You can also register a new agent via the "Create Account" screen).*
