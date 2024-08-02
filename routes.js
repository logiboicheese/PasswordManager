const express = require('express');
const passwordController = require('./passwordController');
const router = express.Router();
router.post('/passwords', passwordController.createPassword);
router.put('/passwords/:id', passwordController.updatePassword);
router.delete('/passwords/:id', passwordController.deletePassword);
router.get('/passwords', passwordController.getPasswords);
module.exports = router;