module.exports = {
  autocomplete_from: {
    map: function(doc) {
      if (doc.type === 'route') {
        emit(doc.from, {_id: doc.from, km: doc.km});
      }
    }
  },
  autocomplete_to: {
    map: function(doc) {
      if (doc.type === 'route') {
        emit(doc.to, {_id: doc.to, km: doc.km});
      }
    }
  },
  outgoing: {
    map: function(doc) {
      if (doc.type === 'route') {
        emit(doc.from, {_id: doc.to, km: doc.km});
      }
    },
    reduce: function (key, value, rereduce) {
      if (!rereduce) {
        return  value
          .reduce(function (a, c) {
            a[c._id] = c.km;
            return a;
          }, {});
      } else {
        return value
          .reduce(function (a, c) {
            for (var attrname in c) { a[attrname] = c[attrname]; }
            return a;
          }, {});
      }
    }
  },
  incoming: {
    map: function(doc) {
      if (doc.type === 'route') {
        emit(doc.to, { _id: doc.from, km: doc.km });
      }
    },
    reduce: function (key, value, rereduce) {
      return value;
    }
  },
  by_origin: {
    map: function(doc) {
      if (doc.type === 'route') {
        emit(doc.origin, doc);
      }
    },
    reduce: function (key, value, rereduce) {
      if (!rereduce) {
        return value;
      } else {
        return  value
          .reduce(function (a, c) {
            a = a.concat(c);
            return a;
          }, []);
      }
    }
  },
}

