const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  completedWork: {
    type: String,
    required: true
  },
  objectives: {
    type: String,
    required: true
  },
  blockers: {
    type: String,
    default: 'None'
  }
}, { timestamps: true });

module.exports = mongoose.model('Update', updateSchema);