var express = require('express');
var app = express();
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var db;

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL,
		function(err, client) {
	if (err) throw err;
	console.log('Connected to postgres! Getting schemas...');
	db = client;
});

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/views/index.html');
});

app.get('/db-test', function(request, response) {
	db
			.query('SELECT * FROM patient;')
			.on('row', function(row) {
				response.send(
						`Got data from database:
						${JSON.stringify(row)}
						`
				);
			});
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
