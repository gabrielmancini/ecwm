module.exports = {
  outgoing: {
    map: function(doc) {
      if (doc.type === 'link') {

        emit(doc.from, {_id: doc.to, km: doc.km});
      }
    },
    reduce: function (key, value, rereduce) {
      return value;
    }
  },
  incoming: {
    map: function(doc) {
      if (doc.type === 'link') {
        emit(doc.to, { _id: doc.from, km: doc.km });
      }
    },
    reduce: function (key, value, rereduce) {
        return value;
    }
  }
}
