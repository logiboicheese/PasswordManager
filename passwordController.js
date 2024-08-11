const mongoose = require('mongoose');
require('dotenv').config();
const Password = require('./passwordModel');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const createPassword = async (req, res) => {
    try {
        const newPassword = new Password(req.body);
        await newPassword.save();
        res.status(201).json(newPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPasswords = async (req, res) => {
    try {
        const passwords = await Password.find();
        res.status(200).json(passwords);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getPasswordById = async (req, res) => {
    try {
        const password = await Password.findById(req.params.id);
        res.status(200).json(password);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const updatedPassword = await Password.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletePassword = async (req, res) => {
    try {
        await Password.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Password deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    createPassword,
    getPasswords,
    getPasswordById,
    updatePassword,
    deletePassword
};