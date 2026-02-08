# Bus Ticket Service API - Quick Reference

## All Endpoints Summary

### BASE URL: `http://localhost:PORT/swiftbus`

---

## 1. USER ENDPOINTS (5 endpoints)

| # | Endpoint | Method | Auth | Input Parameters | Response | Status Codes |
|---|----------|--------|------|------------------|----------|--------------|
| 1 | `/v1/user/signUp` | POST | ❌ | `name` (string), `email` (string), `password` (string≥6), `requested` (boolean) | User object with token | 201, 400, 409 |
| 2 | `/v1/user/signin` | POST | ❌ | `email` (string), `password` (string) | User object + JWT token | 200, 401, 400 |
| 3 | `/v1/user/logout` | POST | ❌ | (no body) | Success message | 200 |
| 4 | `/v1/user/:id` | PUT | ❌ | `name` (string), `email` (string), `password` (string≥6), `role` (array) | Updated user object | 200, 400, 404 |
| 5 | `/v1/user/:id` | DELETE | ❌ | (no body) | Deleted user object | 200, 400, 404 |

---

## 2. BUS ENDPOINTS (5 endpoints)

| # | Endpoint | Method | Auth | Input Parameters | Response | Status Codes |
|---|----------|--------|------|------------------|----------|--------------|
| 1 | `/v1/bus` | GET | ❌ | Query: `departure` (string), `arrival` (string), `busType` (string) | Array of buses | 200 |
| 2 | `/v1/bus/:id` | GET | ❌ | (no body) | Bus object | 200, 400, 404 |
| 3 | `/v1/bus` | POST | ❌ | `busNumber` (string), `totalSeat` (integer), `departure` (object), `arrival` (object), `busType` (array), `amodities` (array) | Bus object | 201, 400, 409 |
| 4 | `/v1/bus/:id` | PUT | ❌ | `busNumber` (string), `totalSeat` (integer), `departure` (object), `arrival` (object), `busType` (array), `amodities` (array) | Updated bus object | 200, 400, 404 |
| 5 | `/v1/bus/:id` | DELETE | ❌ | (no body) | Deleted bus object | 200, 400, 404 |

---

## 3. PAYMENT ENDPOINTS (1 endpoint)

| # | Endpoint | Method | Auth | Input Parameters | Response | Status Codes |
|---|----------|--------|------|------------------|----------|--------------|
| 1 | `/v1/payment` | POST | ❌ | `paymentId` (MongoId), `amount` (number), `busId` (MongoId), `seat` (string) | Payment object + booking details | 201, 400, 404, 409 |

---

## Detailed Input/Output Specifications

### USER SIGN UP
```
POST /swiftbus/v1/user/signUp
Content-Type: application/json

INPUT:
{
  "name": "John Doe",              // Required: 2-100 chars, letters/spaces only
  "email": "john@example.com",     // Required: Valid email
  "password": "password123",       // Required: Min 6 chars
  "requested": false               // Optional: boolean
}

OUTPUT (201):
{
  "message": "User created successfully",
  "user": {
    "id": "MongoDB ObjectId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": ["user"]
  }
}

ERROR RESPONSES:
- 400: Invalid email, short password, invalid name, missing fields
- 409: Email already exists
```

### USER SIGN IN
```
POST /swiftbus/v1/user/signin
Content-Type: application/json

INPUT:
{
  "email": "john@example.com",     // Required: Valid email
  "password": "password123"        // Required
}

OUTPUT (200):
{
  "message": "Sign in successful",
  "token": "jwt_token_here",
  "user": {
    "id": "MongoDB ObjectId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": ["user"]
  }
}

ERROR RESPONSES:
- 400: Invalid email format, missing fields
- 401: Invalid email or password
```

### USER UPDATE
```
PUT /swiftbus/v1/user/507f1f77bcf86cd799439011
Content-Type: application/json

INPUT (all optional):
{
  "name": "Jane Doe",              // Valid letters/spaces only
  "email": "jane@example.com",     // Valid email
  "password": "newpassword123",    // Min 6 chars
  "role": ["user", "admin"]        // Array of roles
}

OUTPUT (200):
{
  "message": "User updated successfully",
  "user": { ... }
}

ERROR RESPONSES:
- 400: Invalid ID format, invalid email, short password, invalid name
- 404: User not found
```

### USER DELETE
```
DELETE /swiftbus/v1/user/507f1f77bcf86cd799439011

OUTPUT (200):
{
  "message": "User deleted successfully",
  "user": {
    "id": "MongoDB ObjectId",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

ERROR RESPONSES:
- 400: Invalid ID format
- 404: User not found
```

### GET ALL BUSES
```
GET /swiftbus/v1/bus?departure=Delhi&arrival=Mumbai&busType=ac

QUERY PARAMETERS (all optional):
- departure: Location name (case-insensitive)
- arrival: Location name (case-insensitive)
- busType: Bus type (ac, non-ac, sleeper)

OUTPUT (200):
{
  "message": "Buses retrieved successfully",
  "count": 5,
  "buses": [
    {
      "_id": "MongoDB ObjectId",
      "busNumber": "DL-01",
      "totalSeat": 45,
      "departure": {
        "location": "Delhi",
        "date": "2026-02-15T10:00:00Z"
      },
      "arrival": {
        "location": "Mumbai",
        "date": "2026-02-15T22:00:00Z"
      },
      "busType": ["non-ac"],
      "amodities": ["waterbattle"],
      "seatSet": []
    }
  ]
}
```

### GET SINGLE BUS
```
GET /swiftbus/v1/bus/507f1f77bcf86cd799439011

OUTPUT (200):
{
  "message": "Bus retrieved successfully",
  "bus": { ... }
}

ERROR RESPONSES:
- 400: Invalid ID format
- 404: Bus not found
```

### CREATE BUS
```
POST /swiftbus/v1/bus
Content-Type: application/json

INPUT:
{
  "busNumber": "DL-01",                    // Required: Unique string
  "totalSeat": 45,                         // Required: Positive integer
  "departure": {
    "location": "Delhi",                   // Required: String
    "date": "2026-02-15T10:00:00Z"        // Required: ISO8601 date
  },
  "arrival": {
    "location": "Mumbai",                  // Required: String
    "date": "2026-02-15T22:00:00Z"        // Required: ISO8601 date
  },
  "busType": ["non-ac"],                   // Optional: Array of types
  "amodities": ["waterbattle"]             // Optional: Array of amenities
}

OUTPUT (201):
{
  "message": "Bus created successfully",
  "bus": { ... }
}

ERROR RESPONSES:
- 400: Missing required fields, invalid types, invalid dates
- 409: Bus number already exists
```

### UPDATE BUS
```
PUT /swiftbus/v1/bus/507f1f77bcf86cd799439011
Content-Type: application/json

INPUT (all optional):
{
  "busNumber": "DL-01-NEW",
  "totalSeat": 50,
  "departure": { ... },
  "arrival": { ... },
  "busType": ["ac"],
  "amodities": ["waterbattle", "charger", "wifi"]
}

OUTPUT (200):
{
  "message": "Bus updated successfully",
  "bus": { ... }
}

ERROR RESPONSES:
- 400: Invalid ID format, invalid data types
- 404: Bus not found
```

### DELETE BUS
```
DELETE /swiftbus/v1/bus/507f1f77bcf86cd799439011

OUTPUT (200):
{
  "message": "Bus deleted successfully",
  "bus": {
    "id": "MongoDB ObjectId",
    "busNumber": "DL-01"
  }
}

ERROR RESPONSES:
- 400: Invalid ID format
- 404: Bus not found
```

### MAKE PAYMENT
```
POST /swiftbus/v1/payment
Content-Type: application/json

INPUT:
{
  "paymentId": "507f1f77bcf86cd799439011",  // Required: Valid MongoId
  "amount": 500,                             // Required: Number >= 0
  "busId": "507f1f77bcf86cd799439022",     // Required: Valid MongoId
  "seat": "A1"                               // Required: String
}

OUTPUT (201):
{
  "message": "Payment successful",
  "payment": {
    "_id": "MongoDB ObjectId",
    "paymentId": "507f1f77bcf86cd799439011",
    "success": true
  },
  "seat": "A1",
  "amount": 500
}

ERROR RESPONSES:
- 400: Invalid ID format, missing fields, invalid amount
- 404: Bus not found, seat not found
- 409: Seat already booked
```

---

## Validation Rules Summary

### Email
- Must be valid email format (RFC 5322)
- Auto-normalized and trimmed
- Must be unique (for signup)

### Password
- Minimum 6 characters
- Auto-hashed with bcrypt (10 salt rounds)
- Compared using bcrypt compare

### Name
- Letters, spaces, hyphens, apostrophes only
- Auto-trimmed
- Required

### MongoDB ObjectId
- Must be 24-character hex string
- Example: `507f1f77bcf86cd799439011`

### Dates
- Must be ISO8601 format
- Examples: `2026-02-15T10:00:00Z`, `2026-02-15`

### Bus Type
- Allowed values: `ac`, `non-ac`, `sleeper`

### Amenities
- Allowed values: `waterbattle`, `charger`, `wifi`

---

## Testing Quick Commands

### Using cURL

**Sign Up:**
```bash
curl -X POST http://localhost:3000/swiftbus/v1/user/signUp \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Sign In:**
```bash
curl -X POST http://localhost:3000/swiftbus/v1/user/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get All Buses:**
```bash
curl http://localhost:3000/swiftbus/v1/bus
```

**Filter Buses:**
```bash
curl http://localhost:3000/swiftbus/v1/bus?departure=Delhi&arrival=Mumbai
```

**Create Bus:**
```bash
curl -X POST http://localhost:3000/swiftbus/v1/bus \
  -H "Content-Type: application/json" \
  -d '{
    "busNumber":"DL-01",
    "totalSeat":45,
    "departure":{"location":"Delhi","date":"2026-02-15T10:00:00Z"},
    "arrival":{"location":"Mumbai","date":"2026-02-15T22:00:00Z"},
    "busType":["non-ac"],
    "amodities":["waterbattle"]
  }'
```

---

## HTTP Status Codes Used

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation error, missing fields, invalid format |
| 401 | Unauthorized | Invalid credentials |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, duplicate bus number, seat already booked |
| 500 | Server Error | Database error, unexpected error |

---

## Import to Testing Tools

### Postman
1. Download [Bus_Ticket_Service_API.postman_collection.json](Bus_Ticket_Service_API.postman_collection.json)
2. Open Postman → Click "Import" → Select the file
3. Set `userId` and `busId` variables in environment
4. Start testing!

### Run Jest Tests
```bash
npm test
```

### Total Endpoints: 11
### Total Methods: 22+ (with all test cases)
### Total Test Cases: 53+
