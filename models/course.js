const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  instructor: String,
  credits: Number
});

courseSchema.index({ courseName: 'text' });

module.exports = mongoose.model('Course', courseSchema);
