'use strict';

var express = require('express');
var router = express.Router();
var dbConnect = require('./lib/db');
var parsePost = require('./lib/post');
var bcrypt = require('bcryptjs');
const salt = 10;

router
  .post('/login', function (req, res) {
    parsePost(req, (data) => {
      dbConnect((client) => {

        var query = client.query("SELECT * FROM users WHERE username = $1", [data.username]);

        query.on('row', function (row) {
          bcrypt.compare(data.password, row.password, function(err, result) {
            if (!result) {
              res.status(403);
            } else {
              res.json({
                id: row.id,
                username: row.username,
                patientId: row.patient_id,
                isAdmin: row.is_admin
              });
            }
            res.end();
          });
        });

        query.on('end', () => client.end());
      });
    });
  })
  .get('/get-hash/:password', function(req, res) {
    var password = req.params.password;
    bcrypt.hash(password, salt, (err, hash) => {
      res.send(hash);
      res.end();
    });
  });

module.exports = router;
