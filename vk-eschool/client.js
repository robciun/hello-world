'use strict'
var soap = require('soap');
var url = 'http://localhost:8001/vk-auth?wsdl';

var path = require('path');
var express = require('express');
var exSession = require('express-session');
var bodyparser = require('body-parser');
var jade = require('jade');
var app = express();

//var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');

var routes = require('./routes/index');
var users = require('./vk-lectures/lectures');

//var mongo = require('mongoskin');
//var db = mongo.db("mongodb://localhost:27017/vk-auth", {native_parser:true});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(function(req,res,next){
	req.db = db;
	next();
});

app.use('/', vk-lectures);
app.use('/users', users);

app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(cookieParser());

app.use(bodyparser.urlencoded({"extended":true}));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('views'));

app.use("/login",express.static("views",{index:"login.jade"}));
//app.use("/login",express.static("html",{index:"login.html"}));
//app.use("/admin",express.static("mongoRestAdminUser/views",{index:"index.jade"}));
//app.use("/admin",express.static("html",{index:"paskyrosTipas.html"}));
app.use(exSession({
	"secret":"DQW5435FWEFWERHER345HER15EGERVEH",
	"resave":false,
"saveUninitialized":true}));
/*app.get("/", function(request, response){
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
});*/

var userProfileURL = 'http://localhost:8002/user/';
var registrationURL = 'http://localhost:8002/registration/';
var lectureListURL = 'http://localhost:3002/lectureList/';
var userLectureURL = 'http://localhost:3002/lectureSpecific/user/';
var lectureSpecificURL = 'http://localhost:3002/lectureSpecific/';

app.get('/', function(req, res) {
	if (req.session.logged) {
		res.redirect('/lectureList');
	} else {
		res.redirect('/login');
	}
	/*res.render('index', {
		title: 'E-school',
		user: req.user
	});*/
});

function lecturerTrue(req, res, next) {
	if(req.session.role == 'lecturer') {
		return next();
	}
	res.redirect('/')
}

app.get('/login', function(req, res) {
	if (req.session.logged) {
		res.redirect('/');
	} else {
		soap.createClient(url, function(err, client) {
			if (err) {
				throw err;
			}
		var data = {
			email : req.body.email,
			password : req.body.password,
		}
		client.describe().service.authenticationPort;
		client.checkAuthentication(data, function(err, getLogin) {
			if (err) {
			throw err;
		}
		if(getLogin.validUser == 'true' || getLogin.validUser == true) {
			req.session.regenerate(function(err) {
				if (err) {
					throw err;
				}
			})

				req.session.logged = true;
				req.session.email = getLogin.user;
				req.session.role = getLogin.role;
				req.session.uid = getLogin.id;
				res.redirect('/lectureList');
			}
		});
	});
	}
});

	/*}
	res.render('login', {
		user: req.user
	});
});*/

app.get('/registration', function(req, res) {
	res.sendFile(__dirname + '/views/registration.jade');
	/*res.render('signup', {
		user: req.user
	});*/
});

app.post('/registration', function(req, res) {
	var usr = {
		url: registrationURL,
		form: {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			password2: req.body.password2,
			role: req.body.userRole
		}
	};
	request.post(usr, function(res, body) {
		res.redirect('/login');
	})
	/*var user = new User({
		user: req.body.user,
		email: req.body.email,
		password: req.body.password,
		password2: req.body.password2,
		role: req.body.role
	});

	user.save(function(err) {
		req.logIn(user, function(err) {
			console.log('Registration successful');
			res.redirect('/');
		});*/
	});
});

app.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		if(err) {
			throw err;
		} else {
			res.redirect('/login');
		}
	});
	/*req.logout();
	res.redirect('/');*/
});

app.get('/userProfile', function(req, res) {
	request(userProfileURL + req.session.uid, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('userProfile.jade', {user: parseJson});
	} else {
		throw err;
	}
	});
});

app.get('/userProfile/changeName', function(req, res) {
	request(userProfileURL + req.session.uid, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('updateName.jade', {user: parseJson});
	} else {
		throw err;
	}
	});
});

app.post('/userProfile/changeName', function(req, res) {
	var changing = {
		method: 'PUT',
		url: userProfileURL + req.session.uid + '/updateName',
		form: {
				name: req.body.name
		}
	};
	request(changing, function(err, res, body) {
		if (!err && res.statusCode == 200){
		res.redirect('/userProfile');
	} else {
		throw err;
	}
	});
});

app.get('/userProfile/changePw', function(req, res) {
	request(userProfileURL + req.session.uid, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('updatePw.jade', {user: parseJson});
	} else {
		throw err;
	}
	});
});

app.post('/userProfile/changePw', function(req, res) {
	var changing = {
		method: 'PUT',
		url: userProfileURL + req.session.uid + '/updatePw',
		form: {
				oldPw: req.body.oldPw,
				newPw: req.body.newPw,
				confirmPw: req.body.confirmPw
		}
	};
	request(changing, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		res.redirect('/userProfile');
	} else {
		throw err;
	}
	});
});

app.get('/lectureList', function(req, res) {
	request(lectureListURL, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('global.js', {lectureList: parseJson, role: req.sessions.role});
	} else {
		throw err;
	}
	});
});

app.get('/userLecture', lecturerTrue, function(req, res) {
	request(userLectureURL + req.session.uid, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('global.js', {lectureList: parseJson});
	} else {
		throw err;
	}
	});
});

app.get('/lectureAdd', lecturerTrue, function(req, res) {
	res.sendFile(__dirname + '/views/global.js');
});

app.post('/lectureAdd', lecturerTrue, function(req, res) {
		var lect = {
			url: lectureSpecificURL,
			form: {
			programmingLanguage: req.body.programmingLanguage,
			userName: req.body.userName,
			level: req.body.level,
			description: req.body.description,
			themes: req.body.themes
		}
	};

	request.post(lect, function(err, res, body) {
		if (!error && res.statusCode == 200) {
		res.redirect('/userLecture');
	} else {
		throw err;
	}
	});
});

app.get('lectureSpecific/:id', function(req, res) {
	request(lectureSpecificURL + req.params.id, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		request(userProfileURL + parseJson.userName, function(err, userNameRes, userNameBody) {
			if (!err && res.statusCode == 200) {
			var userNameParseJson = JSON.parse(userNameBody);
			res.render('global.js', {lectureSpecific: parseJson, userName: userNameParseJson.name, role: req.session.role});
		}
		})
	} else {
		throw err;
	}
	});
});

app.get('/lectureSpecific/:id/theme/:idTheme/:i', function(req, res) {
	request(lectureSpecificURL + req.params.id, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var parseJson = JSON.parse(body),
			userRights = [],
			theme = parseJson.themes[req.param.i];

			for (var i = 0; i < theme.tasks.length; i++) {
				userRights.push(false);
			};

			for (var i = 0; i < theme.tasks.length; i++) {
				for (var j = 0; j < theme.tasks[i].users.length; j++) {
					if (theme.tasks[i].users[j].userID == req.session.uid) {
						userRights[i] = true;
					}
				};
			};
			res.render('global.js', {
				theme: parseJson.themes[req.params.i],
				themeID: req.params.idTheme,
				lectureSpecificID: req.params.id,
				themeIndex: req.params.i,
				info: 'start',
				access: userRights});
			} else {
				throw err;
			}
	});
});

app.get('/lectureSpecific/:id/theme/:idTheme/:i/task/:idTask/:idTsk', function(req, res) {
	request(lectureSpecificURL + req.params.id, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var parseJson = JSON.parse(body),
			Tsk = parseJson.themes[req.params.i].tasks[req.params.idTsk],
			userRights = [],
			theme = parseJson.themes[req.param.i];

			for (var i = 0; i < theme.tasks.length; i++) {
				userRights.push(false);
			};

			for (var i = 0; i < theme.tasks.length; i++) {
				for (var j = 0; j < theme.tasks[i].users.length; j++) {
					if (theme.tasks[i].users[j].userID == req.session.uid) {
						userRights[i] = true;
					}
				};
			};
			res.render('global.js', {
				theme: parseJson.themes[req.params.i],
				themeID: req.params.idTheme,
				lectureSpecificID: req.params.id,
				themeIndex: req.params.i,
				info: 'task',
				task: t,
				access: userRights});
			} else {
				throw err;
			}
	});
});

app.post('/lectureSpecific/:id/theme/:idTheme/task/:idTask/answerTrue', function(req, res) {
	var answ = {
		url: 'http://localhost:3002/lectureSpecific/' + req.params.id + '/theme/' + req.params.idTheme + '/task/' + req.params.idTask + '/answerTrue',
		form: {
			userID: req.session.uid
		}
	};
	request.post(answ, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var parseJson = JSON.parse(body);
			res.send(parseJson);
		} else {
			throw err;
		}
	});
});

app.get('/lectureSpecific/:id/theme/:idTheme/:i/task/:idTask/:idTsk/slide/:idSlide/:idSlid', function(req,res){
	request(lectureSpecificURL + req.params.id, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var parseJson = JSON.parse(body),
			userRights = [],
			theme = parseJson.themes[req.param.i];

			for (var i = 0; i < theme.tasks.length; i++) {
				userRights.push(false);
			};

			for (var i = 0; i < theme.tasks.length; i++) {
				for (var j = 0; j < theme.tasks[i].users.length; j++) {
					if (theme.tasks[i].users[j].userID == req.session.uid) {
						userRights[i] = true;
					}
				};
			};
			res.render('global.js', {
				theme: parseJson.themes[req.params.i],
				themeID: req.params.idTheme,
				lectureSpecificID: req.params.id,
				themeIndex: req.params.i,
				info: 'slide',
				slide: parseJson.themes[req.params.i].tasks[req.params.idTsk].slides[req.params.idSlid],
				access: userRights});
			} else {
				throw err;
			}
	});
});


app.get('/lectureSpecific/:id/delete', lecturerTrue, function(req, res) {
	request(lectureSpecificURL + req.params.id, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		if (parseJson.userName == req.session.uid) {
			request.delete(lectureSpecificURL + req.params.id, function(res, body) {
				if (!err && res.statusCode == 200) {
				res.redirect('/userLecture');
			} else {
				throw err;
			}
		});
		} else {
			res.redirect('/lectureList');
		}
	} else {
		throw err;
	}
	});
});

app.post('/answerTrue', function(req, res) {
	var answ = {
		method: 'POST',
		url: userProfileURL + req.session.uid + '/updateName',
		form: {
			name: req.body.name
		}
	};
	request(answ, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			res.redirect('/userProfile');
		} else {
			throw err;
		}
	});
});

/*app.get("/admin", function(request, response) {
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
});*/


app.listen(3000, function () {
  console.log('VK-auth app listening on port 3000!')
})
