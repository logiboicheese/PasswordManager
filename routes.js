const express = require('express');
const passwordController = require('./passwordController');

const router = express.Router();

const asyncErrorHandler = fn => 
    (req, res, next) => 
        Promise.resolve(fn(req, res, next)).catch(next);

router.post('/passwords', asyncErrorHandler(passwordController.createPassword));
router.put('/passwords/:id', asyncErrorHandler(passwordController.updatePassword));
router.delete('/passwords/:id', asyncErrorHandler(passwordController.deletePassword));
router.get('/passwords', asyncErrorHandler(passwordController.getPasswords));

router.use((err, req, res, next) => {
    console.error(err); 
    res.status(500).send({ error: 'An internal server error has occurred.' });
});

module.exports = router;