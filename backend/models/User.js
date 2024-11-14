
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'staff'], required: true },
  // added appliedServices array
  appliedServices: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, // assuming you have a Service model
      appliedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
