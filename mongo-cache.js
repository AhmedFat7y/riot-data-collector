const db = require('./db/connector');
const {KVStore} = require('./db/models/kv-store');

module.exports = class MongoCache {
  constructor() {
    db.connect();
  }

  get({key, region}, callback) {
    var answer, cacheEntry;
    KVStore.findOne({key}).lean().exec((err,doc) => {
      callback(err, doc && doc.value);
    });
  }

  set({key, region}, value) {
    KVStore.create({
      key, region, value
    }, (err, doc) => {
      // console.log('Cached object:', key, region);
    });
  }
}