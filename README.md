# SmartSeason

A field monitoring system that tracks crop progress across growing seasons. Admins manage fields and assign agents. Agents report real-time updates from the ground.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Runtime  | Node.js                                 |
| Framework | Express + TypeScript                   |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| ORM      | Prisma v7                               |
| Auth     | JWT + bcrypt                            |
| Validation | Zod                                   |
| Frontend | React + TypeScript + Vite *(in progress)* |

## Project Structure

```
SmartSeason/
├── backend/
│   ├── prisma/               # Schema, migrations, seed data
│   ├── src/
│   │   ├── controllers/      # HTTP request handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Auth, roles, validation, error handling
│   │   ├── routes/           # Route registration
│   │   ├── schemas/          # Zod request validation schemas
│   │   └── lib/              # Prisma client
│   └── server.ts
└── frontend/                 # In progress
```

## Setup

### Prerequisites

- Node.js v18+
- PostgreSQL database (Neon recommended)

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key"
PORT=3000
FRONTEND_URL=http://localhost:5173
```

```bash
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

API runs at `http://localhost:3000`.

## License

MIT
