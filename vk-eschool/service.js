var soap = require('soap');
var http = require('http');
var xml = require('fs').readFileSync('authentication.wsdl', 'utf8');
var mongoose = require('mongoose');
var User = require('./dbConnections/user');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/emokykla');

var service = {
    AuthenticationService : {
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
soap.listen(server, '/vk-auth', service, xml);
