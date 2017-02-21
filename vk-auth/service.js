"use strict";

var soap = require('soap');
var http = require('http');
var xml = require('fs').readFileSync('authentication.wsdl', 'utf8');

var service = {
    AuthenticationService : {
        authenticationPort : {
            save: function (args) {
                return {
					isLogin: true
                    //formatedText: args.email + " " + args.password 
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

