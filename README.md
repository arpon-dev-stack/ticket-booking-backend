# Bus Ticket Service - Server

> Minimal Express + MongoDB server for a bus ticketing service (v1).

## Overview

This repository contains the server-side code for the Bus Ticket Service. It exposes REST endpoints for users, buses and payments and uses MongoDB for persistence.

## Requirements

- Node.js 18+ (or compatible)
- MongoDB (URI)

## Quick start

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root with the variables below.

3. Start the server

```bash
npm start
# For development with automatic reload (nodemon):
npm run test
```

4. Seed sample data (if available)

```bash
npm run seed
```

## Environment variables

- `PORT` — port to run the server (e.g. `3000`)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWT tokens

Place them in `.env` (the project imports dotenv).

## Server base path

The server mounts the v1 routers under `/swiftbus` in `index.js`. The route files in `src/v1/routes/rootRoute.js` register `/v1/user`, `/v1/bus` and `/v1/payment` (with a leading slash), so the resulting paths in the current codebase resolve to:

- `/swiftbus/v1/user`
- `/swiftbus/v1/bus`
- `/swiftbus/v1/payment`

## API Endpoints (examples)

User

-- POST /swiftbus/v1/user/signUp — create a new user
  - Body: `{ "name": "...", "email": "...", "password": "..." }`
-- POST /swiftbus/v1/user/signin — authenticate
  - Body: `{ "email": "...", "password": "..." }`
-- POST /swiftbus/v1/user/logout — sign out
-- PUT /swiftbus/v1/user/:id — update user
-- DELETE /swiftbus/v1/user/:id — delete user

Bus

-- GET /swiftbus/v1/bus — list buses
-- GET /swiftbus/v1/bus/:id — get single bus
-- POST /swiftbus/v1/bus — create a bus
-- PUT /swiftbus/v1/bus/:id — update a bus
-- DELETE /swiftbus/v1/bus/:id — delete a bus

Payment

-- POST /swiftbus/v1/payment — make a payment

Example curl (signup):

```bash
curl -X POST http://localhost:3000/swiftbus/v1/user/signUp \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"pa55word"}'
```

## Project structure (key folders)

- `index.js` — app entry point, DB connect and route mounting
- `config/` — database connection (`db.js`)
- `src/v1/controllers/` — Express routers for `user`, `bus`, `payment`
- `src/v1/services/` — business logic and DB operations
- `src/v1/middleware/` — request middleware (e.g. `verify.js`)
- `src/v1/utils/` — utilities such as token helpers

## Notes & next steps

- The router registration in `src/v1/routes/rootRoute.js` uses paths without a leading slash; if you want endpoints like `/swiftbus/v1/user`, add leading slashes in that file.
- Consider adding a `dev` script (e.g. `nodemon`) for a clearer development flow.
- Add example Postman collection or OpenAPI spec for improved API documentation.

## License

ISC
