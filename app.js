var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.json())

//app.configure(function(){
//  app.use(express.bodyParser());
//  app.use(app.router);
//});

work = require('./routes/works');

app.get('/', work.findAll);
app.get('/work', work.findAll);
app.post('/work/today', work.findTodayByName);
app.post('/work', work.addWork);
//app.put('/works/:id', work.upateStaff);
//app.delete('works/:id', work.deleteStaff);


app.listen(3000, 'ec2-52-68-68-148.ap-northeast-1.compute.amazonaws.com');
console.log('Listening on port 3000...');
