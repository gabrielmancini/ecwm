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
      return value;
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
  outgoing: {
    map: function(doc) {
      if (doc.type === 'route') {
        emit(doc.from, {_id: doc.to, km: doc.km});
      }
    },
    reduce: function (key, value, rereduce) {
      return value;
    }
  },
}

