var express = require('express');
var router = express.Router();
var app = express();

app.get('/', function(req, res) {
	res.send('respond with a resource');
});

app.get('/userlist', function(req, res) {
	var db = req.db;
	db.collection('userlist').find().toArray(function (err, items) {
		res.json(items);
	});
});

app.post('/adduser', function(req, res) {
	var db = req.db;
	db.collection('userlist').insert(req.body, function(err, result){
		res.send(
		(err === null) ? { msg: '' } : { msg: err });
	});
});

app.put('/updateuser/:id', function(req, res) {
	var db = req.db
	var userToUpdate = req.params.id;
	var doc = { $set: req.body};
	db.collection('userlist').updateById(userToUpdate, doc, function(err, result) {
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
	});
});

app.delete('/deleteuser/:id', function(req, res) {
	var db = req.db;
	var userToDelete = req.params.id;
	db.collection('userlist').removeById(userToDelete, function(err, result) {
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err});
	});
});

module.exports = router;
app.listen(3002, function () {
  console.log('VK-auth app listening on port 3002!')
})
