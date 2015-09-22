'use strict';

//SSL Settings
var https = require('https');
var fs = require('fs');
var ssl_server_key = '../licenses/server_key.pem';
var ssl_server_crt = '../licenses/server_crt.pem';
var port = 3000;

var options = {
		key: fs.readFileSync(ssl_server_key),
		cert: fs.readFileSync(ssl_server_crt)
};

//Express Settings
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var basicAuth = require('basic-auth-connect');

//app.use(express.static('../views'));
app.use(bodyParser.json());

//Basic Auth Settings
app.use(basicAuth(function(user, password) {
	return user === 'maccha' && password === 'maccha';
}));

//Controller Settings
app.use('/controllers', express.static(__dirname + '/controllers'));


var work = require('./controllers/routes');

//Route Settings
app.get('/', work.findAll);
app.get('/user', work.findAllUser);
app.post('/work', work.findByName);
app.post('/work/today', work.findTodayByName);
app.post('/work/add', work.addWork);
//app.put('/works/:id', work.upateStaff);
//app.delete('works/:id', work.deleteStaff);

//Route Admin Settings
app.get('/worklist', function (req, res) {
	res.render('index', { title: '全ユーザ一覧', data: work.findAll });
});
app.get('/userlist', function (req, res) {
	res.render('user', { title: 'ユーザ一覧' });
});

//View Settings
app.set('views', '../views');
app.set('view engine', 'jade');


//Server Settings
app.set('port', process.env.PORT || port);
//app.set('port', 'ec2-52-69-128-126.ap-northeast-1.compute.amazonaws.com' || port);

https.createServer(options, app).listen(app.get('port'));
console.log('Listening on port 3000...');

