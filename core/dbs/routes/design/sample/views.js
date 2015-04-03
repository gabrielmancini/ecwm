module.exports = {
  all: {
    map: function (doc) {
      if (doc.type == 'route') {
        emit([doc.from, doc.name], {_id: doc.to});
      }
    }
  }
}
