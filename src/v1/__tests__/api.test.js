import request from 'supertest';
import app from '../app.js';
import User from '../database/User.js';
import Bus from '../database/Bus.js';
import Payment from '../database/Payment.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = '/swiftbus';
let userId, userToken, adminId, adminToken, busId, paymentUserId, paymentToken;

describe('Bus Ticket Service API - Complete Test Suite', () => {
  // ============ SETUP & TEARDOWN ============
  beforeAll(async () => {
    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bus-ticket-test');
    }
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Bus.deleteMany({});
    await Payment.deleteMany({});
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clean up after each test if needed
  });

  // ============ USER ENDPOINTS TESTS ============
  describe('USER ENDPOINTS', () => {
    describe('POST /v1/user/signUp', () => {
      test('Should successfully register a new user (201)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'John Doe',
            email: `john${Date.now()}@example.com`,
            password: 'password123',
            requested: false
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User created successfully');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('role', ['user']);
        
        userId = response.body.user.id;
      });

      test('Should register admin user for testing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'Admin User',
            email: `admin${Date.now()}@example.com`,
            password: 'adminpass123',
            requested: false
          });

        expect(response.status).toBe(201);
        adminId = response.body.user.id;
        
        // Manually set admin role in database for testing
        await User.findByIdAndUpdate(adminId, { role: ['admin'] });
      });

      test('Should reject missing required fields (400)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'John Doe',
            password: 'password123'
            // Missing email
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should reject invalid email (400)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'John Doe',
            email: 'invalid-email',
            password: 'password123'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should reject password shorter than 6 characters (400)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'John Doe',
            email: `test${Date.now()}@example.com`,
            password: '12345'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should reject duplicate email (409)', async () => {
        const email = `duplicate${Date.now()}@example.com`;
        
        // First signup
        await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'User One',
            email: email,
            password: 'password123'
          });

        // Second signup with same email
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'User Two',
            email: email,
            password: 'password456'
          });

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message', 'User with this email already exists');
      });

      test('Should reject invalid name with special characters (400)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'John@123#',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });
    });

    describe('POST /v1/user/signin', () => {
      let testEmail;

      beforeAll(async () => {
        testEmail = `signin${Date.now()}@example.com`;
        await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'Signin Test',
            email: testEmail,
            password: 'password123'
          });
      });

      test('Should successfully sign in user (200)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signin`)
          .send({
            email: testEmail,
            password: 'password123'
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Sign in successful');
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        
        userToken = response.body.token;
      });

      test('Should get admin token for testing', async () => {
        const adminEmail = `admin_signin${Date.now()}@example.com`;
        
        const signupRes = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'Admin Signin',
            email: adminEmail,
            password: 'adminpass123'
          });

        const adminUserId = signupRes.body.user.id;
        
        // Set admin role
        await User.findByIdAndUpdate(adminUserId, { role: ['admin'] });

        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signin`)
          .send({
            email: adminEmail,
            password: 'adminpass123'
          });

        expect(response.status).toBe(200);
        adminToken = response.body.token;
      });

      test('Should reject wrong password (400)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signin`)
          .send({
            email: testEmail,
            password: 'wrongpassword'
          });

        expect(response.status).toBe(400);
      });

      test('Should reject non-existent email (400)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signin`)
          .send({
            email: 'nonexistent@example.com',
            password: 'password123'
          });

        expect(response.status).toBe(400);
      });

      test('Should reject missing email (400)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signin`)
          .send({
            password: 'password123'
          });

        expect(response.status).toBe(400);
      });
    });

    describe('POST /v1/user/logout', () => {
      test('Should successfully logout (200)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/logout`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Sign out successful');
      });
    });

    describe('PUT /v1/user/:id', () => {
      let updateUserId = userId;

      test('Should successfully update user (200)', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/user/${updateUserId}`)
          .send({
            name: 'Updated Name',
            email: `updated${Date.now()}@example.com`
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User updated successfully');
        expect(response.body.user.name).toBe('Updated Name');
      });

      test('Should reject invalid user ID (400)', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/user/invalid-id`)
          .send({
            name: 'Test Name'
          });

        expect(response.status).toBe(400);
      });

      test('Should return 404 for non-existent user', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .put(`${BASE_URL}/v1/user/${fakeId}`)
          .send({
            name: 'Test'
          });

        expect(response.status).toBe(404);
      });

      test('Should reject password update with less than 6 chars (400)', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/user/${updateUserId}`)
          .send({
            password: '123'
          });

        expect(response.status).toBe(400);
      });
    });

    describe('DELETE /v1/user/:id', () => {
      let deleteUserId;

      beforeAll(async () => {
        const signupRes = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'User to Delete',
            email: `delete${Date.now()}@example.com`,
            password: 'password123'
          });
        deleteUserId = signupRes.body.user.id;
      });

      test('Should successfully delete user (200)', async () => {
        const response = await request(app)
          .delete(`${BASE_URL}/v1/user/${deleteUserId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User deleted successfully');
      });

      test('Should reject invalid user ID (400)', async () => {
        const response = await request(app)
          .delete(`${BASE_URL}/v1/user/invalid-id`);

        expect(response.status).toBe(400);
      });

      test('Should return 404 for non-existent user', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .delete(`${BASE_URL}/v1/user/${fakeId}`);

        expect(response.status).toBe(404);
      });
    });
  });

  // ============ BUS ENDPOINTS TESTS ============
  describe('BUS ENDPOINTS', () => {
    describe('POST /v1/bus (Create Bus - Admin Only)', () => {
      test('Should require authentication (401)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .send({
            busNumber: 'TEST-01',
            totalSeat: 40,
            seatsPerRow: 4,
            price: 500,
            departure: {
              location: 'Delhi',
              date: '2026-02-20T10:00:00Z'
            },
            arrival: {
              location: 'Mumbai',
              date: '2026-02-20T22:00:00Z'
            },
            busType: ['non-ac'],
            amenities: ['waterbattle']
          });

        expect(response.status).toBe(401);
      });

      test('Should require admin role (403)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            busNumber: 'TEST-02',
            totalSeat: 40,
            seatsPerRow: 4,
            price: 500,
            departure: {
              location: 'Delhi',
              date: '2026-02-20T10:00:00Z'
            },
            arrival: {
              location: 'Mumbai',
              date: '2026-02-20T22:00:00Z'
            },
            busType: ['non-ac'],
            amenities: ['waterbattle']
          });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message', expect.stringMatching(/admin/i));
      });

      test('Should successfully create bus with admin token (201)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            busNumber: `BUS-${Date.now()}`,
            totalSeat: 40,
            seatsPerRow: 4,
            price: 500,
            departure: {
              location: 'Delhi',
              date: '2026-02-20T10:00:00Z'
            },
            arrival: {
              location: 'Mumbai',
              date: '2026-02-20T22:00:00Z'
            },
            busType: ['non-ac'],
            amenities: ['waterbattle']
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Bus created successfully');
        expect(response.body).toHaveProperty('availableSeats', 40);
        expect(response.body.bus.seatSet).toBeDefined();
        expect(response.body.bus.seatSet.length).toBe(40);
        
        // Verify seat naming
        expect(response.body.bus.seatSet[0].seatNumber).toBe('A1');
        expect(response.body.bus.seatSet[3].seatNumber).toBe('A4');
        expect(response.body.bus.seatSet[4].seatNumber).toBe('B1');
        
        busId = response.body.bus._id;
      });

      test('Should reject missing required fields (400)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            busNumber: 'TEST-03'
            // Missing other required fields
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should reject duplicate bus number (409)', async () => {
        const busNumber = `UNIQUE-${Date.now()}`;
        
        // Create first bus
        await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            busNumber: busNumber,
            totalSeat: 40,
            seatsPerRow: 4,
            price: 500,
            departure: {
              location: 'Delhi',
              date: '2026-02-20T10:00:00Z'
            },
            arrival: {
              location: 'Mumbai',
              date: '2026-02-20T22:00:00Z'
            },
            busType: ['non-ac'],
            amenities: ['waterbattle']
          });

        // Try to create second bus with same number
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            busNumber: busNumber,
            totalSeat: 50,
            seatsPerRow: 5,
            price: 600,
            departure: {
              location: 'Bangalore',
              date: '2026-02-21T10:00:00Z'
            },
            arrival: {
              location: 'Chennai',
              date: '2026-02-21T22:00:00Z'
            }
          });

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message', expect.stringMatching(/already exists/i));
      });

      test('Should reject invalid date format (400)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            busNumber: `BUS-${Date.now()}`,
            totalSeat: 40,
            seatsPerRow: 4,
            price: 500,
            departure: {
              location: 'Delhi',
              date: 'invalid-date'
            },
            arrival: {
              location: 'Mumbai',
              date: '2026-02-20T22:00:00Z'
            }
          });

        expect(response.status).toBe(400);
      });
    });

    describe('GET /v1/bus (Get All Buses)', () => {
      test('Should require authentication (401)', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus`);

        expect(response.status).toBe(401);
      });

      test('Should successfully get all buses with auth (200)', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Buses retrieved successfully');
        expect(response.body).toHaveProperty('buses');
        expect(Array.isArray(response.body.buses)).toBe(true);
        
        // Each bus should have availableSeats
        if (response.body.buses.length > 0) {
          expect(response.body.buses[0]).toHaveProperty('availableSeats');
        }
      });

      test('Should filter buses by departure location', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus?departure=Delhi`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('buses');
        
        if (response.body.buses.length > 0) {
          response.body.buses.forEach(bus => {
            expect(bus.departure.location.toLowerCase()).toContain('delhi');
          });
        }
      });

      test('Should filter buses by arrival location', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus?arrival=Mumbai`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('buses');
      });

      test('Should filter buses by bus type', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus?busType=non-ac`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('buses');
      });
    });

    describe('GET /v1/bus/:id (Get Single Bus)', () => {
      test('Should require authentication (401)', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus/${busId}`);

        expect(response.status).toBe(401);
      });

      test('Should successfully get single bus with auth (200)', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus/${busId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Bus retrieved successfully');
        expect(response.body).toHaveProperty('bus');
        expect(response.body).toHaveProperty('availableSeats');
        expect(response.body.bus._id.toString()).toBe(busId.toString());
      });

      test('Should reject invalid bus ID (400)', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus/invalid-id`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(400);
      });

      test('Should return 404 for non-existent bus', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus/${fakeId}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(404);
      });
    });

    describe('PUT /v1/bus/:id (Update Bus)', () => {
      test('Should require authentication (401)', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/bus/${busId}`)
          .send({
            busNumber: 'UPDATED-BUS'
          });

        expect(response.status).toBe(401);
      });

      test('Should successfully update bus with auth (200)', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/bus/${busId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            price: 600,
            busType: ['ac']
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Bus updated successfully');
        expect(response.body.bus.price).toBe(600);
      });

      test('Should regenerate seats when totalSeat changes', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/bus/${busId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            totalSeat: 20,
            seatsPerRow: 5
          });

        expect(response.status).toBe(200);
        expect(response.body.bus.totalSeat).toBe(20);
        expect(response.body.bus.seatSet.length).toBe(20);
      });

      test('Should reject invalid ID (400)', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/bus/invalid-id`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            busNumber: 'TEST'
          });

        expect(response.status).toBe(400);
      });

      test('Should return 404 for non-existent bus', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .put(`${BASE_URL}/v1/bus/${fakeId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            price: 700
          });

        expect(response.status).toBe(404);
      });
    });

    describe('DELETE /v1/bus/:id (Delete Bus - Admin Only)', () => {
      let busToDelete;

      beforeAll(async () => {
        const createRes = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            busNumber: `DELETE-${Date.now()}`,
            totalSeat: 30,
            seatsPerRow: 5,
            price: 400,
            departure: {
              location: 'Pune',
              date: '2026-02-25T10:00:00Z'
            },
            arrival: {
              location: 'Delhi',
              date: '2026-02-25T22:00:00Z'
            }
          });
        busToDelete = createRes.body.bus._id;
      });

      test('Should require admin role (403)', async () => {
        const response = await request(app)
          .delete(`${BASE_URL}/v1/bus/${busToDelete}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
      });

      test('Should successfully delete bus with admin token (200)', async () => {
        const response = await request(app)
          .delete(`${BASE_URL}/v1/bus/${busToDelete}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Bus deleted successfully');
      });

      test('Should reject invalid ID (400)', async () => {
        const response = await request(app)
          .delete(`${BASE_URL}/v1/bus/invalid-id`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(400);
      });

      test('Should return 404 for non-existent bus', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .delete(`${BASE_URL}/v1/bus/${fakeId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
      });
    });
  });

  // ============ PAYMENT ENDPOINTS TESTS ============
  describe('PAYMENT ENDPOINTS', () => {
    describe('POST /v1/payment', () => {
      let paymentBusId, paymentSeat;

      beforeAll(async () => {
        // Create payment user
        const userRes = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'Payment User',
            email: `payment${Date.now()}@example.com`,
            password: 'password123'
          });
        paymentUserId = userRes.body.user.id;

        // Create bus for payment
        const busRes = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            busNumber: `PAYMENT-${Date.now()}`,
            totalSeat: 24,
            seatsPerRow: 4,
            price: 500,
            departure: {
              location: 'Bangalore',
              date: '2026-03-01T10:00:00Z'
            },
            arrival: {
              location: 'Hyderabad',
              date: '2026-03-01T18:00:00Z'
            }
          });
        paymentBusId = busRes.body.bus._id;
        paymentSeat = busRes.body.bus.seatSet[0].seatNumber;
      });

      test('Should successfully make payment and book seat (201)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: 500,
            busId: paymentBusId,
            seat: paymentSeat
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Payment successful');
        expect(response.body).toHaveProperty('payment');
        expect(response.body).toHaveProperty('seat', paymentSeat);
        expect(response.body.payment.success).toBe(true);
      });

      test('Should reject missing required fields (400)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: 500
            // Missing busId and seat
          });

        expect(response.status).toBe(400);
      });

      test('Should reject invalid payment ID (400)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: 'invalid-id',
            amount: 500,
            busId: paymentBusId,
            seat: 'A1'
          });

        expect(response.status).toBe(400);
      });

      test('Should reject non-existent bus (404)', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: 500,
            busId: fakeId,
            seat: 'A1'
          });

        expect(response.status).toBe(404);
      });

      test('Should reject non-existent seat (404)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: 500,
            busId: paymentBusId,
            seat: 'Z99'
          });

        expect(response.status).toBe(404);
      });

      test('Should reject already booked seat (409)', async () => {
        // First booking
        const bookedSeat = 'B1';
        await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: 500,
            busId: paymentBusId,
            seat: bookedSeat
          });

        // Try to book same seat again
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: 500,
            busId: paymentBusId,
            seat: bookedSeat
          });

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message', expect.stringMatching(/already booked/i));
      });
    });
  });

  // ============ INTEGRATION TESTS ============
  describe('INTEGRATION TESTS', () => {
    test('Complete user journey: signup → signin → search buses → view details', async () => {
      // Signup
      const signupRes = await request(app)
        .post(`${BASE_URL}/v1/user/signUp`)
        .send({
          name: 'Integration Test User',
          email: `integration${Date.now()}@example.com`,
          password: 'password123'
        });
      
      const token = signupRes.body.token;
      expect(token).toBeDefined();

      // Signin
      const signinRes = await request(app)
        .post(`${BASE_URL}/v1/user/signin`)
        .send({
          email: signupRes.body.user.email,
          password: 'password123'
        });
      
      expect(signinRes.status).toBe(200);
      expect(signinRes.body).toHaveProperty('token');

      // Search buses
      const searchRes = await request(app)
        .get(`${BASE_URL}/v1/bus`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(searchRes.status).toBe(200);
      expect(searchRes.body).toHaveProperty('buses');

      // Get bus details
      if (searchRes.body.buses.length > 0) {
        const busDetailsRes = await request(app)
          .get(`${BASE_URL}/v1/bus/${searchRes.body.buses[0]._id}`)
          .set('Authorization', `Bearer ${token}`);
        
        expect(busDetailsRes.status).toBe(200);
        expect(busDetailsRes.body).toHaveProperty('availableSeats');
      }
    });

    test('Seat availability updates correctly after booking', async () => {
      // Create test bus
      const createBusRes = await request(app)
        .post(`${BASE_URL}/v1/bus`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          busNumber: `AVAILABILITY-${Date.now()}`,
          totalSeat: 10,
          seatsPerRow: 5,
          price: 300,
          departure: {
            location: 'Test City 1',
            date: '2026-03-10T10:00:00Z'
          },
          arrival: {
            location: 'Test City 2',
            date: '2026-03-10T18:00:00Z'
          }
        });

      const testBusId = createBusRes.body.bus._id;
      const initialAvailable = createBusRes.body.availableSeats;

      // Create test user for payment
      const userRes = await request(app)
        .post(`${BASE_URL}/v1/user/signUp`)
        .send({
          name: 'Availability Test',
          email: `availability${Date.now()}@example.com`,
          password: 'password123'
        });
      
      const testUserId = userRes.body.user.id;

      // Check availability before booking
      const beforeBooking = await request(app)
        .get(`${BASE_URL}/v1/bus/${testBusId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(beforeBooking.body.availableSeats).toBe(initialAvailable);

      // Book a seat
      await request(app)
        .post(`${BASE_URL}/v1/payment`)
        .send({
          paymentId: testUserId,
          amount: 300,
          busId: testBusId,
          seat: 'A1'
        });

      // Check availability after booking
      const afterBooking = await request(app)
        .get(`${BASE_URL}/v1/bus/${testBusId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(afterBooking.body.availableSeats).toBe(initialAvailable - 1);
    });
  });

  // ============ ERROR HANDLING TESTS ============
  describe('ERROR HANDLING', () => {
    test('Should handle missing Authorization header', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/v1/bus`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', expect.stringMatching(/token|authentication/i));
    });

    test('Should handle invalid token format', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/v1/bus`)
        .set('Authorization', 'Bearer invalid-token-123');

      expect(response.status).toBe(401);
    });

    test('Should handle malformed Authorization header', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/v1/bus`)
        .set('Authorization', 'InvalidFormat token');

      expect(response.status).toBe(401);
    });

    test('Should handle non-existent endpoint (404)', async () => {
      const response = await request(app)
        .get(`${BASE_URL}/v1/nonexistent`);

      expect(response.status).toBe(404);
    });
  });
});
