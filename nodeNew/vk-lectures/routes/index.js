var express = require('express');
var router = express.Router();

//home page
router.get('/', function(req, res) {
	res.render('index',{ title: 'E-mokykla'});
});

module.exports = router;