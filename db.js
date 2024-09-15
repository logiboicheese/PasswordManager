require('dotenv').config();
const mongoose = require('mongoose');

const dbConnectionURL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const connectDB = async () => {
    try {
        await mongoose.connect(dbConnectionURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB is connected...');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

connectDB();

module.exports = mongoose.connection;