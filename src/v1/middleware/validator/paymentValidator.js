import { body, validationResult } from 'express-validator';

const makePaymentValidation = [
    body('busId').isMongoId().withMessage('Invalid bus ID'),
    body('seat')
        .isArray({ min: 1 })
        .withMessage('At least one seat must be selected')
        .custom((seats) => {
            if (!seats.every(s => typeof s === 'string')) {
                throw new Error('Each seat must be a valid string identifier');
            }
            return true;
        }),
        
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export { makePaymentValidation };