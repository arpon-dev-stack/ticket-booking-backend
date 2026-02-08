# Bus Ticket Service - Server

> Express + MongoDB server for a bus ticketing service with JWT authentication and role-based access control.

## Overview

A complete REST API for a bus ticket reservation system featuring:
- **User Management**: Sign up, authentication with JWT tokens, and profile management
- **Role-Based Access**: Admin and user roles for secure operations
- **Bus Management**: Create, retrieve, update, and delete buses with automatic seat generation
- **Seat System**: Auto-generated seat naming (A1, A2, A3... layout) and real-time availability tracking
- **Payment Processing**: Secure payment records with seat booking verification

## Requirements

- Node.js 18+ (or compatible)
- MongoDB 4.4+
- npm 8+

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file** in project root:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/bus-ticket-service
   ACCESS_TOKEN=your_jwt_secret_key_here
   ```

3. **Start the server**:
   ```bash
   npm start
   # Or with nodemon for development:
   npm run dev
   ```

4. **Run tests** (if available):
   ```bash
   npm test
   ```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/bus-ticket` |
| `ACCESS_TOKEN` | JWT secret key | `your-super-secret-key` |

## API Endpoints Overview

### User Endpoints (no auth for signup)
- `POST /swiftbus/v1/user/signUp` — Register new user
- `POST /swiftbus/v1/user/signin` — Login (returns JWT token)
- `POST /swiftbus/v1/user/logout` — Logout
- `PUT /swiftbus/v1/user/:id` — Update user profile
- `DELETE /swiftbus/v1/user/:id` — Delete user account

### Bus Endpoints (auth required)
- `GET /swiftbus/v1/bus` — List all buses (with available seats)
- `GET /swiftbus/v1/bus/:id` — Get bus details
- `POST /swiftbus/v1/bus` — Create bus (admin only)
- `PUT /swiftbus/v1/bus/:id` — Update bus (auth required)
- `DELETE /swiftbus/v1/bus/:id` — Delete bus (admin only)

### Payment Endpoints
- `POST /swiftbus/v1/payment` — Process payment and book seat

## Key Features

### 1. Authentication & Authorization
- JWT-based authentication with 15-minute token expiration
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt

### 2. Automatic Seat Generation
When creating a bus with `totalSeat: 40` and `seatsPerRow: 4`:
```json
{
  "seatNumber": "A1",    // Row letter + column number
  "booked": {
    "owner": null,       // User ID when booked
    "name": null,        // Passenger name
    "date": null         // Booking date
  }
}
```
Generates seats: A1, A2, A3, A4 (Row A), B1, B2, B3, B4 (Row B), etc.

### 3. Real-Time Availability
- Each bus response includes `availableSeats` count
- Calculated as: `totalSeat - booked_seats`
- Updated automatically on each booking

### 4. Complete Validation
- Email format validation
- Password strength requirements (min 6 chars)
- MongoDB ObjectId validation
- Date/time ISO8601 validation
- Request body validation using express-validator

## Example Usage

### 1. Register & Login
```bash
# Signup
curl -X POST http://localhost:3000/swiftbus/v1/user/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Signin (get token)
curl -X POST http://localhost:3000/swiftbus/v1/user/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
# Response includes: token, user info
```

### 2. Search Buses (requires token)
```bash
curl -X GET "http://localhost:3000/swiftbus/v1/bus?departure=Delhi&arrival=Mumbai" \
  -H "Authorization: Bearer <token>"
```

### 3. Create Bus (admin only)
```bash
curl -X POST http://localhost:3000/swiftbus/v1/bus \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "busNumber": "DL-01",
    "totalSeat": 40,
    "seatsPerRow": 4,
    "price": 500,
    "departure": {
      "location": "Delhi",
      "date": "2026-02-15T10:00:00Z"
    },
    "arrival": {
      "location": "Mumbai",
      "date": "2026-02-15T22:00:00Z"
    },
    "busType": ["non-ac"],
    "amodities": ["waterbattle", "charger"]
  }'
```

## Project Structure

```
src/v1/
├── app.js                    # Express app setup
├── controllers/              # Route handlers
│   ├── userController.js
│   ├── busController.js
│   └── paymentController.js
├── services/                 # Business logic
│   ├── userService/
│   ├── busService/
│   └── paymentService/
├── database/                 # MongoDB models
│   ├── User.js
│   ├── Bus.js
│   └── Payment.js
├── middleware/
│   ├── verify.js             # JWT verification & authorization
│   └── validator/            # Input validators
├── routes/
│   └── rootRoute.js
└── utils/
    └── token.js              # JWT utilities

config/
└── db.js                      # MongoDB connection

index.js                       # Entry point
```

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: [String],             // ['user'] or ['admin']
  requested: Boolean
}
```

### Bus
```javascript
{
  busNumber: String,
  totalSeat: Number,
  seatsPerRow: Number,
  price: Number,
  seatSet: [Seat],            // Auto-generated
  availableSeats: Number,     // Virtual, calculated
  departure: { location, date },
  arrival: { location, date },
  busType: [String],
  amodities: [String]
}
```

### Seat (embedded in Bus.seatSet)
```javascript
{
  seatNumber: String,
  booked: {
    owner: ObjectId,          // User ID
    name: String,
    date: Date
  }
}
```

### Payment
```javascript
{
  paymentId: ObjectId,        // User ID
  amount: Number,
  success: Boolean
}
```

## Running Tests

```bash
npm test
```

Tests include:
- User signup/signin/logout
- Bus CRUD operations with auth
- Seat generation and availability
- Payment processing
- Authorization checks

## Error Handling

API returns standard HTTP status codes:
- `200` — Success (GET, PUT)
- `201` — Created (POST)
- `400` — Bad request/validation error
- `401` — Unauthorized (missing/invalid token)
- `403` — Forbidden (insufficient role)
- `404` — Not found
- `409` — Conflict (duplicate)
- `500` — Server error

## Notes

- All bus endpoints require JWT authentication
- Admin endpoints require `admin` role in token
- Seats are auto-generated when bus is created
- Update bus `totalSeat` or `seatsPerRow` to regenerate all seats
- Payment `amount` field is informational; validation uses payment record
- Token expires in 15 minutes; users must re-authenticate

## Documentation Files

- `API_DOCUMENTATION.md` — Complete endpoint reference
- `API_TESTS.md` — Test cases and examples
- `QUICK_REFERENCE.md` — Quick lookup guide
- `README_TESTING.md` — Testing setup guide

## License

ISC
