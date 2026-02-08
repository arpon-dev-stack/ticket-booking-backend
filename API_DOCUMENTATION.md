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

### 2.1 Get All Buses
- **Endpoint**: `GET /v1/bus`
- **Description**: Retrieve all buses with optional filters
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
        "seatSet": []
      }
    ]
  }
  ```

### 2.2 Get Single Bus
- **Endpoint**: `GET /v1/bus/:id`
- **Description**: Get details of a specific bus
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
      "seatSet": []
    }
  }
  ```

### 2.3 Create Bus
- **Endpoint**: `POST /v1/bus`
- **Description**: Add a new bus to the system
- **Request Body**:
  ```json
  {
    "busNumber": "DL-01",
    "totalSeat": 45,
    "departure": {
      "location": "Delhi",
      "date": "2026-02-10T10:00:00Z"
    },
    "arrival": {
      "location": "Mumbai",
      "date": "2026-02-10T22:00:00Z"
    },
    "busType": ["non-ac"],
    "amodities": ["waterbattle", "charger"],
    "seatSet": []
  }
  ```
- **Validation Rules**:
  - `busNumber`: Required, string
  - `totalSeat`: Required, positive integer
  - `departure.location`: Required, string
  - `departure.date`: Required, valid ISO8601 date
  - `arrival.location`: Required, string
  - `arrival.date`: Required, valid ISO8601 date
  - `busType`: Optional, array
  - `amodities`: Optional, array
- **Response** (201):
  ```json
  {
    "message": "Bus created successfully",
    "bus": {
      "_id": "...",
      "busNumber": "DL-01",
      "totalSeat": 45,
      ...
    }
  }
  ```

### 2.4 Update Bus
- **Endpoint**: `PUT /v1/bus/:id`
- **Description**: Update bus information
- **URL Parameters**:
  - `id`: Bus ID (MongoDB ObjectId)
- **Request Body** (all optional):
  ```json
  {
    "busNumber": "DL-01-NEW",
    "totalSeat": 50,
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
- **Response** (200):
  ```json
  {
    "message": "Bus updated successfully",
    "bus": { ... }
  }
  ```

### 2.5 Delete Bus
- **Endpoint**: `DELETE /v1/bus/:id`
- **Description**: Remove a bus from the system
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
  "message": "Invalid email or password"
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
- **400 Bad Request**: Validation error
- **401 Unauthorized**: Authentication failed
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

## Example Workflow

1. **Register User**:
   ```
   POST /swiftbus/v1/user/signUp
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Sign In**:
   ```
   POST /swiftbus/v1/user/signin
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```
   Get token from response.

3. **Search Buses**:
   ```
   GET /swiftbus/v1/bus?departure=Delhi&arrival=Mumbai
   ```

4. **Get Bus Details**:
   ```
   GET /swiftbus/v1/bus/{busId}
   ```

5. **Make Payment**:
   ```
   POST /swiftbus/v1/payment
   {
     "paymentId": "{userId}",
     "amount": 500,
     "busId": "{busId}",
     "seat": "A1"
   }
   ```

6. **Sign Out**:
   ```
   POST /swiftbus/v1/user/logout
   ```
