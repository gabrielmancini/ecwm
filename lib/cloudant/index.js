var Nano = require('nano');
var dbs = require('../../core/dbs');
var follow = require('../../core/follow');
var async = require('async');
var _ = require('lodash');

var createDbs = function (nano, db, callback) {
  nano.db.create(db.name, function(err, body) {
    console.log('Creating db: ' + db.name);
    if (err && err.statusCode !== 412) { // erro caso nao exista
      callback(err, body);
    } else {
      callback(null, body);
    }
  });
}


var setupDesign = function (nano, db, callback) {

  if (!db.design) return callback();


  var designArray = Object.keys(db.design)
    .map(function (k) {
      db.design[k].name = k;
      return db.design[k];
    })

  var couch = nano.use(db.name);

  async.eachSeries(
    designArray,
    function (design, cb) {

      if (!design.name) return callback();
      couch.get('_design/' + design.name, { revs_info: true }, function(err, body) {

        if (err && err.statusCode !== 404) {
          callback(err, body);
        } else if (!err) {
          design = _.extend(body, design);
        }
        console.log('Creating ducument design: ' + design.name);
        couch.insert(design, '_design/' + design.name, callback);

      });

    },
    callback
  );

}



var setupFollow = function (nano, callback) {

  if (!follow) return callback();

  var followArray = Object.keys(follow)
    .map(function (k) {
      follow[k].name = k;
      return follow[k];
    })

  async.eachSeries(
    followArray,
    function (f, cb) {

      var dbs = f.dbs.map(function (k) {
        return nano.use(k);
      })

      console.log('setup a follow:', f.name)

      f.follow.apply(null, dbs, cb);

    },
    callback
  );

}

var setupCouchdb = function (nano, callback) {
  opts = {
    db: '_config', // – the database name
    method: 'PUT', // – the http method, defaults to get
    path: 'query_server_config/reduce_limit', // – the full path of the request, overrides opts.doc and opts.att
  //  doc: {reduce_limit: false }, // – the document name
   // att: 'false', // – the attachment name
  //  qs: 'false', // – query string parameters, appended after any existing opts.path, opts.doc, or opts.att
 //   content_type: , // – the content type of the request, default to json
 //   headers: 'application/json', // – additional http headers, overrides existing ones
    body: JSON.stringify(false), // – the document or attachment body
//    encoding: , // – the encoding for attachments
//    multipart: , // – arr
  }


  nano.request(opts, callback);
}

exports.start = function (env_config, callback) {

  var nano = Nano( { url: env_config.couch.url } );

  var arrayDbs = Object.keys(dbs)
    .map(function (k) {
      dbs[k].name = k;
      return dbs[k];
    })


  async.eachSeries(
    arrayDbs,
    function (db, cb) {
      async.series([
        async.apply(createDbs, nano, db),
        async.apply(setupDesign, nano, db),
        async.apply(setupCouchdb, nano),
      ], cb)
    },
    callback
//    function (err) {
//      setupFollow(nano, callback);
//    }
  );

}
