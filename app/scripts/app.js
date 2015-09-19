var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var basicAuth = require('basic-auth-connect');

app.use(express.static('../views'));
app.use(bodyParser.json());
app.use(basicAuth(function(user, password) {
	return user === 'maccha' && password === 'maccha';
}));

//app.configure(function(){
//  app.use(express.bodyParser());
//  app.use(app.router);
//});

work = require('./controllers/routes');

//ルート設定
app.get('/', work.findAll);
app.post('/work', work.findByName);
app.post('/work/today', work.findTodayByName);
app.post('/work/add', work.addWork);
//app.put('/works/:id', work.upateStaff);
//app.delete('works/:id', work.deleteStaff);


app.listen(3000, 'ec2-52-69-128-126.ap-northeast-1.compute.amazonaws.com');
console.log('Listening on port 3000...');

