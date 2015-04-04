

/*

{
   "_id": "8552df75b800720c32ee5a3c3406d46a",
   "_rev": "1-2dd1cdc7942f1569a7cf5704e84f8345",
   "createAt": "2015-04-03T21:22:01.403Z",
   "updateAt": "2015-04-03T21:22:01.403Z",
   "type": "route",
   "origin": "file",
   "from": "ac",
   "to": "ah",
   "km": 82
}
*/
var async = require('async');


var insertDoc = function (db, doc, origin, cb) {
  db.head(doc._id , function(err, _, headers) {
    if (err && err.statusCode === 404) {
      db.insert(doc, function (_err, body) {
        cb(_err, body);
      })
    } else {
      var result = {};
      result[origin]={id: doc._id};
      cb(null, result);
    }
  });
}

module.exports.follow = function (from, to, cb) {

  var feed = from.follow({since: "now"});
  feed.on('change', function (change) {

    from.get(change.id, function (err, body) {

      var fromPlace = {
        type: 'place',
        _id: body.from
      };
      var toPlace = {
        type: 'place',
        _id: body.to
      };

      async.parallel({
        from: async.apply(insertDoc, to, fromPlace, 'from'),
        to: async.apply(insertDoc, to, toPlace, 'to')
      }, function (err, result) {
        var link = {
          type: 'link',
          from: body.from,
          to: body.to,
          km: body.km
        }
        to.insert(link, function(err) {
          if (err) console.log('error on link:', err);
        })
      })

    })

  });
  feed.follow();

  return feed;
  cb()
}
module.exports.dbs = ['routes', 'graph'];
