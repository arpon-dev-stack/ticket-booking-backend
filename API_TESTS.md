# API Endpoint Tests Documentation

## Base URL: `http://localhost:PORT/swiftbus`

---

## 1. USER ENDPOINTS TESTS

### 1.1 SIGN UP USER
**Endpoint:** `POST /v1/user/signUp`

#### Test Case 1: Valid Sign Up
```
Method: POST
URL: /swiftbus/v1/user/signUp
Headers: Content-Type: application/json

Input:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "requested": false
}

Expected Output (201):
{
  "message": "User created successfully",
  "user": {
    "id": "... MongoDB ID",
    "name": "John Doe",
    "email": "john@example.com",
    "role": ["user"]
  }
}
```

#### Test Case 2: Missing Required Field (name)
```
Input:
{
  "email": "john@example.com",
  "password": "password123"
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Name is required",
      "param": "name",
      "location": "body"
    }
  ]
}
```

#### Test Case 3: Invalid Email Format
```
Input:
{
  "name": "John Doe",
  "email": "invalid-email",
  "password": "password123"
}

Expected Output (400):
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

#### Test Case 4: Password Too Short
```
Input:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123"
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Password must be at least 6 characters",
      "param": "password",
      "location": "body"
    }
  ]
}
```

#### Test Case 5: Duplicate Email
```
Input (second call with same email):
{
  "name": "Jane Doe",
  "email": "john@example.com",
  "password": "password123"
}

Expected Output (400):
{
  "message": "User with this email already exists"
}
```

#### Test Case 6: Invalid Name (Special Characters)
```
Input:
{
  "name": "John@123",
  "email": "john@example.com",
  "password": "password123"
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "only letter and space allowed",
      "param": "name",
      "location": "body"
    }
  ]
}
```

---

### 1.2 SIGN IN USER
**Endpoint:** `POST /v1/user/signin`

#### Test Case 1: Valid Sign In
```
Method: POST
URL: /swiftbus/v1/user/signin
Headers: Content-Type: application/json

Input:
{
  "email": "john@example.com",
  "password": "password123"
}

Expected Output (200):
{
  "message": "Sign in successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "... MongoDB ID",
    "name": "John Doe",
    "email": "john@example.com",
    "role": ["user"]
  }
}
```

#### Test Case 2: Wrong Password
```
Input:
{
  "email": "john@example.com",
  "password": "wrongpassword"
}

Expected Output (401):
{
  "message": "Invalid email or password"
}
```

#### Test Case 3: User Not Found
```
Input:
{
  "email": "nonexistent@example.com",
  "password": "password123"
}

Expected Output (401):
{
  "message": "Invalid email or password"
}
```

#### Test Case 4: Missing Email
```
Input:
{
  "password": "password123"
}

Expected Output (400):
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

#### Test Case 5: Missing Password
```
Input:
{
  "email": "john@example.com"
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Password is required",
      "param": "password",
      "location": "body"
    }
  ]
}
```

---

### 1.3 SIGN OUT USER
**Endpoint:** `POST /v1/user/logout`

#### Test Case 1: Valid Sign Out
```
Method: POST
URL: /swiftbus/v1/user/logout
Headers: Content-Type: application/json

Input: {} (empty body)

Expected Output (200):
{
  "message": "Sign out successful"
}
```

---

### 1.4 UPDATE USER
**Endpoint:** `PUT /v1/user/:id`

#### Test Case 1: Valid Update Everything
```
Method: PUT
URL: /swiftbus/v1/user/507f1f77bcf86cd799439011
Headers: Content-Type: application/json

Input:
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword123",
  "role": ["user", "admin"]
}

Expected Output (200):
{
  "message": "User updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": ["user", "admin"]
  }
}
```

#### Test Case 2: Update Only Name
```
Input:
{
  "name": "Jane Smith"
}

Expected Output (200):
{
  "message": "User updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": ["user"]
  }
}
```

#### Test Case 3: Invalid User ID Format
```
URL: /swiftbus/v1/user/invalid-id

Expected Output (400):
{
  "errors": [
    {
      "msg": "Invalid user ID",
      "param": "id",
      "location": "params"
    }
  ]
}
```

#### Test Case 4: User Not Found
```
URL: /swiftbus/v1/user/507f1f77bcf86cd799439099

Expected Output (404):
{
  "message": "User not found"
}
```

#### Test Case 5: Invalid Email Update
```
Input:
{
  "email": "invalid-email"
}

Expected Output (400):
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

#### Test Case 6: Password Too Short
```
Input:
{
  "password": "123"
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Password must be at least 6 characters",
      "param": "password",
      "location": "body"
    }
  ]
}
```

---

### 1.5 DELETE USER
**Endpoint:** `DELETE /v1/user/:id`

#### Test Case 1: Valid Delete
```
Method: DELETE
URL: /swiftbus/v1/user/507f1f77bcf86cd799439011
Headers: Content-Type: application/json

Input: {} (no body needed)

Expected Output (200):
{
  "message": "User deleted successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Test Case 2: Invalid User ID Format
```
URL: /swiftbus/v1/user/invalid-id

Expected Output (400):
{
  "errors": [
    {
      "msg": "Invalid user ID",
      "param": "id",
      "location": "params"
    }
  ]
}
```

#### Test Case 3: User Not Found
```
URL: /swiftbus/v1/user/507f1f77bcf86cd799439099

Expected Output (404):
{
  "message": "User not found"
}
```

---

## 2. BUS ENDPOINTS TESTS

### 2.1 GET ALL BUSES
**Endpoint:** `GET /v1/bus`

#### Test Case 1: Get All Buses
```
Method: GET
URL: /swiftbus/v1/bus
Headers: Content-Type: application/json

Input: (no body)

Expected Output (200):
{
  "message": "Buses retrieved successfully",
  "count": 5,
  "buses": [
    {
      "_id": "... MongoDB ID",
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

#### Test Case 2: Filter by Departure Location
```
URL: /swiftbus/v1/bus?departure=Delhi

Expected Output (200):
{
  "message": "Buses retrieved successfully",
  "count": 3,
  "buses": [... filtered buses from Delhi]
}
```

#### Test Case 3: Filter by Arrival Location
```
URL: /swiftbus/v1/bus?arrival=Mumbai

Expected Output (200):
{
  "message": "Buses retrieved successfully",
  "count": 2,
  "buses": [... filtered buses to Mumbai]
}
```

#### Test Case 4: Filter by Bus Type
```
URL: /swiftbus/v1/bus?busType=ac

Expected Output (200):
{
  "message": "Buses retrieved successfully",
  "count": 1,
  "buses": [... AC buses only]
}
```

#### Test Case 5: Multiple Filters
```
URL: /swiftbus/v1/bus?departure=Delhi&arrival=Mumbai&busType=ac

Expected Output (200):
{
  "message": "Buses retrieved successfully",
  "count": 1,
  "buses": [... filtered results]
}
```

---

### 2.2 GET SINGLE BUS
**Endpoint:** `GET /v1/bus/:id`

#### Test Case 1: Get Valid Bus
```
Method: GET
URL: /swiftbus/v1/bus/507f1f77bcf86cd799439011
Headers: Content-Type: application/json

Input: (no body)

Expected Output (200):
{
  "message": "Bus retrieved successfully",
  "bus": {
    "_id": "507f1f77bcf86cd799439011",
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

#### Test Case 2: Invalid Bus ID Format
```
URL: /swiftbus/v1/bus/invalid-id

Expected Output (400):
{
  "errors": [
    {
      "msg": "Invalid bus ID",
      "param": "id",
      "location": "params"
    }
  ]
}
```

#### Test Case 3: Bus Not Found
```
URL: /swiftbus/v1/bus/507f1f77bcf86cd799439099

Expected Output (404):
{
  "message": "Bus not found"
}
```

---

### 2.3 CREATE BUS
**Endpoint:** `POST /v1/bus`

#### Test Case 1: Valid Bus Creation
```
Method: POST
URL: /swiftbus/v1/bus
Headers: Content-Type: application/json

Input:
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
  "amodities": ["waterbattle", "charger"]
}

Expected Output (201):
{
  "message": "Bus created successfully",
  "bus": {
    "_id": "... MongoDB ID",
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
    "amodities": ["waterbattle", "charger"]
  }
}
```

#### Test Case 2: Missing Bus Number
```
Input:
{
  "totalSeat": 45,
  "departure": {
    "location": "Delhi",
    "date": "2026-02-10T10:00:00Z"
  },
  "arrival": {
    "location": "Mumbai",
    "date": "2026-02-10T22:00:00Z"
  }
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Bus number is required",
      "param": "busNumber",
      "location": "body"
    }
  ]
}
```

#### Test Case 3: Invalid Total Seat (Not Integer)
```
Input:
{
  "busNumber": "DL-01",
  "totalSeat": "forty-five",
  "departure": {...},
  "arrival": {...}
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Total seat must be a positive integer",
      "param": "totalSeat",
      "location": "body"
    }
  ]
}
```

#### Test Case 4: Invalid Departure Date Format
```
Input:
{
  "busNumber": "DL-01",
  "totalSeat": 45,
  "departure": {
    "location": "Delhi",
    "date": "invalid-date"
  },
  "arrival": {
    "location": "Mumbai",
    "date": "2026-02-10T22:00:00Z"
  }
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Departure date must be a valid date",
      "param": "departure.date",
      "location": "body"
    }
  ]
}
```

#### Test Case 5: Missing Departure Location
```
Input:
{
  "busNumber": "DL-01",
  "totalSeat": 45,
  "departure": {
    "date": "2026-02-10T10:00:00Z"
  },
  "arrival": {
    "location": "Mumbai",
    "date": "2026-02-10T22:00:00Z"
  }
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Departure location is required",
      "param": "departure.location",
      "location": "body"
    }
  ]
}
```

#### Test Case 6: Duplicate Bus Number
```
Input (second call with same busNumber):
{
  "busNumber": "DL-01",
  "totalSeat": 50,
  "departure": {...},
  "arrival": {...}
}

Expected Output (409):
{
  "message": "Bus with this number already exists"
}
```

---

### 2.4 UPDATE BUS
**Endpoint:** `PUT /v1/bus/:id`

#### Test Case 1: Update Bus Number
```
Method: PUT
URL: /swiftbus/v1/bus/507f1f77bcf86cd799439011
Headers: Content-Type: application/json

Input:
{
  "busNumber": "DL-01-UPDATED"
}

Expected Output (200):
{
  "message": "Bus updated successfully",
  "bus": {
    "_id": "507f1f77bcf86cd799439011",
    "busNumber": "DL-01-UPDATED",
    ...
  }
}
```

#### Test Case 2: Update Multiple Fields
```
Input:
{
  "totalSeat": 50,
  "busType": ["ac"],
  "amodities": ["waterbattle", "charger", "wifi"]
}

Expected Output (200):
{
  "message": "Bus updated successfully",
  "bus": {
    "_id": "507f1f77bcf86cd799439011",
    "totalSeat": 50,
    "busType": ["ac"],
    "amodities": ["waterbattle", "charger", "wifi"],
    ...
  }
}
```

#### Test Case 3: Invalid Bus ID Format
```
URL: /swiftbus/v1/bus/invalid-id

Input:
{
  "totalSeat": 50
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Invalid bus ID",
      "param": "id",
      "location": "params"
    }
  ]
}
```

#### Test Case 4: Bus Not Found
```
URL: /swiftbus/v1/bus/507f1f77bcf86cd799439099

Input:
{
  "totalSeat": 50
}

Expected Output (404):
{
  "message": "Bus not found"
}
```

#### Test Case 5: Invalid Date Format in Update
```
Input:
{
  "departure": {
    "date": "invalid-date"
  }
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Departure date must be a valid date",
      "param": "departure.date",
      "location": "body"
    }
  ]
}
```

---

### 2.5 DELETE BUS
**Endpoint:** `DELETE /v1/bus/:id`

#### Test Case 1: Valid Delete
```
Method: DELETE
URL: /swiftbus/v1/bus/507f1f77bcf86cd799439011
Headers: Content-Type: application/json

Input: {} (no body needed)

Expected Output (200):
{
  "message": "Bus deleted successfully",
  "bus": {
    "id": "507f1f77bcf86cd799439011",
    "busNumber": "DL-01"
  }
}
```

#### Test Case 2: Invalid Bus ID Format
```
URL: /swiftbus/v1/bus/invalid-id

Expected Output (400):
{
  "errors": [
    {
      "msg": "Invalid bus ID",
      "param": "id",
      "location": "params"
    }
  ]
}
```

#### Test Case 3: Bus Not Found
```
URL: /swiftbus/v1/bus/507f1f77bcf86cd799439099

Expected Output (404):
{
  "message": "Bus not found"
}
```

---

## 3. PAYMENT ENDPOINTS TESTS

### 3.1 MAKE PAYMENT
**Endpoint:** `POST /v1/payment`

#### Test Case 1: Valid Payment
```
Method: POST
URL: /swiftbus/v1/payment
Headers: Content-Type: application/json

Input:
{
  "paymentId": "507f1f77bcf86cd799439011",
  "amount": 500,
  "busId": "507f1f77bcf86cd799439022",
  "seat": "A1"
}

Expected Output (201):
{
  "message": "Payment successful",
  "payment": {
    "_id": "... MongoDB ID",
    "paymentId": "507f1f77bcf86cd799439011",
    "success": true
  },
  "seat": "A1",
  "amount": 500
}
```

#### Test Case 2: Missing Payment ID
```
Input:
{
  "amount": 500,
  "busId": "507f1f77bcf86cd799439022",
  "seat": "A1"
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Invalid payment ID",
      "param": "paymentId",
      "location": "body"
    }
  ]
}
```

#### Test Case 3: Invalid Payment ID Format
```
Input:
{
  "paymentId": "invalid-id",
  "amount": 500,
  "busId": "507f1f77bcf86cd799439022",
  "seat": "A1"
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Invalid payment ID",
      "param": "paymentId",
      "location": "body"
    }
  ]
}
```

#### Test Case 4: Invalid Amount (Negative)
```
Input:
{
  "paymentId": "507f1f77bcf86cd799439011",
  "amount": -100,
  "busId": "507f1f77bcf86cd799439022",
  "seat": "A1"
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Amount must be a valid number",
      "param": "amount",
      "location": "body"
    }
  ]
}
```

#### Test Case 5: Missing Bus ID
```
Input:
{
  "paymentId": "507f1f77bcf86cd799439011",
  "amount": 500,
  "seat": "A1"
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Invalid bus ID",
      "param": "busId",
      "location": "body"
    }
  ]
}
```

#### Test Case 6: Missing Seat
```
Input:
{
  "paymentId": "507f1f77bcf86cd799439011",
  "amount": 500,
  "busId": "507f1f77bcf86cd799439022"
}

Expected Output (400):
{
  "errors": [
    {
      "msg": "Seat number is required",
      "param": "seat",
      "location": "body"
    }
  ]
}
```

#### Test Case 7: Bus Not Found
```
Input:
{
  "paymentId": "507f1f77bcf86cd799439011",
  "amount": 500,
  "busId": "507f1f77bcf86cd799439099",
  "seat": "A1"
}

Expected Output (404):
{
  "message": "Bus not found"
}
```

#### Test Case 8: Seat Not Found
```
Input:
{
  "paymentId": "507f1f77bcf86cd799439011",
  "amount": 500,
  "busId": "507f1f77bcf86cd799439022",
  "seat": "Z99"
}

Expected Output (404):
{
  "message": "Seat not found"
}
```

#### Test Case 9: Seat Already Booked
```
Input (second payment for same seat):
{
  "paymentId": "507f1f77bcf86cd799439033",
  "amount": 500,
  "busId": "507f1f77bcf86cd799439022",
  "seat": "A1"
}

Expected Output (409):
{
  "message": "Seat is already booked"
}
```

---

## Summary Test Matrix

| Endpoint | Method | Valid Cases | Invalid Cases | Error Cases | Total |
|----------|--------|------------|---------------|------------|-------|
| User SignUp | POST | 1 | 4 | 1 | 6 |
| User SignIn | POST | 1 | 2 | 2 | 5 |
| User Logout | POST | 1 | 0 | 0 | 1 |
| User Update | PUT | 2 | 2 | 2 | 6 |
| User Delete | DELETE | 1 | 1 | 1 | 3 |
| Get Buses | GET | 5 | 0 | 0 | 5 |
| Get Bus | GET | 1 | 1 | 1 | 3 |
| Create Bus | POST | 1 | 5 | 1 | 7 |
| Update Bus | PUT | 2 | 2 | 1 | 5 |
| Delete Bus | DELETE | 1 | 1 | 1 | 3 |
| Make Payment | POST | 1 | 6 | 2 | 9 |
| **TOTAL** | | **17** | **24** | **12** | **53** |

---

## Testing Tools Recommended

1. **Postman** - Visual API testing
2. **Insomnia** - REST client
3. **Jest + Supertest** - Automated testing
4. **Thunder Client** - VS Code extension

## Best Practices for Testing

1. Test all happy paths first
2. Test validation errors
3. Test error handling
4. Test edge cases
5. Test with invalid IDs
6. Test concurrent requests
7. Test database constraints
8. Document all test cases
