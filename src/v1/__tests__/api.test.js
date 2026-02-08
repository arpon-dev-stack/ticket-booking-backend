import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import User from './database/User.js';
import Bus from './database/Bus.js';
import Payment from './database/Payment.js';

const BASE_URL = '/swiftbus';

// Test data
let userId, busId, paymentUserId;
const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'password123'
};

const testBus = {
  busNumber: `BUS${Date.now()}`,
  totalSeat: 45,
  seatsPerRow: 5,
  departure: {
    location: 'Delhi',
    date: new Date('2026-02-15T10:00:00Z')
  },
  arrival: {
    location: 'Mumbai',
    date: new Date('2026-02-15T22:00:00Z')
  },
  busType: ['non-ac'],
  amodities: ['waterbattle']
};

describe('Bus Ticket Service API Tests', () => {

  // ============ USER TESTS ============

  describe('USER ENDPOINTS', () => {

    // SIGN UP TESTS
    describe('POST /v1/user/signUp', () => {

      test('Should successfully sign up a new user (201)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send(testUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User created successfully');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('name', testUser.name);
        expect(response.body.user).toHaveProperty('email', testUser.email);
        expect(response.body.user).toHaveProperty('role', ['user']);
        
        userId = response.body.user.id;
      });

      test('Should return 400 if email is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'Test User',
            password: 'password123'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if password is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'Test User',
            email: 'test@example.com'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if name is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            email: 'test@example.com',
            password: 'password123'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if email format is invalid', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'Test User',
            email: 'invalid-email',
            password: 'password123'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if password is less than 6 characters', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'Test User',
            email: 'test@example.com',
            password: '123'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if name contains invalid characters', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'Test@User123',
            email: 'test@example.com',
            password: 'password123'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if duplicate email', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send(testUser);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'User with this email already exists');
      });

    });

    // SIGN IN TESTS
    describe('POST /v1/user/signin', () => {

      test('Should successfully sign in user and return token (200)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signin`)
          .send({
            email: testUser.email,
            password: testUser.password
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Sign in successful');
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('email', testUser.email);
      });

      test('Should return 401 if password is wrong', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signin`)
          .send({
            email: testUser.email,
            password: 'wrongpassword'
          });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid email or password');
      });

      test('Should return 401 if user does not exist', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signin`)
          .send({
            email: 'nonexistent@example.com',
            password: 'password123'
          });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid email or password');
      });

      test('Should return 400 if email is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signin`)
          .send({
            password: 'password123'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if password is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/signin`)
          .send({
            email: testUser.email
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

    });

    // SIGN OUT TESTS
    describe('POST /v1/user/logout', () => {

      test('Should successfully sign out user (200)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/user/logout`)
          .send({});

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Sign out successful');
      });

    });

    // UPDATE USER TESTS
    describe('PUT /v1/user/:id', () => {

      test('Should successfully update user name (200)', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/user/${userId}`)
          .send({
            name: 'Updated User'
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User updated successfully');
        expect(response.body.user).toHaveProperty('name', 'Updated User');
      });

      test('Should successfully update multiple fields (200)', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/user/${userId}`)
          .send({
            name: 'Jane Doe',
            password: 'newpassword123'
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User updated successfully');
        expect(response.body.user).toHaveProperty('name', 'Jane Doe');
      });

      test('Should return 400 if user ID is invalid format', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/user/invalid-id`)
          .send({
            name: 'Updated User'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 404 if user not found', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/user/507f1f77bcf86cd799439099`)
          .send({
            name: 'Updated User'
          });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'User not found');
      });

      test('Should return 400 if email format is invalid', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/user/${userId}`)
          .send({
            email: 'invalid-email'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if password is too short', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/user/${userId}`)
          .send({
            password: '123'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

    });

    // DELETE USER TESTS
    describe('DELETE /v1/user/:id', () => {

      test('Should return 400 if user ID is invalid format', async () => {
        const response = await request(app)
          .delete(`${BASE_URL}/v1/user/invalid-id`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 404 if user not found', async () => {
        const response = await request(app)
          .delete(`${BASE_URL}/v1/user/507f1f77bcf86cd799439099`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'User not found');
      });

      test('Should successfully delete user (200)', async () => {
        // Create a user to delete
        const createResponse = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'Delete Me',
            email: `delete${Date.now()}@example.com`,
            password: 'password123'
          });

        const userToDelete = createResponse.body.user.id;

        const response = await request(app)
          .delete(`${BASE_URL}/v1/user/${userToDelete}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User deleted successfully');
        expect(response.body.user).toHaveProperty('id', userToDelete);
      });

    });

  });

  // ============ BUS TESTS ============

  describe('BUS ENDPOINTS', () => {

    // GET ALL BUSES TESTS
    describe('GET /v1/bus', () => {

      test('Should retrieve all buses (200)', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Buses retrieved successfully');
        expect(response.body).toHaveProperty('count');
        expect(response.body).toHaveProperty('buses');
        expect(Array.isArray(response.body.buses)).toBe(true);
      });

      test('Should filter buses by departure location', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus?departure=Delhi`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('buses');
      });

      test('Should filter buses by arrival location', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus?arrival=Mumbai`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('buses');
      });

      test('Should filter buses by bus type', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus?busType=ac`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('buses');
      });

      test('Should filter buses with multiple parameters', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus?departure=Delhi&arrival=Mumbai&busType=ac`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('buses');
      });

    });

    // CREATE BUS TESTS
    describe('POST /v1/bus', () => {

      test('Should successfully create a new bus (201)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .send(testBus);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Bus created successfully');
        expect(response.body.bus).toHaveProperty('_id');
        expect(response.body.bus).toHaveProperty('busNumber', testBus.busNumber);
        expect(response.body.bus).toHaveProperty('totalSeat', testBus.totalSeat);

        busId = response.body.bus._id;
      });

      test('Should return 400 if bus number is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .send({
            totalSeat: 45,
            departure: testBus.departure,
            arrival: testBus.arrival
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if total seat is not an integer', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .send({
            busNumber: 'BUS-NEW',
            totalSeat: 'forty-five',
            departure: testBus.departure,
            arrival: testBus.arrival
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if departure location is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .send({
            busNumber: 'BUS-NEW',
            totalSeat: 45,
            departure: {
              date: testBus.departure.date
            },
            arrival: testBus.arrival
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if departure date format is invalid', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .send({
            busNumber: 'BUS-NEW',
            totalSeat: 45,
            departure: {
              location: 'Delhi',
              date: 'invalid-date'
            },
            arrival: testBus.arrival
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if arrival location is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .send({
            busNumber: 'BUS-NEW',
            totalSeat: 45,
            departure: testBus.departure,
            arrival: {
              date: testBus.arrival.date
            }
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 409 if duplicate bus number', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .send(testBus);

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message', 'Bus with this number already exists');
      });

    });

    // GET SINGLE BUS TESTS
    describe('GET /v1/bus/:id', () => {

      test('Should retrieve single bus (200)', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus/${busId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Bus retrieved successfully');
        expect(response.body.bus).toHaveProperty('_id', busId);
        expect(response.body.bus).toHaveProperty('busNumber');
      });

      test('Should return 400 if bus ID is invalid format', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus/invalid-id`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 404 if bus not found', async () => {
        const response = await request(app)
          .get(`${BASE_URL}/v1/bus/507f1f77bcf86cd799439099`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Bus not found');
      });

    });

    // UPDATE BUS TESTS
    describe('PUT /v1/bus/:id', () => {

      test('Should successfully update bus number (200)', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/bus/${busId}`)
          .send({
            busNumber: `BUS-UPDATED-${Date.now()}`
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Bus updated successfully');
        expect(response.body.bus).toHaveProperty('busNumber');
      });

      test('Should successfully update multiple fields (200)', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/bus/${busId}`)
          .send({
            totalSeat: 50,
            busType: ['ac']
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Bus updated successfully');
        expect(response.body.bus).toHaveProperty('totalSeat', 50);
      });

      test('Should return 400 if bus ID is invalid format', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/bus/invalid-id`)
          .send({
            totalSeat: 50
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 404 if bus not found', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/bus/507f1f77bcf86cd799439099`)
          .send({
            totalSeat: 50
          });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Bus not found');
      });

      test('Should return 400 if date format is invalid', async () => {
        const response = await request(app)
          .put(`${BASE_URL}/v1/bus/${busId}`)
          .send({
            departure: {
              date: 'invalid-date'
            }
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

    });

    // DELETE BUS TESTS
    describe('DELETE /v1/bus/:id', () => {

      test('Should return 400 if bus ID is invalid format', async () => {
        const response = await request(app)
          .delete(`${BASE_URL}/v1/bus/invalid-id`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 404 if bus not found', async () => {
        const response = await request(app)
          .delete(`${BASE_URL}/v1/bus/507f1f77bcf86cd799439099`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Bus not found');
      });

      test('Should successfully delete bus (200)', async () => {
        // Create a bus to delete
        const createResponse = await request(app)
          .post(`${BASE_URL}/v1/bus`)
          .send({
            ...testBus,
            busNumber: `BUS-DELETE-${Date.now()}`
          });

        const busToDelete = createResponse.body.bus._id;

        const response = await request(app)
          .delete(`${BASE_URL}/v1/bus/${busToDelete}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Bus deleted successfully');
        expect(response.body.bus).toHaveProperty('id', busToDelete);
      });

    });

  });

  // ============ PAYMENT TESTS ============

  describe('PAYMENT ENDPOINTS', () => {

    describe('POST /v1/payment', () => {

      beforeAll(async () => {
        // Create a test user for payment
        const userResponse = await request(app)
          .post(`${BASE_URL}/v1/user/signUp`)
          .send({
            name: 'Payment Test User',
            email: `payment${Date.now()}@example.com`,
            password: 'password123'
          });

        paymentUserId = userResponse.body.user.id;
      });

      test('Should successfully process payment (201)', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: 500,
            busId: busId,
            seat: 'A1'
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Payment successful');
        expect(response.body).toHaveProperty('payment');
        expect(response.body).toHaveProperty('seat', 'A1');
        expect(response.body).toHaveProperty('amount', 500);
      });

      test('Should return 400 if payment ID is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            amount: 500,
            busId: busId,
            seat: 'A1'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if payment ID format is invalid', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: 'invalid-id',
            amount: 500,
            busId: busId,
            seat: 'A1'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if amount is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            busId: busId,
            seat: 'A1'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if amount is negative', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: -100,
            busId: busId,
            seat: 'A1'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if bus ID is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: 500,
            seat: 'A1'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 400 if seat is missing', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: 500,
            busId: busId
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      test('Should return 404 if bus not found', async () => {
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: 500,
            busId: '507f1f77bcf86cd799439099',
            seat: 'A1'
          });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Bus not found');
      });

      test('Should return 409 if seat already booked', async () => {
        // Try to book the same seat twice
        const response = await request(app)
          .post(`${BASE_URL}/v1/payment`)
          .send({
            paymentId: paymentUserId,
            amount: 500,
            busId: busId,
            seat: 'A1'
          });

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message', 'Seat is already booked');
      });

    });

  });

});
