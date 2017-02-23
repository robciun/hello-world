"use strict";

var soap = require('soap');
var http = require('http');
var xml = require('fs').readFileSync('authentication.wsdl', 'utf8');
var user = [{"email":"testUser@gmail.com", "password":"perfectUser"}];
function validUser(args)
{
	for (var i in user)
	{
		if (user[i]["email"] == args["email"] && user[i]["password"] == args["password"])
			return i;
	}
	return -1;
}

var service = {
    AuthenticationService : {
        authenticationPort : {
            save: function (args) {
				var authenticationCorrect = false;
				if (validUser(args) >= 0)
				{
					authenticationCorrect = true;
				}
                return {
					isLogin: authenticationCorrect
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

