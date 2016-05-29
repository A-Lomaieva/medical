'use strict';
var express = require('express');
var app = express();
var pg = require('pg');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    const originalname = file.originalname;
    let name = originalname.substr(0, originalname.lastIndexOf('.'));
    let extension = originalname.substr(originalname.lastIndexOf('.') + 1);
    callback(null, `${name}-${Date.now()}.${extension}`);
  }
});
var upload = multer({storage: storage});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

function dbConnect(callback) {
  pg.defaults.ssl = true;
  pg.connect(process.env.DATABASE_URL,
    function (err, client) {

      if (err) throw err;
      console.log('Connected to postgres!');
      callback(client);
    });
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/patient', function (req, res) {
  var reqQuest = req.query;
  var results = [];

  dbConnect((client) => {
    function done() {
      client.end();
      res.end();
    }

    var query = client.query(
      "SELECT * FROM patient WHERE name ILIKE ($1) AND doctor ILIKE ($2) AND hospital_code ILIKE ($3)",
      [
        `%${reqQuest.name || ''}%`,
        `%${reqQuest.doctor || ''}%`,
        `%${reqQuest.hospitalCode || ''}%`
      ]);

    query.on('row', function (row) {
      results.push(row);
    });

    query.on('end', function () {
      res.json(results);
      done();
    });

  });
});

app.get('/upload', function (req, res) {
  res.sendFile(__dirname + '/views/upload.html');
});

app.post('/upload', upload.single('file'), function (req, res) {
  res
    .json({
      filename: `/${req.file.path}`
    })
    .end();

});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
