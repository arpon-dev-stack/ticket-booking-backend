import { body, param, validationResult } from 'express-validator';

// Sign Up Validation
const signupValidation = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail().trim(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').isString().trim().notEmpty().withMessage('Name is required').matches(/^[A-Za-z\s'-]+$/).withMessage('only letter and space allowed'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Sign In Validation
const signinValidation = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail().trim(),
    body('password').notEmpty().withMessage('Password is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Update User Validation
const updateUserValidation = [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('email').optional().isEmail().withMessage('Please provide a valid email').normalizeEmail().trim(),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().isString().trim().matches(/^[A-Za-z\s'-]+$/).withMessage('only letter and space allowed'),
    body('role').optional().isArray().withMessage('Role must be an array'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Delete User Validation
const deleteUserValidation = [
    param('id').isMongoId().withMessage('Invalid user ID'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export { signupValidation, signinValidation, updateUserValidation, deleteUserValidation };