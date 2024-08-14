const mongoose = require('mongoose');
require('dotenv').config();
const PasswordEntry = require('./passwordModel');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const createPasswordEntry = async (req, res) => {
    try {
        const newPasswordEntry = new PasswordEntry(req.body);
        await newPasswordEntry.save();
        res.status(201).json(newPasswordEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllPasswordEntries = async (req, res) => {
    try {
        const passwordEntries = await PasswordEntry.find();
        res.status(200).json(passwordEntries);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getPasswordEntryById = async (req, res) => {
    try {
        const passwordEntry = await PasswordEntry.findById(req.params.id);
        res.status(200).json(passwordEntry);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updatePasswordEntry = async (req, res) => {
    try {
        const updatedPasswordEntry = await PasswordEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPasswordEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletePasswordEntry = async (req, res) => {
    try {
        await PasswordEntry.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Password entry deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    createPasswordEntry,
    getAllPasswordEntries,
    getPasswordEntryById,
    updatePasswordEntry,
    deletePasswordEntry
};