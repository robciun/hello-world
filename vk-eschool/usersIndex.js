var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./dbConnections/user.js');
var db = mongoose.connection;
var app = express();

var Schema = mongoose.Schema,
ObjectId  = Schema.ObjectId;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post('/registration', function(req, res) {
  if(!req.body.name || !req.body.email || (req.body.password !== req.body.password2) || !req.body.role) {
    res.json({success: false, msg: 'Error'});
  } else {
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
      role: req.body.role
    });
    newUser.save(function(err){
      if(err){
        return res.json({success: false, msg: 'This email is already used'});
      }
      res.json({success: true, msg: 'User created'});
    });
  }
});

app.get('/users', function(req, res) {
  User.find({}, function(err, result) {
    if(err) {
      return console.log(err);
    } else {
    res.send(result);
  }
  });
})

app.get('/user/:id', function(req, res){
  User.findById(req.params.id, function(err, result){
    if (err) return console.log('error');

    res.send(result);

});
})

app.put('/user/:id/updateName', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return console.log(err);
    if(!user) {
      return console.log("Error");
    } else {
    user.name = req.body.name;
    user.save(function(saveName) {
      if (err) {
        return console.log(saveName);
      } else {
      res.json({success: true, msg: 'Name changed'});
    }
    });
  }
  });
});

app.put('/user/:id/updatePw', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return console.log(err);
    if (!user) {
      return console.log("Error");
    } else {
    var oldPw = req.body.oldPw;
    var newPw = req.body.newPw;
    var confirmPw = req.body.confirmPw;
    user.checkPasswordMatch(oldPw, function(err, matchTrue) {
    if(matchTrue && !err) {
      if (newPw == confirmPw) {
        user.password = newPw;
        user.save(function(savePw) {
          if (err) {
            return console.log(saveName);
          } else {
          res.json({success: true, msg: 'Password changed'});
          console.log("Password changed");
        }
        });
      } else {
        res.json({success: false, msg: 'Passwords dont match'});
      }
    } else {
      res.json({success: false, msg: 'Incorrect password'});
    }
    });
  }
  });
});


app.listen(8002, function () {
  console.log('VK-auth app listening on port 8002!')
})
