const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1); 
  });

const passwordRecordSchema = new mongoose.Schema({
  serviceName: String,
  encryptedPassword: String,
});

const PasswordRecord = mongoose.model('PasswordRecord', passwordRecordSchema);

app.get('/passwords', async (req, res) => {
  try {
    const allPasswordRecords = await PasswordRecord.find();
    res.send(allPasswordRecords);
  } catch (err) {
    console.error('Failed to retrieve passwords:', err);
    res.status(500).send('Error fetching passwords.');
  }
});

app.post('/passwords', async (req, res) => {
  try {
    const { name: serviceName, value: rawPassword } = req.body;
    
    if (!serviceName || !rawPassword) {
      return res.status(400).send({ message: 'Service name and password are required.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
    
    const newPasswordRecord = new PasswordRecord({
      serviceName: serviceName,
      encryptedPassword: hashedPassword,
    });
  
    await newPasswordRecord.save();
    res.send({serviceName: newPasswordRecord.serviceName, message: "Password saved successfully!"});
  } catch (err) {
    console.error('Failed to save new password record:', err);
    res.status(500).send('Error saving the password record.');
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});