'use strict'
var soap = require('soap');
var url = 'http://localhost:8001/tears?wsdl';

var express = require('express')
var bodyparser = require('body-parser')
var app = express()
//var email ="EZ";
app.use(bodyparser.urlencoded({"extended":true}));

app.use("/login",express.static("html",{index:"login.html"}));
app.post("/login", function(request, response){
	
	soap.createClient(url, function(error, client) {
    if (error) {
        throw error;
    }

    var data = {
        email:      request.body["email"],//"labas@gmail.com", // Fill your name
        password:    request.body["pw"]//"password", // Fill your last name
    }

    client.describe().AuthenticationService.authenticationPort;
    client.save(data,function(err,res){
            if (err) throw err;

            // Response from web service
            console.log (res);
			//app.get('/', function (req, res) {
			response.send(res);
			//});
			
    });
});
	
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


/*soap.createClient(url, function(error, client) {
    if (error) {
        throw error;
    }

    var data = {
        email:      "labas@gmail.com", // Fill your name
        password:  "15264879845dawd1514", // Fill your last name
    }

    client.describe().AuthenticationService.authenticationPort;
    client.save(data,function(err,res){
            if (err) throw err;

            // Response from web service
            console.log (res);
			app.get('/', function (req, res) {
			res.send(data)
			});
			
    });
});*/
