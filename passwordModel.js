const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;
const passwordSchema = new Schema({
  service: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now }
});
const Password = mongoose.model('Password', passwordSchema);
module.exports = Password;