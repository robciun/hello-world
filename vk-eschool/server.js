var soap = require('soap');
var url = 'http://localhost:8001/login?wsdl';
var express = require('express');
var exSession = require('express-session');
var bodyparser = require('body-parser');
var app = express();
var request = require('request');

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('views'));

app.use("/login",express.static("views",{index:"login.html"}));
app.use(exSession({
	secret:"DQW5435FWEFWERHER345HER15EGERVEH",
	resave:false,
	saveUninitialized:true}));

var userProfileURL = 'http://localhost:8003/user/';
var registrationURL = 'http://localhost:8003/registration/';
var lectureListURL = 'http://localhost:8002/lectureList/';
var userLectureURL = 'http://localhost:8002/lectureSpecific/user/';
var lectureSpecificURL = 'http://localhost:8002/lectureSpecific/';

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

function loggedTrue(req, res, next) {
	if(req.session.logged) {
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
		client.describe().vkAuth.authenticationPort;
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
	var parameters = {
		url: registrationURL,
		form: {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			password2: req.body.password2,
			role: req.body.userRole
		}
	};
	request.post(parameters, function(err, res, body) {
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

app.get('/userProfile', loggedTrue, function(req, res) {
	request(userProfileURL + req.session.uid, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('userProfile.ejs', {user: parseJson});
	} else {
		throw err;
	}
	});
});

app.get('/userProfile/changeName', loggedTrue, function(req, res) {
	request(userProfileURL + req.session.uid, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('changeName.ejs', {user: parseJson});
	} else {
		throw err;
	}
	});
});

app.post('/userProfile/changeName', loggedTrue, function(req, res) {
	var parameters = {
		method: 'PUT',
		url: userProfileURL + req.session.uid + '/updateName',
		form: {
				name: req.body.name
		}
	};
	request(parameters, function(err, res, body) {
		if (!err && res.statusCode == 200){
		res.redirect('/userProfile');
	} else {
		throw err;
	}
	});
});

app.get('/userProfile/changePw', loggedTrue, function(req, res) {
	request(userProfileURL + req.session.uid, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('changePw.ejs', {user: parseJson});
	} else {
		throw err;
	}
	});
});

app.post('/userProfile/changePw', loggedTrue, function(req, res) {
	var parameters = {
		method: 'PUT',
		url: userProfileURL + req.session.uid + '/updatePw',
		form: {
				oldPw: req.body.oldPw,
				newPw: req.body.newPw,
				confirmPw: req.body.confirmPw
		}
	};
	request(parameters, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		res.redirect('/userProfile');
	} else {
		throw err;
	}
	});
});

app.get('/lectureList', loggedTrue, function(req, res) {
	request(lectureListURL, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('lectureSpecificMenu.ejs', {lectureList: parseJson, role: req.session.role});
	} else {
		throw err;
	}
	});
});

app.get('/userLecture', loggedTrue, lecturerTrue, function(req, res) {
	request(userLectureURL + req.session.uid, function(err, res, body) {
		if (!err && res.statusCode == 200) {
		var parseJson = JSON.parse(body);
		res.render('userLecture.ejs', {lectureList: parseJson});
	} else {
		throw err;
	}
	});
});

app.get('/lectureAdd', loggedTrue, lecturerTrue, function(req, res) {
	res.sendFile(__dirname + '/views/lectureActions.html');
});

app.post('/lectureAdd', loggedTrue, lecturerTrue, function(req, res) {
		var parameters = {
			url: lectureSpecificURL,
			form: {
			programmingLanguage: req.body.programmingLanguage,
			userName: req.body.userName,
			level: req.body.level,
			description: req.body.description,
			themes: req.body.themes
		}
	};

	request.post(parameters, function(err, res, body) {
		if (!error && res.statusCode == 200) {
		res.redirect('/userLecture');
	} else {
		throw err;
	}
	})
});

app.get('lectureSpecific/:id', loggedTrue, function(req, res) {
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

app.get('/lectureSpecific/:id/theme/:idTheme/:i', loggedTrue, function(req, res) {
	request(lectureSpecificURL + req.params.id, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var parseJson = JSON.parse(body),
			userRights = [],
			theme = parseJson.themes[req.params.i];

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

app.get('/lectureSpecific/:id/theme/:idTheme/:i/task/:idTask/:idTsk', loggedTrue, function(req, res) {
	request(lectureSpecificURL + req.params.id, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var parseJson = JSON.parse(body),
			Tsk = parseJson.themes[req.params.i].tasks[req.params.idTsk],
			userRights = [],
			theme = parseJson.themes[req.params.i];

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
				task: Tsk,
				access: userRights});
			} else {
				throw err;
			}
	});
});

app.post('/lectureSpecific/:id/theme/:idTheme/task/:idTask/answerTrue', loggedTrue, function(req, res) {
	var parameters = {
		url: 'http://localhost:3002/lectureSpecific/' + req.params.id + '/theme/' + req.params.idTheme + '/task/' + req.params.idTask + '/answerTrue',
		form: {
			userID: req.session.uid
		}
	};
	request.post(parameters, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var parseJson = JSON.parse(body);
			res.send(parseJson);
		} else {
			throw err;
		}
	});
});

app.get('/lectureSpecific/:id/theme/:idTheme/:i/task/:idTask/:idTsk/slide/:idSlide/:idSlid', loggedTrue, function(req,res){
	request(lectureSpecificURL + req.params.id, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var parseJson = JSON.parse(body),
			userRights = [],
			theme = parseJson.themes[req.params.i];

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


app.get('/lectureSpecific/:id/delete', loggedTrue, lecturerTrue, function(req, res) {
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

app.post('/answerTrue', loggedTrue, function(req, res) {
	var parameters = {
		method: 'POST',
		url: userProfileURL + req.session.uid + '/updateName',
		form: {
			name: req.body.name
		}
	};
	request(parameters, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			res.redirect('/userProfile');
		} else {
			throw err;
		}
	});
});

app.listen(8080, function () {
  console.log('VK-auth app listening on port 8080!')
})
