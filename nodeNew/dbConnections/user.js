var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var dbUsers = mongoose.Schema({

  email:{
    type: String,
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
var user = module.exports = mongoose.model('users', dbUsers);

userHash.pre('save', function(next) {
  var user = this;
  if(this.isModified('password') || this.isNew) {
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

module.exports.checkUserMatch = function(email, password, callback) {
  user.findOne({email:email, password:password},
  function(err, match) {
    if (err) {

    }
    callback && callback(match);
  });
}

module.exports.createUser = function(userInfo, callback) {
  user.create(userInfo, callback);
}

module.exports.checkUserExistance = function(email, callback) {
  user.findOne({email:email},
  function(err, match) {
    callback && callback(match);
  });
}

module.exports.getRole = function(userID, email, callback) {
  user.findOne({id:userID, email:email},
  function(err, match) {
    console.log(match);
  });
}
