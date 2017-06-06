//var dbUsers = mongoose.Schema({
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var dbUsers = new Schema({

  email:{
    type: String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  name:{
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
});

dbUsers.pre('save', function(next) {
  var user = this;
  if( this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

dbUsers.methods.checkPasswordMatch = function(pw, hs){
  bcrypt.compare(pw, this.password, function(err, matchTrue){
    if(err){
      return hs(err);
    }
    hs(null, matchTrue);
  });
};



module.exports = mongoose.model('User', dbUsers);
