var mongoose = require('mongoose');
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
        ]
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
