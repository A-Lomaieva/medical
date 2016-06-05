var pg = require('pg');

function dbConnect(callback) {
  pg.defaults.ssl = true;
  pg.connect(process.env.DATABASE_URL,
    function (err, client) {
      console.log(err);

      if (err) throw err;
      console.log('Connected to postgres!');
      callback(client);
    });
}

dbConnect.catchError = function(query, res) {
  query.on('error', function() {
    res.status(500).send('Oops! Some error happened');
  });
};

module.exports = dbConnect;
