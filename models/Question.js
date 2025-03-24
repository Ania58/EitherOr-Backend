const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: String, default: 'Anonymous' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
  optionOne: { type: String, required: true },
  optionTwo: { type: String, required: true },
  votesOptionOne: { type: [String], default: [] },
  votesOptionTwo: { type: [String], default: [] },
  comments: { type: [commentSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
