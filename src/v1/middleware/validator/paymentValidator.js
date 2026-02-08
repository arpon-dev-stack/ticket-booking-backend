import { body, validationResult } from 'express-validator';

const makePaymentValidation = [
    body('paymentId').isMongoId().withMessage('Invalid payment ID'),
    body('busId').isMongoId().withMessage('Invalid bus ID'),
    body('name').isString().trim().notEmpty().withMessage('Name is required').matches(/^[A-Za-z\s'-]+$/).withMessage('only letter and space allowed'),
    body('seat').isArray({ min: 1, max: 2 }).withMessage('You can only book 1 or 2 seats'),
    body('seat.*')
        .isString().withMessage('Seat must be a string')
        .trim()
        .toLowerCase()
        .notEmpty().withMessage('Seat identifier cannot be empty'),
    body('buyingDate').isDate(),
    body('journeyDate').isDate().notEmpty().withMessage('Journey date must be provide'),

        (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
];

export { makePaymentValidation };
