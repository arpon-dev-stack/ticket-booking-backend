# API Testing Guide & Summary

## 📋 Overview

This document provides complete testing information for the Bus Ticket Service API with **11 endpoints** supporting authenticated requests with JWT tokens, role-based access control, automatic seat generation, and real-time availability tracking.

---

## 🔐 Authentication Setup for Testing

### Getting a JWT Token

**Step 1: Sign Up (or Sign In)**
```bash
curl -X POST http://localhost:3000/swiftbus/v1/user/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response includes token:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "Test User", "role": ["user"] }
}
```

**Step 2: Use token in requests**
```bash
curl -X GET http://localhost:3000/swiftbus/v1/bus \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Getting Admin Role (for testing)

To test admin endpoints (POST/DELETE bus), you need an admin user:

**Option 1: Modify user role in database directly**
```javascript
// In MongoDB
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: ["admin"] } }
)
```

**Option 2: Create admin via signup, then manually update role**
- Sign up first, get the user ID
- Update that user's role to ["admin"] in database

### Token Expiration
- Tokens expire in **15 minutes**
- After expiration, user must sign in again to get new token
- Expired token error: `"Token expired. Please log in again."`

---

## 📂 Test Files Created

### 1. **API_TESTS.md** - Comprehensive Manual Testing Guide
   - **Location**: `/API_TESTS.md`
   - **Content**: 53+ test cases with:
     - Expected inputs (valid and invalid)
     - Expected outputs
     - HTTP status codes
     - Error scenarios
   - **Format**: Markdown with detailed examples
   - **Best For**: Manual testing in Postman or Insomnia

### 2. **api.test.js** - Automated Jest Tests
   - **Location**: `/src/v1/__tests__/api.test.js`
   - **Content**: Full test suite using Supertest
   - **Features**:
     - All 11 endpoints covered
     - Valid and invalid input scenarios
     - Error handling tests
     - Response validation
   - **Run**: `npm test`

### 3. **Bus_Ticket_Service_API.postman_collection.json** - Postman Collection
   - **Location**: `/Bus_Ticket_Service_API.postman_collection.json`
   - **Content**: Pre-configured requests for:
     - All 11 endpoints
     - Valid and invalid test cases
     - Query parameters configured
   - **Import**: Postman → Import → Select JSON file
   - **Best For**: Interactive manual testing

### 4. **QUICK_REFERENCE.md** - Quick Lookup Guide
   - **Location**: `/QUICK_REFERENCE.md`
   - **Content**: Quick reference table with:
     - All endpoints
     - Methods & status codes
     - Input parameters
     - cURL examples
   - **Best For**: Quick lookups while coding

---

## 🧪 Testing Methods

### Method 1: Jest Automated Testing (Recommended for CI/CD)

**Setup:**
```bash
cd E:\bus-ticket-service\server
npm install --save-dev jest supertest
```

**Run all tests:**
```bash
npm test
```

**Run specific test file:**
```bash
npm test -- api.test.js
```

**Run with coverage:**
```bash
npm test -- --coverage
```

**Output will show:**
```
PASS  src/v1/__tests__/api.test.js
  Bus Ticket Service API Tests
    USER ENDPOINTS
      ✓ POST /v1/user/signUp - Valid sign up
      ✓ POST /v1/user/signUp - Missing email
      ✓ POST /v1/user/signin - Valid sign in
      ...
```

---

### Method 2: Manual Testing with Postman

**Setup:**
1. Install Postman from https://www.postman.com/
2. Open Postman
3. Import: Click Import button → Select `Bus_Ticket_Service_API.postman_collection.json`

**Set Environment Variables:**
1. Click "Environments" in left sidebar
2. Create new environment (e.g., "Dev Local")
3. Add variables:
   ```
   - base_url: http://localhost:3000
   - token: <paste JWT token here>
   - userId: <paste from signup response>
   - busId: <paste from create bus response>
   - adminToken: <paste admin user's JWT token>
   ```

**Important: Add Authorization Headers**
- For all bus endpoints, add to Headers:
  ```
  Authorization: Bearer {{token}}
  ```
- For admin endpoints (POST/DELETE bus), use:
  ```
  Authorization: Bearer {{adminToken}}
  ```

**Quick Test Workflow:**
1. Sign Up User → Get token → Save to `token` variable
2. Get All Buses (use token header)
3. Create Bus (use adminToken header) → Save ID to `busId`
4. Get Single Bus (use token header)
5. Update Bus (use token header)
6. Make Payment → Get paymentId
7. Delete Bus (use adminToken header)
8. Delete User

---

### Method 3: Manual Testing with cURL

**Sign Up:**
```bash
curl -X POST http://localhost:3000/swiftbus/v1/user/signUp \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Response includes token:**
```
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Get All Buses (requires token):**
```bash
curl http://localhost:3000/swiftbus/v1/bus \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Get Buses with Filter (requires token):**
```bash
curl "http://localhost:3000/swiftbus/v1/bus?departure=Delhi&arrival=Mumbai" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create Bus (requires admin token):**
```bash
curl -X POST http://localhost:3000/swiftbus/v1/bus \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{
    "busNumber":"DL-01",
    "totalSeat":40,
    "seatsPerRow":4,
    "price":500,
    "departure":{"location":"Delhi","date":"2026-02-15T10:00:00Z"},
    "arrival":{"location":"Mumbai","date":"2026-02-15T22:00:00Z"}
  }'
```

---

## 📊 Test Coverage Summary

### USER ENDPOINTS (5)
| Endpoint | Method | Valid Cases | Error Cases | Total |
|----------|--------|------------|-------------|-------|
| /v1/user/signUp | POST | 1 | 5 | **6** |
| /v1/user/signin | POST | 1 | 4 | **5** |
| /v1/user/logout | POST | 1 | 0 | **1** |
| /v1/user/:id | PUT | 2 | 4 | **6** |
| /v1/user/:id | DELETE | 1 | 2 | **3** |
| **TOTAL** | | **6** | **15** | **21** |

### BUS ENDPOINTS (5)
| Endpoint | Method | Valid Cases | Error Cases | Total |
|----------|--------|------------|-------------|-------|
| /v1/bus | GET | 5 | 0 | **5** |
| /v1/bus/:id | GET | 1 | 2 | **3** |
| /v1/bus | POST | 1 | 6 | **7** |
| /v1/bus/:id | PUT | 2 | 3 | **5** |
| /v1/bus/:id | DELETE | 1 | 2 | **3** |
| **TOTAL** | | **10** | **13** | **23** |

### PAYMENT ENDPOINTS (1)
| Endpoint | Method | Valid Cases | Error Cases | Total |
|----------|--------|------------|-------------|-------|
| /v1/payment | POST | 1 | 8 | **9** |
| **TOTAL** | | **1** | **8** | **9** |

### GRAND TOTAL: **53 Test Cases**

---

## ✅ Validation Tests Included

Each endpoint tests:
- ✅ Valid inputs
- ✅ Missing required fields
- ✅ Invalid data types
- ✅ Invalid format (email, date, ID)
- ✅ Out of range values
- ✅ Duplicate records
- ✅ Non-existent records
- ✅ Unauthorized/forbidden scenarios

---

## 🔍 Example Test Case Structure

### Sign Up - Valid
```
Request:
POST /swiftbus/v1/user/signUp
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "requested": false
}

Expected Response (201):
{
  "message": "User created successfully",
  "user": {
    "id": "MongoDB ObjectId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": ["user"]
  }
}

Status Code: 201 Created
```

### Sign Up - Invalid Email
```
Request:
POST /swiftbus/v1/user/signUp
{
  "name": "John Doe",
  "email": "invalid-email",
  "password": "password123"
}

Expected Response (400):
{
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}

Status Code: 400 Bad Request
```

---

## 🚀 Running Complete Test Suite

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Step 3: Start Server
```bash
# Terminal 1
npm start
```

### Step 4: Run Tests
```bash
# Terminal 2
npm test
```

### Step 5: View Results
```
Test Results Summary:
✓ USER ENDPOINTS (21 tests)
✓ BUS ENDPOINTS (23 tests)
✓ PAYMENT ENDPOINTS (9 tests)
========================
Total: 53 tests passed
Coverage: X%
```

---

## 📈 Test Execution Flow

```
1. Setup (Create test users, buses)
   ↓
2. USER TESTS
   ├─ Sign Up Tests (6)
   ├─ Sign In Tests (5)
   ├─ Logout Tests (1)
   ├─ Update Tests (6)
   └─ Delete Tests (3)
   ↓
3. BUS TESTS
   ├─ Get All Tests (5)
   ├─ Get Single Tests (3)
   ├─ Create Tests (7)
   ├─ Update Tests (5)
   └─ Delete Tests (3)
   ↓
4. PAYMENT TESTS
   └─ Payment Tests (9)
   ↓
5. Cleanup (Remove test data)
   ↓
6. Generate Report
```

---

## 🎯 Quick Tests to Run First

### Smoke Test (5 minutes)
1. Sign Up ✅
2. Sign In ✅
3. Create Bus ✅
4. Get Buses ✅
5. Make Payment ✅

### Comprehensive Test (15 minutes)
1. Run all 53 test cases with `npm test`
2. Verify all pass
3. Check coverage report

### Manual Verification (20 minutes)
1. Import Postman collection
2. Run 5-10 random requests
3. Verify responses match documentation

---

## 🛠️ Debugging Failed Tests

### Issue: "Cannot connect to MongoDB"
**Solution:**
```bash
# Start MongoDB service
mongod
# Or check if already running: net start MongoDB
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "ECONNREFUSED - server not running"
**Solution:**
```bash
# Make sure server is running
npm start

# In another terminal:
npm test
```

### Issue: "404 - Route not found"
**Solution:**
- Verify endpoint spelling
- Check base URL: `/swiftbus`
- Verify server is running

---

## 📝 Test Documentation Files

| File | Purpose | Format |
|------|---------|--------|
| API_TESTS.md | Complete test cases | Markdown |
| api.test.js | Automated tests | Jest/JavaScript |
| Bus_Ticket_Service_API.postman_collection.json | Manual testing | Postman JSON |
| QUICK_REFERENCE.md | Quick lookups | Markdown tables |
| README_TESTING.md | This file | Markdown |

---

## ✨ Best Practices

1. **Run automated tests regularly**
   - Before committing code: `npm test`
   - In CI/CD pipeline
   - Before deployment

2. **Keep test data clean**
   - Delete test users/buses after testing
   - Use unique emails (timestamps)
   - Reset database periodically

3. **Test in order**
   - Signup → Signin → Update → Delete
   - Create Bus → Get Bus → Update → Delete
   - All tests → Payment

4. **Validate responses**
   - Check status code
   - Verify response structure
   - Check data types
   - Validate field values

5. **Document failures**
   - Save error responses
   - Screenshot failures
   - Note reproduction steps

---

## 🎓 Learning Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Postman Learning Center](https://learning.postman.com/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)

---

## 📞 Support

If tests fail:
1. Check server is running: `npm start`
2. Check MongoDB is running
3. Review error messages
4. Check QUICK_REFERENCE.md for endpoint specs
5. Run individual test: `npm test -- --testNamePattern="Sign Up"`

---

## Summary

You now have:
- ✅ 53 comprehensive test cases documented
- ✅ Automated Jest test suite ready to run
- ✅ Postman collection for manual testing
- ✅ Quick reference guide for all endpoints
- ✅ Complete API documentation with examples

**Start testing:** `npm test`
