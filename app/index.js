'use strict';
var express = require('express');
var app = express();

var patient = require('./patient');
var attachment = require('./attachment');
var user = require('./user');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/assets'));
app.use('/uploads', express.static(__dirname + '/../uploads'));

app.use('/css', express.static(__dirname + '/../node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/../node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/../node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/../node_modules/angular'));
app.use('/js', express.static(__dirname + '/../node_modules/angular-route'));
app.use('/js', express.static(__dirname + '/../node_modules/angular-resource'));

app.use('/admin', express.static(__dirname + '/admin'));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/views/admin.html');
});

app.use('/api/patient', patient);
app.use('/api/attachment', attachment);
app.use('/api/user', user);

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
