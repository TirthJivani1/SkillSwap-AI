const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teachSkillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  proficiency: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
    default: 'Intermediate' 
  },
  yearsOfExperience: { type: Number, default: 1 },
  description: { type: String, trim: true }
}, { _id: true });

const learnSkillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  desiredLevel: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
    default: 'Intermediate' 
  },
  description: { type: String, trim: true }
}, { _id: true });

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  bio: { type: String, default: 'Passionate learner and skill exchanger.', trim: true },
  location: { type: String, default: 'Remote', trim: true },
  education: { type: String, default: 'Computer Science & Engineering', trim: true },
  interests: [{ type: String, trim: true }],
  availability: [{ 
    type: String, 
    enum: ['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible'],
    default: ['Weekends', 'Evenings'] 
  }],
  preferredMode: { 
    type: String, 
    enum: ['Online', 'Offline', 'Hybrid'], 
    default: 'Online' 
  },
  experienceLevel: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
    default: 'Intermediate' 
  },
  skillsTeach: [teachSkillSchema],
  skillsLearn: [learnSkillSchema],
  isOnline: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Password Hash Pre-save Hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
