var soap = require('soap');
var url = 'http://localhost:8001/login?wsdl';
var express = require('express');
var exSession = require('express-session');
var bodyparser = require('body-parser');
var app = express();
var request = require('request');

//var routes = require('./routes/index');
//var users = require('./vk-lectures/lectures');

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*app.use(function(req,res,next){
	req.db = db;
	next();
});*/

//app.use('/', vk-lectures);
//app.use('/users', users);

//app.use(logger('dev'));
//app.use(cookieParser());

app.use(bodyparser.urlencoded({"extended":true}));
app.use(express.static('views'));

app.use("/login",express.static("views",{index:"login.html"}));
app.use(exSession({
	"secret":"DQW5435FWEFWERHER345HER15EGERVEH",
	"resave":false,
"saveUninitialized":true}));

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
});

function lecturerTrue(req, res, next) {
	if(req.session.role == 'lecturer') {
		return next();
	}
	res.redirect('/')
}

app.post('/login', function(req, res) {
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
		client.describe().AuthenticationService.authenticationPort;
		client.checkAuthentication(data, function(error, getLogin) {
			if (error)
			throw error;
		if(getLogin.validUser == 'true' || getLogin.validUser == true) {
			req.session.regenerate(function(error) {
				if (error)
					throw error;

			})

				req.session.logged = true;
				req.session.email = getLogin.user;
				req.session.role = getLogin.role;
				req.session.uid = getLogin.id;
				res.redirect('/lectureList');
			} else {
				res.send("Netinkami duomenys");
			}
		});
	});
	}
});


app.get('/registration', function(req, res) {
	res.sendFile(__dirname + '/views/registration.html');
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
	request.post(usr, function(err, res, body) {
		if(!err && res.statusCode == 200) {
		console.log(body);
		res.redirect('/login');
	} else {
		console.log(error);
	}
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
});

app.get('/userProfile', function(req, res) {
	request(userProfileURL + req.session.uid, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('userProfile.ejs', {user: parseJson});
	} else {
		throw err;
	}
	});
});

app.get('/userProfile/changeName', function(req, res) {
	request(userProfileURL + req.session.uid, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('changeName.ejs', {user: parseJson});
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
		res.render('changePw.ejs', {user: parseJson});
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
		res.render('lectureSpecificMenu.ejs', {lectureList: parseJson, role: req.sessions.role});
	} else {
		throw err;
	}
	});
});

app.get('/userLecture', lecturerTrue, function(req, res) {
	request(userLectureURL + req.session.uid, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('userLecture.ejs', {lectureList: parseJson});
	} else {
		throw err;
	}
	});
});

app.get('/lectureAdd', lecturerTrue, function(req, res) {
	res.sendFile(__dirname + '/views/lectureActions.html');
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
	})
});

app.get('lectureSpecific/:id', function(req, res) {
	request(lectureSpecificURL + req.params.id, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		request(userProfileURL + parseJson.userName, function(err, userNameRes, userNameBody) {
			if (!err && res.statusCode == 200) {
			var userNameParseJson = JSON.parse(userNameBody);
			res.render('lectureSpecificMain.ejs', {lectureSpecific: parseJson, userName: userNameParseJson.name, role: req.session.role});
		}
	});
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
			res.render('lectureSpecificTheme.ejs', {
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
			res.render('lectureSpecificTheme.ejs', {
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
			res.render('lectureSpecificTheme.ejs', {
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

app.listen(3000, function () {
  console.log('VK-auth app listening on port 3000!')
})
