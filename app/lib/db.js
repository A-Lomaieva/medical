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
};

module.exports = dbConnect;
