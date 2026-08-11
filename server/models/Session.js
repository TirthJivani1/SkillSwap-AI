const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  startTime: { type: String, required: true }, // Format HH:mm
  endTime: { type: String, required: true },
  meetingType: { type: String, enum: ['Online', 'Offline'], default: 'Online' },
  meetingLink: { type: String, default: 'https://meet.google.com/skillswap-demo' },
  notes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Cancelled'], 
    default: 'Scheduled' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
