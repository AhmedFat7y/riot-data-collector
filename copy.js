require('dotenv').config();
const async = require('async');
const db = require('./db/connector').connect();
const {KVStore, schema} = require('./db/modesl/kv-store');
const kvold = db.model('KVStores-Old', schema, 'kvstores-old');

let ofset=0
let limit=20

async.forever(
    function(next) {
        // next is suitable for passing to things that need a callback(err [, whatever]);
        // it will result in this function being called again.
        async.waterfall([
          nextFunc => kvold.find().offset(offset).limit(limit).exec(nextFunc),
          (docs, nextFunc) => KVStore.insertMany(docs, {ordered: false}, () => {
            offset += limit;
            nextFunc()
          }),
        ], next);
    },
    function(err) {
        console.log('ERROR:', err);
    }
);