var mongoose = require('mongoose');
var dbLectures = new Schema({
  lecturerName: String,
  theme: String,
  level: String,
  programmingLanguage: String,
  tasks: [
    {
      task: String,
      answer: String
    }
  ]
});

module.exports = mongoose.model('Lecture', dbLectures);
