var Nano = require('nano');
var dbs = require('../../core/dbs');
var async = require('async');

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


var getDesign = function (couch, design, callback) {

  if (!design.name) return callback();
  couch.get('_design/' + design.name, { revs_info: true }, function(err, body) {

    if (err && err.statusCode === 404);
      createDesign(couch, design, callback);
    } else {
      console.log(arguments);
      callback();
    }
  });
}


var createDesign = function (couch, design, callback) {

  if (!design.name) return callback();
  couch.insert(design_doc, '_design/design_doc_name', callback);

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
      async.series([
        async.apply(getDesign, couch, design),
        //async.apply(createDesign, couch, design)
      ], cb)
    },
    callback
  );

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
        async.apply(setupDesign, nano, db)
      ], cb)
    },
    callback
  );

}
