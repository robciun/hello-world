"use strict";

var soap = require('soap');
var http = require('http');
var xml = require('fs').readFileSync('vk-auth/authentication.wsdl', 'utf8');
var mongoose = require('mongoose');
var db = mongoose.connection;
var webToken = require('jsonwebtoken');
user = require('../dbConnections/user');
mongoose.connect('mongodb://localhost/emokykla');
/*var user = [{"email":"a@gmail.com", "password":"a", "role":"admin"},
						{"email":"b@gmail.com", "password":"b", "role":"user"}
					];
function validUser(args)
{
	for (var i in user)
	{
		if (user[i]["email"] == args["email"] && user[i]["password"] == args["password"])
			return i;
	}
	return -1;
}

function authenticateUser(args){
	for (var i in user)
	{
		if (user[i]["email"] == args["email"] && user[i]["password"] == args["password"])
			return user[i];
	}
	return null;
}*/

var service = {
    AuthenticationService : {
        authenticationPort : {
					checkTokenCreation: function(token, callback) {

						webToken.verify(token["token"], "secret",
						function(err, decode) {
							if(err) {
								callback({validToken:false});
							}
								callback({validUser:true});
						})
					},
					checkAuthentication: function(args, callback) {

						user.checkUserMatch(args["email"], args["password"],
					function(match) {

						if(!match){
							callback({validUser:false, token:null});
						}
						else {
							var data = {
								id:match.id,
								email:match.email
							}

							callback({validUser:true, token:data});
						}

					});
					}
            /*save: function (args) {
				var authenticationCorrect = false;
				var user = authenticateUser(args);
				if (user != null)
				{
					authenticationCorrect = true;
				}

				return {
								isLogin: authenticationCorrect,
								isAdmin : user["role"] == "admin"
                }
            }*/
        }
    }
};


var server = http.createServer(function(request,response) {
    response.end("404: Not Found: " + request.url);
});

server.listen(8001);
soap.listen(server, '/vk-auth', service, xml);
