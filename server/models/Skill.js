const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Programming & Tech', 'Design & Creative', 'Data & AI', 'Business & Marketing', 'Personal Development', 'Languages'],
    default: 'Programming & Tech'
  },
  description: { type: String, trim: true },
  iconName: { type: String, default: 'Code' }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
