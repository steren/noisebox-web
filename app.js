process.chdir(__dirname);

var express = require('express'),
        mongoose = require('mongoose');

var app = express.createServer();

// public directory
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

// Tag
var TagSchema = new mongoose.Schema({
    id : String
  , content: {}
  , updated: {type: Date, default: Date.now}
});
var Tag = mongoose.model('Tag', TagSchema);

// Box
var BoxSchema = new mongoose.Schema({
    id: String
  , created: {type: Date, default: Date.now}
});
var Box = mongoose.model('Box', BoxSchema);

mongoose.connect('mongodb://localhost/noisebox');


app.get('/tag/:id', function(req, res){
  if( req.param('id') ) {
	  console.log(req.param('id'));

    Tag.findOne({id : req.param('id')}, function (err, doc) {
      // delete doc._id;
      res.send(doc);
    });

  } else {
    res.send(null);
  }
});

app.post('/tag', function(req, res){

  if( req.param('id') ) {
    Tag.findOne({id : req.param('id')}, function (err, doc) {
      var tag = doc || new Tag();

      tag.id = req.param('id');
      tag.updated = new Date();
      tag.content = req.param('content');

      tag.save(function(){
        // delete tag._id;
	      res.send(tag);
	    });
    });
  } else {
    res.send(null);
  }

});

app.get('/box', function(req, res){

});

app.listen(3000);
