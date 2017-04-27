<<<<<<< HEAD
var express = require('express');
var router = express.Router();

//home page
router.get('/', function(req, res) {
	res.render('index',{ title: 'Express'});
});

=======
var express = require('express');
var router = express.Router();

//home page
router.get('/', function(req, res) {
	res.render('index',{ title: 'E-mokykla'});
});

>>>>>>> 912bdb2cebcf9b1f5fe886018f4bde1322b0770a
module.exports = router;