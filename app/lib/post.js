var qs = require('qs');

function parsePost(req, callback) {
  var body = '';
  req.on('data', function (data) {
    body += data;

    if (body.length > 1e6)
      req.connection.destroy();
  });

  req.on('end', function () {
    var post = qs.parse(body);
    callback(post);
  });
}

module.exports = parsePost;
