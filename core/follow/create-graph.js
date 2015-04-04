

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
var _ = require('lodash');




module.exports.follow = function (from, to, cb) {


  var getFrom = function(obj, db, id, cb) {

    db.get(id, function (err, body) {
      delete body._id;
      delete body._rev;
      _.extend(obj, body);
      cb(err, body);
    })
  }

  var trasform = function (obj, cb) {
    _.extend(obj, {
        type: 'node',
        _id: obj.from,
        edge: [{ _id: obj.to, km: obj.km }]
      });
    delete obj.to;
    delete obj.km;
    cb();
  }

  var getTo = function (obj, db, cb) {
    db.get(obj._id , function(err, body) {
      debugger;
      if (err && err.statusCode === 404) {
        cb(null, body);
      } else if (err && err.statusCode !== 404) {
        cb(err, body);
      } else {
        body.edge.push(obj.edge[0]);
        _.extend(obj, body);
        cb(null, body);
      }
    })
  }

  var insertNode = function (obj, db, cb) {
    db.insert(obj, function (_err, body) {
      cb(_err, body);
    })
  }

  var insertVertex = function (obj, db, cb) {
    var link = {
      type: 'link',
      from: obj._id,
      to: obj.edge[0]._id,
      km: obj.edge[0].km
    }
    to.insert(link, function(err, body) {
      cb(err, body)
    })
  }

  var flux = function (original, obj) {

  }


  var feed = from.follow({since: "now"});
  feed.on('error', function (err) {
    console.error('Since Follow always retries on errors, this must be serious', err);
    throw err;
  })

  feed.on('change', function (change) {
    var obj = {};
    feed.pause();
    async.series([
      async.apply(getFrom, obj, from, change.id),
      async.apply(trasform, obj),
      async.apply(insertVertex, obj, to),
      async.apply(getTo, obj, to),
      async.apply(insertNode, obj, to),
    ],
    function(err) {
      if (err) console.log('error on link:', err);
      feed.resume();
    })

  });
  feed.follow();

  return feed;
  cb()
}
module.exports.dbs = ['routes', 'graph'];
