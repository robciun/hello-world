"use strict";

var soap = require('soap');
var http = require('http');
var xml = require('fs').readFileSync('authentication.wsdl', 'utf8');
var user = [{"email":"a@gmail.com", "password":"a", "role":"admin"},
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
}

var service = {
    AuthenticationService : {
        authenticationPort : {
            save: function (args) {
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
            }
        }
    }
};


var server = http.createServer(function(request,response) {
    response.end("404: Not Found: " + request.url);
});

server.listen(8001);
soap.listen(server, '/tears', service, xml);
