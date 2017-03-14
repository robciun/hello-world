var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/exampleDB", function(err, db) {
	/*if(err) {
		return console.dir(err);
	}*/
	if(!err) {
		console.log("Success!");
	}
	});
	/*db.collection('test', function(err, collection) {});
	db.collection('test', {w:1}, function(err, collection) {});
	db.createCollection('test', function(err, collection) {});
	db.createCollection('test', {w:1}, function(err, collection) {});
	
	var collection = db.collection('test');
	
	var doc = {mykey:1, fieldtoupdate:1};
	
	var docs = [{mykey:1}, {mykey:2}, {mykey:3}];
	
	collection.insert(docs, {w:1}, function(err, result) {
		
		collection.remove({mykey:1});
		
		collection.remove({mykey:2}, {w:1}, function(err, result {});
		
		collection.remove();
		
		collection.find().toArray(function(err, items) {});
		
		var stream = collection.find({mykey:{$ne:2}}).stream();
		stream.on("data", function(item) {});
		stream.on("end", function() {});
		
		collection.findOne({mykey:1}, function(err, item) {})
		
	});
	
	var doc1 = {'hello':'doc1'};
	var doc2 = {'hello':'doc2'};
	var lotsOfDocs = [{'hello':'doc3'}, {'hello':'doc4'}];
	
	//collection.insert(doc1);
	collection.insert(doc, {w:1}, function(err, result) {
		collection.update({mykey:1}, {$set:{fieldtoupdate:2}}, {w:1}, function(err, result) {});
	});
	
	var doc2 = {mykey:2, docs:[{doc1:1}]};
	
	collection.insert(doc2, {w:1}, function(err, result) {
		collection.update({mykey:2}, {$push:{docs:{doc2:1}}}, {w:1}, function(err, result) {});
	});
	
	collection.insert(doc2, {w:1}, function(err, result) {});
	collection.insert(lotsOfDocs, {w:1}, function(err, result) {});
});*/