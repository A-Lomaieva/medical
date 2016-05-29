'use strict';
var express = require('express');
var app = express();
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

var db;

function dbConnect(callback) {
	pg.defaults.ssl = true;
	pg.connect(process.env.DATABASE_URL,
			function (err, client) {

				if (err) throw err;
				console.log('Connected to postgres!');
				callback(client);
			});
}

app.get('/', function (request, response) {
	response.sendFile(__dirname + '/views/index.html');
});

app.get('/api/patient', function (request, response) {
	var requestQuest = request.query;
	var results = [];

	dbConnect((client) => {
		function done() {
			client.end();
			response.end();
		}

		var query = client.query(
				"SELECT * FROM patient WHERE name ILIKE ($1) AND doctor ILIKE ($2) AND hospital_code ILIKE ($3)",
				[
					`%${requestQuest.name || ''}%`,
					`%${requestQuest.doctor || ''}%`,
					`%${requestQuest.hospitalCode || ''}%`
				]);

		query.on('row', function(row) {
			results.push(row);
		});

		query.on('end', function() {
			response.json(results);
			done();
		});

	});
});


app.get('/db-test', function (request, response) {


});

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});
