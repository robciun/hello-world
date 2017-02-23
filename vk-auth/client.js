'use strict'
var soap = require('soap');
var url = 'http://localhost:8001/tears?wsdl';

var express = require('express')
var exSession = require('express-session')
var bodyparser = require('body-parser')
var app = express()
app.use(bodyparser.urlencoded({"extended":true}));

app.use("/login",express.static("html",{index:"login.html"}));
app.use(exSession({
	"secret":"DQW5435FWEFWERHER345HER15EGERVEH",
	"resave":false,
"saveUninitialized":true}));
app.get("/", function(request, response){
	if (request.session["sessionUser"])
	{
		response.send("Hello " + request.session["email"]+'<br><a href="/logout">Logout</a>')
	}
	else
	{
		response.redirect("/login");
	}
});

app.get("/logout", function(request, response){
	if (request.session["sessionUser"])
	{
		request.session.destroy(function(error){
		if(error)
		{
			throw error;
		}
		response.redirect("/login");
		});
	}
	else
	{
		response.redirect("/login");
	}
});

app.post("/login", function(request, response){
	
	soap.createClient(url, function(error, client) {
    if (error) {
		response.send("Serverio klaida!!!");
        throw error;
    }

    var data = {
        email:      request.body["email"],
        password:    request.body["pw"]
    }

    client.describe().AuthenticationService.authenticationPort;
    client.save(data,function(err,res){
            if (err) 
			{
				response.send("Serverio klaida!!!");
				throw err;
			}
            console.log (res);
			if (res["isLogin"]==true || res["isLogin"]=="true")
			{
				request.session.regenerate(function(error){
				if(error)
				{
					response.send("Serverio klaida!!!");
					throw error;					
				}
				request.session["sessionUser"]=true;
				request.session["email"]= request.body["email"];
				response.redirect("/");
				})
			}
			else
			{
				response.send("Nepavyko prisijungti");
			}			
    });
});
	
});
app.listen(3000, function () {
  console.log('VK-auth app listening on port 3000!')
})


