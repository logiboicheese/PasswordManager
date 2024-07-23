const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const passwordSchema = new mongoose.Schema({
  name: String,
  value: String,
});

const Password = mongoose.model('Password', passwordSchema);

app.get('/passwords', async (req, res) => {
  const passwords = await Password.find();
  res.send(passwords);
});

app.post('/passwords', async (req, res) => {
  const { name, value } = req.body;
  
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(value, saltRounds);
  
  const password = new Password({
    name: name,
    value: hashedFlagged wordspng,
  });

  await password.save();
  res.send({name: password.name, message: "Password saved successfully!"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});