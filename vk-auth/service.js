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

/*function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
	//var userCookie = document.getElementById("email");
	var userCookie = getCookie(args["email"]);
	if (userCookie != "" && userCookie != null) 
	{
	   setCookie(args["email"], userCookie, 30);
	   alert("welcome" + userCookie);
	}
}*/

var service = {
    AuthenticationService : {
        authenticationPort : {
            save: function (args) {
				var authenticationCorrect = false;
				if (validUser(args) >= 0)
				{
					authenticationCorrect = true;
				}
				//var showUser = false;
                return {
					
					"Hello": args["email"]
					//checkCookie();
					//isLogin: true
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

