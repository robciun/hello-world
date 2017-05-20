var express = require('express');
var bodyParser = require('body-parser');
//var router = express.Router();
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
	Lecture.findById(req.params.id, function(result) {
		res.send(result);
	});
})

app.post('/lectureSpecific', function(req, res) {

	var lect = {
		programmingLanguage: req.body.programmingLanguage,
		lecturerName: req.body.lecturerName,
		level: req.body.level,
		lectures: []
	};

	for (var i = 0; i < req.body.lectures.length; i++) {
		lect.lectures.push({
			name: req.body.lectures[i].name,
			tasks: []
		});
		for (var j = 0; j < req.body.lectures[i].tasks.length; j++) {
			var tsk = {
				task: req.body.lectures[i].tasks[j].task,
				answer: req.body.lectures[i].tasks[j].answer,
				slides: []
			};

			for (var x = 0; x < req.body.lectures[i].tasks[j].slides.length; x++) {
				var slide = {
					name: req.body.lectures[i].tasks[j].slides[x].name,
					info: req.body.lectures[i].tasks[j].slides[x].info
				}
				tsk.slides.push(slide);
			};
			lect.lectures[lect.lectures.length-1].tasks.push(tsk);
		};
	};

	var newLecture = new Lecture(lect);
	newLecture.save(function(err, res) {
		if (err) {
			return console.log(err);
		}
		console.log('Lecture created');

		res.send(result);
	/*var db = req.db;
	db.collection('userlist').insert(req.body, function(err, result){
		res.send(
		(err === null) ? { msg: '' } : { msg: err });*/
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

	/*var db = req.db
	var userToUpdate = req.params.id;
	var doc = { $set: req.body};
	db.collection('userlist').updateById(userToUpdate, doc, function(err, result) {
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
	});
});*/

app.get('/lectureSpecific/user/:idUser', function(req, res) {
	Lecture.find({'lecturerName': req.params.idUser}, function(err, result) {
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
	/*var db = req.db;
	var userToDelete = req.params.id;
	db.collection('userlist').removeById(userToDelete, function(err, result) {
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err});*/
	});
});

app.post('/lectureSpecific/:id/lecture/:idLect/task/:idTask/answerTrue', function(req, res) {
	Lecture.findById(req.params.id, function(err, res) {
		if (err) {
			throw err;
		}
		result.lectures.id(req.params.idLect).taks.id(req.params.idTask).users.push({userID: req.body.UserID});
		result.save();

		res.json({success: true, msg: 'Atsakymas teisingas'});
	});
})

module.exports = router;
app.listen(3002, function () {
  console.log('VK-auth app listening on port 3002!')
})
