const { Schema, model } = require('mongoose');
const Appointment = require('./Appointment');
const Review = require('./Review')
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  password: {
    type: String, 
    required: true
  },
  appointments: [
    {
      type: Schema.types.ObjectId,
      ref: 'Appointment'
    } 
  ],
  reviews: [
    {
      type: Schema.types.ObjectId,
      ref: 'Review'
    }

  ],
  artist: {
    type: Boolean,
    default: false,
    required: true
  }
});

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
