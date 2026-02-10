import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Bus from '../../database/user.js'; // Adjust path to your model

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Bus Model Test', () => {
    
    it('should generate the correct seatSet on save', async () => {
        const busData = {
            busNumber: 'DHAKA-101',
            totalSeat: 10,
            seatsPerRow: 2,
            price: 500,
            departure: { location: 'Dhaka', date: new Date('2026-02-15T16:00:00Z') },
            arrival: { location: 'Chittagong', date: new Date('2026-02-15T22:00:00Z') }
        };

        const validBus = new Bus(busData);
        const savedBus = await validBus.save();

        // Check if 10 seats were created
        expect(savedBus.seatSet.length).toBe(10);
        // Check first seat label (Row A, Col 1)
        expect(savedBus.seatSet[0].seatNumber).toBe('a1');
    });

    it('should correctly calculate availableSeats virtual', async () => {
        const bus = await Bus.findOne({ busNumber: 'DHAKA-101' });
        
        // Manually book one seat
        bus.seatSet[0].booked.owner = new mongoose.Types.ObjectId();
        await bus.save();

        // availableSeats should now be 9 (10 - 1)
        const busJson = bus.toJSON();
        expect(busJson.availableSeats).toBe(9);
    });

    it('should hide __v and seatsPerRow in JSON response', async () => {
        const bus = await Bus.findOne({ busNumber: 'DHAKA-101' });
        const busJson = bus.toJSON();

        expect(busJson.__v).toBeUndefined();
        expect(busJson.seatsPerRow).toBeUndefined();
    });
});