'use strict'
var soap = require('soap');
var url = 'http://localhost:8001/vk-auth?wsdl';

var path = require('path');
var express = require('express');
var exSession = require('express-session');
var bodyparser = require('body-parser');
var jade = require('jade');
var app = express();

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/vk-auth", {native_parser:true});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(function(req,res,next){
	req.db = db;
	next();
});

app.use('/', routes);
app.use('/users', users);

app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(cookieParser());

app.use(bodyparser.urlencoded({"extended":true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/login",express.static("html",{index:"login.html"}));
//app.use("/admin",express.static("mongoRestAdminUser/views",{index:"index.jade"}));
//app.use("/admin",express.static("html",{index:"paskyrosTipas.html"}));
app.use(exSession({
	"secret":"DQW5435FWEFWERHER345HER15EGERVEH",
	"resave":false,
"saveUninitialized":true}));
app.get("/", function(request, response){
	if (request.session["sessionAdmin"])
	{
		response.redirect("/admin");
		//response.send("Hello " + request.session["email"]+'<br><a href="/logout">Logout</a>')
		//response.send("html\login.html");
	}
	else if(request.session["sessionUser"]){
		response.redirect("/user")
	}
	else
	{
		response.redirect("/login");
	}
});

app.get("/admin", function(request, response) {
	response.send(jade.renderFile("views/index.jade"))
});

app.get("/user", function(request, response) {
	response.send(jade.renderFile("views/user.jade"))
});

app.get("/logout", function(request, response){
	if (request.session["sessionUser"] || request.session["sessionAdmin"])
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

				if(res["isAdmin"] == true || res["isAdmin"] == "true"){
					request.session["email"]= request.body["email"];
					request.session["sessionAdmin"]=true;
					console.log ("isAdmin");
					response.redirect("/admin");
				}
				else{
					request.session["email"]= request.body["email"];
					request.session["sessionUser"]=true;
					console.log ("isUser");
					response.redirect("/user");
				}
				//response.redirect("/");
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
