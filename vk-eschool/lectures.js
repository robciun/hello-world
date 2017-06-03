var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var Lecture = require('./dbConnections/lecture.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('respond with a resource');
});

app.get('/lectureList', function(req, res) {
	Lecture.find({}, function(result) {
		res.send(result);
	});
});

app.get('/lectureSpecific/:id', function(req, res) {
	Lecture.findById(req.params.id, function(error, result) {
		if (error)
			return console.log(error);
		res.send(result);
	});
})

app.post('/lectureSpecific', function(req, res) {

	var lect = {
		programmingLanguage: req.body.programmingLanguage,
		userName: req.body.userName,
		level: req.body.level,
		description: req.body.description,
		themes: []
	};

	for (var i = 0; i < req.body.themes.length; i++) {
		lect.themes.push({
			name: req.body.themes[i].name,
			tasks: []
		});
		for (var j = 0; j < req.body.themes[i].tasks.length; j++) {
			var tsk = {
				task: req.body.themes[i].tasks[j].task,
				answer: req.body.themes[i].tasks[j].answer,
				slides: []
			};

			for (var x = 0; x < req.body.themes[i].tasks[j].slides.length; x++) {
				var slide = {
					name: req.body.themes[i].tasks[j].slides[x].name,
					info: req.body.themes[i].tasks[j].slides[x].info
				}
				tsk.slides.push(slide);
			};
			lect.themes[lect.themes.length-1].tasks.push(tsk);
		};
	};

	var newLecture = new Lecture(lect);
	newLecture.save(function(err, res) {
		if (err) {
			return console.log(err);
		}
		console.log('Lecture created');

		res.send(result);
	});
});

app.post('/lectureSpecific/:id/addTask', function(req, res) {
	Lecture.findById(req.params.id, function(err, newLecture) {
		if (err) {
			throw err;
		} else {
		newLecture.tasks.push({
			task: req.body.task,
			answer: req.body.answer,
			slides: req.body.slides
		});
		newLecture.save();
		res.send(newLecture);
	}
	})
});

app.put('lectureSpecific/updateLecture/:id', function(req, res) {
	Lecture.findById(req.params.id, {new: true}, function(err, newLecture) {
		if (err) {
			throw err;
		} else {
		for (var field in Lecture.schema.paths) {
			if((field !== '_id') && (field !== '_v')) {
				if (req.body[field] !== undefined) {
				newLecture[field] = req.body[field];
			}
			}
	}
	newLecture.save();
}
 res.send(newLecture);
 })
});

app.put('/lectureSpecific/updateLecture/id/:idTask', function(req, res) {
	Lecture.findOneAndUpdate({"_id": req.params.id, "tasks._id": req.params.idTask},
	req.body, {new:true}, function(err, result) {
		if (err) {
			throw err;
		}
		res.send(result);
	});
});

app.post('/lectureSpecific/:id/:idTask/slideAdd', function(req, res) {
	Lecture.findById(req.params.id, function(err, newLecture) {
		if (err) {
			throw err;
		}

		for (var i = 0, lenLect = newLecture.tasks.length; i < lenLect; i++) {
			if (newLecture.tasks[i]._id == req.params.idTask) {
				newLecture.tasks[i].slides.push({
					name: req.body.name,
					info: req.body.info
				});
			}
		}
		newLecture.save();
		res.send(newLecture);
	});
});

app.get('/lectureSpecific/user/:idUser', function(req, res) {
	Lecture.find({'userName': req.params.idUser}, function(err, result) {
		if (err) {
			throw err;
		}
		res.send(result);
	});
})

app.delete('/lectureSpecific/:id', function(req, res) {
	Lecture.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			throw err;
		}
		res.send('Successful delete');
	});
});

app.post('/lectureSpecific/:id/theme/:idTheme/task/:idTask/answerTrue', function(req, res) {
	Lecture.findById(req.params.id, function(err, res) {
		if (err) {
			throw err;
		}
		result.themes.id(req.params.idTheme).taks.id(req.params.idTask).users.push({userID: req.body.userID});
		result.save();

		res.json({success: true, msg: 'Atsakymas teisingas'});
	});
})

//module.exports = router;
app.listen(8002, function () {
  console.log('VK-auth app listening on port 8002!')
})
