'use strict';

var express = require('express');
var router = express.Router();
var dbConnect = require('./lib/db');
var parsePost = require('./lib/post');
var moment = require('moment');

function formatItem(item) {
  var date = moment(item.date);
  return {
    id: item.id,
    name: item.name,
    patientId: item.patientId,
    url: item.url,
    date: item.date,
    dateFormatted: date.format('DD/MM/YYYY')
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
          "INSERT INTO public.attachment(patient_id, url, name, date) " +
          "values($1, $2, $3, $4)",
          [data.patientId, data.url, data.name, data.date]
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
        "SELECT * FROM public.attachment WHERE patient_id = ($1) ORDER BY date ASC",
        [ reqQuery.patientId ]
      );

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

      var query = client.query("SELECT * FROM public.attachment WHERE id = $1", [id]);

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
          "UPDATE public.attachment " +
          "SET url=($1), name=($2), date=($3) " +
          "WHERE id=($4)",
          [
            data.url, data.name, data.date,
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
        "DELETE FROM public.attachment WHERE id=($1)",
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
