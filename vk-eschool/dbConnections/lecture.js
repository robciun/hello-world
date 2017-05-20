var mongoose = require('mongoose');
var dbLectures = new Schema({
  programmingLanguage: String,
  lecturerName: String,
  lecture: String,
  level: String,
  lectures:[{
    name: String,
    tasks: [
      {
        task: String,
        answer: String,
        slides: [
          {
            name: String,
            info: String
          }
        ]
      }
    ]
  }]
});

module.exports = mongoose.model('Lecture', dbLectures);
