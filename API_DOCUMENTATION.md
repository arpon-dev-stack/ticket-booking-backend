# Bus Ticket Service API Documentation

## Base URL
```
http://localhost:PORT/swiftbus
```

---

## 1. USER ENDPOINTS

### 1.1 Sign Up User
- **Endpoint**: `POST /v1/user/signUp`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "requested": false
  }
  ```
- **Validation Rules**:
  - `name`: Required, string, only letters and spaces allowed
  - `email`: Required, valid email format
  - `password`: Required, minimum 6 characters
  - `requested`: Optional, boolean
- **Response** (201):
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": ["user"]
    }
  }
  ```

### 1.2 Sign In User
- **Endpoint**: `POST /v1/user/signin`
- **Description**: Authenticate user and receive token
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Validation Rules**:
  - `email`: Required, valid email format
  - `password`: Required
- **Response** (200):
  ```json
  {
    "message": "Sign in successful",
    "token": "jwt_token_here",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": ["user"]
    }
  }
  ```

### 1.3 Sign Out User
- **Endpoint**: `POST /v1/user/logout`
- **Description**: Sign out user (token invalidation on client side)
- **Response** (200):
  ```json
  {
    "message": "Sign out successful"
  }
  ```

### 1.4 Update User
- **Endpoint**: `PUT /v1/user/:id`
- **Description**: Update user information
- **URL Parameters**:
  - `id`: User ID (MongoDB ObjectId)
- **Request Body** (all optional):
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "newpassword123",
    "role": ["user", "admin"]
  }
  ```
- **Validation Rules**:
  - `id`: Must be valid MongoDB ID
  - `email`: Optional, valid email format
  - `password`: Optional, minimum 6 characters
  - `name`: Optional, only letters and spaces
  - `role`: Optional, array
- **Response** (200):
  ```json
  {
    "message": "User updated successfully",
    "user": {
      "id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": ["user", "admin"]
    }
  }
  ```

### 1.5 Delete User
- **Endpoint**: `DELETE /v1/user/:id`
- **Description**: Delete a user account
- **URL Parameters**:
  - `id`: User ID (MongoDB ObjectId)
- **Response** (200):
  ```json
  {
    "message": "User deleted successfully",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

---

## 2. BUS ENDPOINTS

**Authentication & Authorization**:
- All endpoints require JWT token in `Authorization: Bearer <token>` header
- GET endpoints: Any authenticated user
- POST/DELETE: Admin role required
- PUT: Any authenticated user

### 2.1 Get All Buses
- **Endpoint**: `GET /v1/bus`
- **Description**: Retrieve all buses with optional filters
- **Headers**:
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Query Parameters** (all optional):
  - `departure`: Filter by departure location (case-insensitive)
  - `arrival`: Filter by arrival location (case-insensitive)
  - `busType`: Filter by bus type (ac, non-ac, sleeper)
- **Example**: `GET /v1/bus?departure=Delhi&arrival=Mumbai`
- **Response** (200):
  ```json
  {
    "message": "Buses retrieved successfully",
    "count": 5,
    "buses": [
      {
        "_id": "...",
        "busNumber": "DL-01",
        "totalSeat": 45,
        "seatsPerRow": 4,
        "price": 500,
        "availableSeats": 40,
        "departure": {
          "location": "Delhi",
          "date": "2026-02-10T10:00:00Z"
        },
        "arrival": {
          "location": "Mumbai",
          "date": "2026-02-10T22:00:00Z"
        },
        "busType": ["non-ac"],
        "amodities": ["waterbattle"]
      }
    ]
  }
  ```

### 2.2 Get Single Bus
- **Endpoint**: `GET /v1/bus/:id`
- **Description**: Get details of a specific bus
- **Headers**:
  ```
  Authorization: Bearer <jwt_token>
  ```
- **URL Parameters**:
  - `id`: Bus ID (MongoDB ObjectId)
- **Response** (200):
  ```json
  {
    "message": "Bus retrieved successfully",
    "bus": {
      "_id": "...",
      "busNumber": "DL-01",
      "totalSeat": 45,
      "seatsPerRow": 4,
      "price": 500,
      "availableSeats": 40,
      "departure": {
        "location": "Delhi",
        "date": "2026-02-10T10:00:00Z"
      },
      "arrival": {
        "location": "Mumbai",
        "date": "2026-02-10T22:00:00Z"
      },
      "busType": ["non-ac"],
      "amodities": ["waterbattle"],
      "seatSet": [...]
    },
    "availableSeats": 40
  }
  ```

### 2.3 Create Bus (Admin Only)
- **Endpoint**: `POST /v1/bus`
- **Description**: Add a new bus to the system (requires admin role)
- **Headers**:
  ```
  Authorization: Bearer <admin_jwt_token>
  ```
- **Automatic Seat Generation**: Seats are auto-generated as A1, A2, A3, A4, B1, B2, B3, B4, etc. based on totalSeat and seatsPerRow
- **Request Body**:
  ```json
  {
    "busNumber": "DL-01",
    "totalSeat": 40,
    "seatsPerRow": 4,
    "price": 500,
    "departure": {
      "location": "Delhi",
      "date": "2026-02-10T10:00:00Z"
    },
    "arrival": {
      "location": "Mumbai",
      "date": "2026-02-10T22:00:00Z"
    },
    "busType": ["non-ac"],
    "amodities": ["waterbattle", "charger"]
  }
  ```
- **Validation Rules**:
  - `busNumber`: Required, string
  - `totalSeat`: Required, positive integer (total number of seats)
  - `seatsPerRow`: Optional, positive integer (default: 4) - determines layout
  - `price`: Required, numeric - ticket price per seat
  - `departure.location`: Required, string
  - `departure.date`: Required, valid ISO8601 date
  - `arrival.location`: Required, string
  - `arrival.date`: Required, valid ISO8601 date
  - `busType`: Optional, array (ac, non-ac, sleeper)
  - `amodities`: Optional, array (waterbattle, charger, wifi)
- **Response** (201):
  ```json
  {
    "message": "Bus created successfully",
    "bus": {
      "_id": "...",
      "busNumber": "DL-01",
      "totalSeat": 40,
      "seatsPerRow": 4,
      "price": 500,
      "availableSeats": 40,
      "seatSet": [
        {"seatNumber": "A1", "booked": {"owner": null, "name": null, "date": null}},
        {"seatNumber": "A2", "booked": {"owner": null, "name": null, "date": null}},
        ...
      ]
    },
    "availableSeats": 40
  }
  ```

### 2.4 Update Bus
- **Endpoint**: `PUT /v1/bus/:id`
- **Description**: Update bus information
- **Headers**:
  ```
  Authorization: Bearer <jwt_token>
  ```
- **URL Parameters**:
  - `id`: Bus ID (MongoDB ObjectId)
- **Request Body** (all optional):
  ```json
  {
    "busNumber": "DL-01-NEW",
    "totalSeat": 50,
    "seatsPerRow": 5,
    "price": 600,
    "departure": {
      "location": "New Delhi",
      "date": "2026-02-11T10:00:00Z"
    },
    "arrival": {
      "location": "New Mumbai",
      "date": "2026-02-11T22:00:00Z"
    },
    "busType": ["ac"],
    "amodities": ["waterbattle", "charger", "wifi"]
  }
  ```
- **Note**: If `totalSeat` or `seatsPerRow` is updated, all seats will be regenerated automatically
- **Response** (200):
  ```json
  {
    "message": "Bus updated successfully",
    "bus": { ... }
  }
  ```

### 2.5 Delete Bus (Admin Only)
- **Endpoint**: `DELETE /v1/bus/:id`
- **Description**: Remove a bus from the system (requires admin role)
- **Headers**:
  ```
  Authorization: Bearer <admin_jwt_token>
  ```
- **URL Parameters**:
  - `id`: Bus ID (MongoDB ObjectId)
- **Response** (200):
  ```json
  {
    "message": "Bus deleted successfully",
    "bus": {
      "id": "...",
      "busNumber": "DL-01"
    }
  }
  ```

---

## 3. PAYMENT ENDPOINTS

### 3.1 Make Payment
- **Endpoint**: `POST /v1/payment`
- **Description**: Process a payment for a bus ticket
- **Request Body**:
  ```json
  {
    "paymentId": "user_id_here",
    "amount": 500,
    "busId": "bus_id_here",
    "seat": "A1"
  }
  ```
- **Validation Rules**:
  - `paymentId`: Required, valid MongoDB ObjectId
  - `amount`: Required, numeric, >= 0
  - `busId`: Required, valid MongoDB ObjectId
  - `seat`: Required, string
- **Response** (201):
  ```json
  {
    "message": "Payment successful",
    "payment": {
      "_id": "...",
      "paymentId": "user_id_here",
      "success": true
    },
    "seat": "A1",
    "amount": 500
  }
  ```

---

## Error Responses

### Bad Request (400)
```json
{
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "message": "No token provided. Please log in."
}
```
Or:
```json
{
  "message": "Invalid token. Please log in."
}
```
Or:
```json
{
  "message": "Token expired. Please log in again."
}
```

### Forbidden (403)
```json
{
  "message": "Access denied. admin role required."
}
```

### Not Found (404)
```json
{
  "message": "User not found"
}
```

### Conflict (409)
```json
{
  "message": "User with this email already exists"
}
```

### Internal Server Error (500)
```json
{
  "message": "Internal server error"
}
```

---

## Common HTTP Status Codes
- **200 OK**: Successful GET, PUT request
- **201 Created**: Successful POST request
- **400 Bad Request**: Validation error or invalid request
- **401 Unauthorized**: Authentication failed (missing/invalid/expired token)
- **403 Forbidden**: Authorization failed (insufficient role/permissions)
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **500 Internal Server Error**: Server error

---

## Validation Rules Summary

### Email
- Must be valid email format
- Normalized and trimmed

### Password
- Minimum 6 characters
- Hashed using bcrypt before storage

### Name
- Only letters, spaces, hyphens, and apostrophes allowed
- Trimmed

### MongoDB ObjectId
- Must be valid 24-character hex string

### Dates
- Must be valid ISO8601 format
- Examples: `2026-02-10T10:00:00Z`, `2026-02-10`

---

## Authentication & Authorization

### Authentication via JWT Token
1. User signs in and receives JWT token with `id` and `role`
2. Include token in all bus-related requests:
   ```
   Headers: {
     "Authorization": "Bearer <jwt_token>"
   }
   ```
3. Token expires in 15 minutes - sign in again to get a new one

### Role-Based Access Control
- **Admin**: Can create, update, delete buses
- **User**: Can view and update buses, but cannot create/delete
- Default role: `user` (assigned on signup)

## Seat System

### Auto-Generated Seat Naming
When a bus is created with `totalSeat: 40` and `seatsPerRow: 4`:
- Automatically generates 40 seats
- Named sequentially: A1, A2, A3, A4, B1, B2, B3, B4, ... J1, J2, J3, J4
- Each seat structure:
  ```json
  {
    "seatNumber": "A1",
    "booked": {
      "owner": null,
      "name": null,
      "date": null
    }
  }
  ```

### Available Seats Calculation
- Formula: `availableSeats = totalSeat - booked_seats_count`
- Returned in all GET responses
- Updated in real-time as bookings occur

## Example Complete Workflow

1. **Register** (no auth needed):
   ```
   POST /swiftbus/v1/user/signUp
   Body: {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login** (get JWT token):
   ```
   POST /swiftbus/v1/user/signin
   Body: {
     "email": "john@example.com",
     "password": "password123"
   }
   Response: { "token": "jwt_here", "user": {...} }
   ```

3. **Search Buses** (requires auth):
   ```
   GET /swiftbus/v1/bus?departure=Delhi&arrival=Mumbai
   Headers: { "Authorization": "Bearer jwt_here" }
   Response: { "buses": [...], each with "availableSeats" count }
   ```

4. **View Bus Details** (requires auth):
   ```
   GET /swiftbus/v1/bus/{busId}
   Headers: { "Authorization": "Bearer jwt_here" }
   Response: { "bus": {...}, "availableSeats": 40 }
   ```

5. **Make Payment** (no auth needed):
   ```
   POST /swiftbus/v1/payment
   Body: {
     "paymentId": "{userId}",
     "amount": 500,
     "busId": "{busId}",
     "seat": "A1"
   }
   ```

6. **Logout**:
   ```
   POST /swiftbus/v1/user/logout
   ```
