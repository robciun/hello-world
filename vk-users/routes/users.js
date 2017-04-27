<<<<<<< HEAD
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.send('respond with a resource');
});

router.get('/userlist', function(req, res) {
	var db = req.db;
	db.collection('userlist').find().toArray(function (err, items) {
		res.json(items);
	});
});
	/*var collection = db.get('userlist');
	collection.find({},{},function(e,docs) {
		res.json(docs);
	});
});*/

router.post('/adduser', function(req, res) {
	var db = req.db;
	db.collection('userlist').insert(req.body, function(err, result){
		res.send(
		(err === null) ? { msg: '' } : { msg: err });
	});
});
	/*var collection = db.get('userlist');
	collection.insert(req.body, function(err, result) {
		res.send(
		(err === null) ? { msg: '' } : { msg: err}
		);
	});
});*/

router.put('/updateuser/:id', function(req, res) {
	var db = req.db
	var userToUpdate = req.params.id;
	var doc = { $set: req.body};
	db.collection('userlist').updateById(userToUpdate, doc, function(err, result) {
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
	});
});

router.delete('/deleteuser/:id', function(req, res) {
	var db = req.db;
	//var collection = db.get('userlist');
	var userToDelete = req.params.id;
	db.collection('userlist').removeById(userToDelete, function(err, result) {
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err});
	});
});
	/*collection.remove({ '_id' : userToDelete }, function(err) {
		res.send((err === null) ? { msg: ''} : { msg:'error: ' + err});
	});
});*/

=======
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.send('respond with a resource');
});

router.get('/userlist', function(req, res) {
	var db = req.db;
	db.collection('userlist').find().toArray(function (err, items) {
		res.json(items);
	});
});

router.post('/adduser', function(req, res) {
	var db = req.db;
	db.collection('userlist').insert(req.body, function(err, result){
		res.send(
		(err === null) ? { msg: '' } : { msg: err });
	});
});

router.put('/updateuser/:id', function(req, res) {
	var db = req.db
	var userToUpdate = req.params.id;
	var doc = { $set: req.body};
	db.collection('userlist').updateById(userToUpdate, doc, function(err, result) {
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
	});
});

router.delete('/deleteuser/:id', function(req, res) {
	var db = req.db;
	var userToDelete = req.params.id;
	db.collection('userlist').removeById(userToDelete, function(err, result) {
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err});
	});
});

>>>>>>> 912bdb2cebcf9b1f5fe886018f4bde1322b0770a
module.exports = router;