const express = require('express');
const passwordController = require('./passwordController');

const router = express.Router();

const asyncErrorHandler = fn => 
    (req, res, next) => 
        Promise.resolve(fn(req, res, next)).catch(next);

router.post('/passwords', asyncErrorHandler(async (req, res, next) => {
    try {
        await passwordController.createPassword(req, res, next);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).send({ error: 'Invalid data format.' });
        }
        throw error;
    }
}));

router.put('/passwords/:id', asyncErrorHandler(async (req, res, next) => {
    try {
        await passwordController.updatePassword(req, res, next);
    } catch (error) {
        if (error.name === 'NotFound') {
            return res.status(404).send({ error: 'Password not found.' });
        }
        throw error;
    }
}));

router.delete('/passwords/:id', asyncErrorHandler(async (req, res, next) => {
    try {
        await passwordController.deletePassword(req, res, next);
    } catch (error) {
        if (error.name === 'NotFound') {
            return res.status(404).send({ error: 'Password to delete not found.' });
        }
        throw error;
    }
}));

router.get('/passwords', asyncErrorHandler(async (req, res, next) => {
    try {
        await passwordController.getPasswords(req, res, next);
    } catch (error) {
        throw error;
    }
}));

router.use((err, req, res, next) => {
    console.error(err);

    if (err.name === 'CustomError') {
        return res.status(err.status).send({ error: err.message });
    }

    res.status(500).send({ error: 'An internal server error has occurred.' });
});

module.exports = router;