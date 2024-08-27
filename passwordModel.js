const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR ? parseInt(process.env.SALT_WORK_FACTOR, 10) : 10;

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const auditLogSchema = new Schema({
  action: { type: String, required: true },
  username: { type: String, required: true },
  service: String,
  timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

const passwordSchema = new Schema({
  service: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
});

passwordSchema.pre('save', function(next) {
  const user = this;

  AuditLog.create({ action: "CREATE", username: user.username, service: user.service });

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

passwordSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);

    const action = isMatch ? "AUTH_SUCCESS" : "AUTH_FAILURE";
    AuditLog.create({ action, username: this.username, service: this.service });

    cb(null, isMatch);
  }.bind(this)); 
};

const Password = mongoose.model('Password', passwordSchema);

module.exports = { Password, AuditLog };