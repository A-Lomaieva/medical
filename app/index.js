'use strict';
var express = require('express');
var app = express();
var pg = require('pg');

var patient = require('./patient');

// var multer = require('multer');

// var storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads');
//   },
//   filename: function (req, file, callback) {
//     const originalname = file.originalname;
//     let name = originalname.substr(0, originalname.lastIndexOf('.'));
//     let extension = originalname.substr(originalname.lastIndexOf('.') + 1);
//     callback(null, `${name}-${Date.now()}.${extension}`);
//   }
// });
// var upload = multer({storage: storage});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/assets'));
app.use('/uploads', express.static(__dirname + '/../uploads'));

app.use('/css', express.static(__dirname + '/../node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/../node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/../node_modules/jquery/dist'));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/upload', function (req, res) {
  res.sendFile(__dirname + '/views/upload.html');
});

app.use('/api/patient', patient);

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
