var soap = require('soap');
var http = require('http');
var xml = require('fs').readFileSync('authentication.wsdl', 'utf8');
var connectDb = require('./connectDb/database.js');
//var mongoose = require('mongoose');
var User = require('./dbConnections/user.js');
var mongoose = require('mongoose');


/*mongoose.connect('mongodb://robciun:vkdbpw951@ds111622.mlab.com:11622/vkeschool', function(err) {
  if (err) return console.log(err);
})*/

mongoose.connect(connectDb.database, function(err) {
  if (err) return console.log(err);
})

var service = {
    vkAuth : {
        authenticationPort : {
					checkAuthentication: function(args, callback) {
            User.findOne({'email': args.email}, function(err, getUser) {
              if (err) {
                throw err;
              }
              if (getUser === null) {
                callback({
                  validUser: false,
                  user: args.email,
                  role: '',
                  id: ''
                });
              } else {
                getUser.checkPasswordMatch(args.password, function(err, matchTrue) {
                  if(matchTrue && !err) {
                    callback({
                      validUser : true,
                      user: getUser.email,
                      role: getUser.role,
                      id: getUser.id
                    });
                  }
                });
              }
            });
          }
        }
    }
};


var server = http.createServer(function(request,response) {
    response.end("404: Not Found: " + request.url);
});

server.listen(8001);
soap.listen(server, '/login', service, xml);
