var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./dbConnections/user.js');
var db = mongoose.connection;
var app = express();

var dbUsers = mongoose.dbUsers,
Id = dbUsers.Id;

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
    if (err) {
      return console.log('error');
    } else {
    res.send(result);
  }
});
});
app.listen(8002);
