const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  resourceUrl: { type: String },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { _id: true });

const levelSchema = new mongoose.Schema({
  levelNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
  estimatedHours: { type: Number, default: 5 },
  topics: [topicSchema]
}, { _id: true });

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillTitle: { type: String, required: true },
  category: { type: String, default: 'General' },
  currentLevel: { type: Number, default: 1 },
  levels: [levelSchema]
}, { timestamps: true });

// Virtual to calculate dynamic progress percentage
roadmapSchema.virtual('progressPercentage').get(function () {
  let totalTopics = 0;
  let completedTopics = 0;
  if (this.levels && this.levels.length > 0) {
    this.levels.forEach(level => {
      if (level.topics) {
        totalTopics += level.topics.length;
        completedTopics += level.topics.filter(t => t.completed).length;
      }
    });
  }
  return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
});

roadmapSchema.set('toJSON', { virtuals: true });
roadmapSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
