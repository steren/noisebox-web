process.chdir(__dirname);

var express = require('express'),
        mongoose = require('mongoose');

var app = express.createServer();

// public directory
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

app.use(express.bodyParser());

// Tag
var TagSchema = new mongoose.Schema({
    id : String
  , content: {}
  , updated: Date
  , created: {type: Date, default: Date.now}
});
var Tag = mongoose.model('Tag', TagSchema);

// Box
var BoxSchema = new mongoose.Schema({
    id: String
  , created: {type: Date, default: Date.now}
  , latesttag: String
});
var Box = mongoose.model('Box', BoxSchema);

mongoose.connect('mongodb://localhost/noisebox');

/** Get a tag content
 * @param id : id of the tag
 * @param boxid : id of the box
 */
app.get('/tag/:id', function(req, res){
  if( req.param('id') ) {
	  console.log("GET Tag", req.param('id'));

    Tag.findOne({id : req.param('id')}, function (err, tag) {
      
      // delete tag._id;
      res.send(tag);

      // create or update box
      if(req.param('boxid')) {
        Box.findOne({id : req.param('boxid')}, function (err, doc) {
          var box = doc || new Box();
          box.id = req.param('boxid');
          box.latesttag = req.param('id');
          box.save();
        });
      }
    });

  } else {
    res.send(null);
  }
});

/** Set a tag content
 * @param id : id of the tag
 */
app.post('/tag', function(req, res){

  if( req.param('id') ) {
	  console.log("POST Tag", req.param('id'));
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

/** Get info abotu a box, including the last seen tag.
 * @param id : id of the box
 */
app.get('/box/:id', function(req, res){
  if( req.param('id') ) {
	  console.log("GET Box", req.param('id'));

    Box.findOne({id : req.param('id')}, function (err, doc) {
      res.send(doc);
    });

  } else {
    res.send(null);
  }
});

app.listen(3000);
