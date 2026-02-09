import { query, body, param, validationResult } from 'express-validator';

// Get Buses Validation (for query filters)
const getBusesValidation = [
    query('from').optional().trim().isString().withMessage('Enter your departure'),
    query('to').optional().trim().isString().withMessage('Enter you destination'),
    query('date').optional().isDate().withMessage('Enter valid date'),
    query('page').optional().isInt({min: 1}).withMessage('Enter valid page number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Get Bus Validation
const getBusValidation = [
    param('id').isMongoId().withMessage('Invalid bus ID'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Create Bus Validation
const createBusValidation = [
    body('busNumber').isString().trim().notEmpty().withMessage('Bus number is required'),
    body('totalSeat').isInt({ min: 1 }).withMessage('Total seat must be a positive integer'),
    body('seatsPerRow').optional().isInt({ min: 1 }).withMessage('Seats per row must be a positive integer'),
    body('departure.location').isString().trim().notEmpty().withMessage('Departure location is required'),
    body('departure.date').isISO8601().withMessage('Departure date must be a valid date'),
    body('arrival.location').isString().trim().notEmpty().withMessage('Arrival location is required'),
    body('arrival.date').isISO8601().withMessage('Arrival date must be a valid date'),
    body('busType').optional().isArray().withMessage('Bus type must be an array'),
    body('amenities').optional().isArray().withMessage('Amenities must be an array'),
    body('price').notEmpty().isNumeric().withMessage('Seat price have to be provide'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Update Bus Validation
const updateBusValidation = [
    param('id').isMongoId().withMessage('Invalid bus ID'),
    body('busNumber').optional().isString().trim(),
    body('totalSeat').optional().isInt({ min: 1 }).withMessage('Total seat must be a positive integer'),
    body('seatsPerRow').optional().isInt({ min: 1 }).withMessage('Seats per row must be a positive integer'),
    body('departure.location').optional().isString().trim(),
    body('departure.date').optional().isISO8601().withMessage('Departure date must be a valid date'),
    body('arrival.location').optional().isString().trim(),
    body('arrival.date').optional().isISO8601().withMessage('Arrival date must be a valid date'),
    body('busType').optional().isArray().withMessage('Bus type must be an array'),
    body('amenities').optional().isArray().withMessage('Amenities must be an array'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Delete Bus Validation
const deleteBusValidation = [
    param('id').isMongoId().withMessage('Invalid bus ID'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Book Seat Validation
const bookSeatValidation = [
    param('id').isMongoId().withMessage('Invalid bus ID'),
    body('seat').isString().trim().notEmpty().withMessage('Seat is required'),
    body('paymentId').isMongoId().withMessage('Invalid payment ID'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export { getBusesValidation, getBusValidation, createBusValidation, updateBusValidation, deleteBusValidation, bookSeatValidation };
