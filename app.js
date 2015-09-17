var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var _ = require('underscore');
var api = require('./api');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.use(sassMiddleware({
    src: path.join(__dirname, 'public/styles'),
    dest: path.join(__dirname, 'public/styles'),
    debug: true,
    force: true,
    prefix: '/styles'
}));

app.post('/open', function(req, res){
	var user = _.find(req.body.users, function(item){ return item.id  == req.body.username; });
 	if (user) {
 		if (user.password == req.body.password) {
 			var property = {'propertyId': ''};
 			property.propertyId = req.body.property;
	 		propertyDoors = _.where(user.doors, property);
	 		if (propertyDoors.length > 0) {

	 			var validDoor = _.find(propertyDoors, function(item){ return item.name  == req.body.door; });

	 			if (validDoor && validDoor.name == req.body.door) {
	 				res.send(JSON.stringify({text:'<p>Welcome<br>'+user.name+'</p>', flag: 'granted'}));
	 				console.log('Welcome '+user.name);
		 		}
		 		else{
		 			res.send(JSON.stringify({text:'<p>Access<br>Denied</p>', flag: 'denied'}));
		 			console.log('Access Denied to this door');
		 		}
	 		}
	 		else{
	 			res.send(JSON.stringify({text:'<p>Access<br>Denied</p>', flag: 'denied'}));
	 			console.log('Access Denied to this property');
	 		}
	 	}
	 	else{
	 		res.send(JSON.stringify({text:'<p>Access<br>Denied</p>', flag: 'denied'}));
	 		console.log('Access Denied - Check password');
	 	}
 	}
 	else{
 		res.send(JSON.stringify({text:'<p>Access<br>Denied</p>', flag: 'denied'}));
 		console.log('Access Denied - Check user');
 	}
});

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/api', api);

module.exports = app;