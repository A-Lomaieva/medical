'use strict';

var express = require('express');
var router = express.Router();
var dbConnect = require('./lib/db');
var parsePost = require('./lib/post');
var moment = require('moment');

function formatItem(item) {
  var date = moment(item.birthdate);
  return {
    id: item.id,
    name: item.name,
    doctor: item.doctor,
    hospitalCode: item.hospital_code,
    cardUrl: item.card_url,
    birthdate: item.birthdate,
    birthdateFormatted: date.format('DD/MM/YYYY'),
    diseases: item.diseases,
    allergies: item.allergies
  };
}

router
  .post('/', function (req, res) {
    parsePost(req, (data) => {
      dbConnect((client) => {
        function done() {
          client.end();
          res.end();
        }

        var query = client.query(
          "INSERT INTO patient(name, doctor, hospital_code, diseases, birthdate, allergies) " +
          "values($1, $2, $3, $4, $5, $6)",
          [data.name, data.doctor, data.hospitalCode, data.diseases, data.birthdate, data.allergies]
        );

        query.on('end', function () {
          res.json({success: true});
          done();
        });

        dbConnect.catchError(query, res);
      });
    });
  })
  .get('/', function (req, res) {
    var reqQuery = req.query;
    var items = [];

    dbConnect((client) => {
      function done() {
        client.end();
        res.end();
      }

      var query = client.query(
        "SELECT * FROM patient WHERE name ILIKE ($1) AND doctor ILIKE ($2) AND hospital_code ILIKE ($3) ORDER BY id ASC",
        [
          `%${reqQuery.name || ''}%`,
          `%${reqQuery.doctor || ''}%`,
          `%${reqQuery.hospitalCode || ''}%`
        ]);

      query.on('row', function (row) {
        items.push(formatItem(row));
      });

      query.on('end', function (result) {
        res.json({items: items});
        done();
      });

      dbConnect.catchError(query, res);
    });
  })
  .get('/:id', function (req, res) {
    var id = req.params.id;

    dbConnect((client) => {
      function done() {
        client.end();
        res.end();
      }

      var query = client.query("SELECT * FROM patient WHERE id = $1", [id]);

      query.on('row', function (row) {
        res.json({item: formatItem(row)});
      });

      query.on('end', done);

      dbConnect.catchError(query, res);
    });
  })
  .post('/:id', function (req, res) {
    var id = req.params.id;
    parsePost(req, (data) => {
      dbConnect((client) => {
        function done() {
          client.end();
          res.end();
        }

        var query = client.query(
          "UPDATE patient " +
          "SET name=($1), doctor=($2), hospital_code=($3), diseases=($4), birthdate=($5), allergies=($6) " +
          "WHERE id=($7)",
          [
            data.name, data.doctor, data.hospitalCode, data.diseases, data.birthdate, data.allergies,
            id
          ]
        );

        query.on('end', function () {
          res.json({success: true});
          done();
        });

        dbConnect.catchError(query, res);
      });
    });
  })
  .delete('/:id', function (req, res) {
    var id = req.params.id;
    dbConnect((client) => {
      function done() {
        client.end();
        res.end();
      }

      var query = client.query(
        "DELETE FROM patient WHERE id=($1)",
        [id]
      );

      query.on('end', function () {
        res.json({success: true});
        done();
      });

      dbConnect.catchError(query, res);
    });
  });

module.exports = router;
