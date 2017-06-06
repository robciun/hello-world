var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dbLectures = new Schema({
  theme: String,
  description: String,
  programmingLanguage: String,
  level: String,
  userName: String,
  themes:[{
    name: String,
    tasks: [
      {
        task: String,
        answer: String,
        users: [
          {
            userID: String,
          }
        ],
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

var Lecture = mongoose.model('Lecture', dbLectures);

module.exports = Lecture;
