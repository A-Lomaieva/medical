'use strict';

var express = require('express');
var router = express.Router();
var dbConnect = require('./lib/db');
var parsePost = require('./lib/post');

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
      });
    });
  })
  .get('/', function (req, res) {
    var reqQuest = req.query;
    var items = [];

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
        items.push(row);
      });

      query.on('end', function (result) {
        res.json({items: items});
        done();
      });

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
        res.json({item: row});
      });

      query.on('end', done);

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
    });
  });

module.exports = router;
