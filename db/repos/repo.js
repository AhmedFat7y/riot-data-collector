const {KVStore} = require('../models/kv-store');
const {Summoner} = require('../models/summoner');
const async = require('async');

module.exports = class Repo {
  saveSummoners(summonersData, callback) {
    let self = this;
    Summoner.insertMany(summonersData, {ordered: false}, (err, docs) => {
      if(err) {
        console.error('Error Saving Summoners:', err);
      }
      callback(null);
    });
  }
  saveSummoner(summonerData, callback) {
    Summoner.create(summonerData, (err, doc) => {
      if(err && err.code !== 11000) {
        console.error(err);
      }
      callback(null);
    });
  }
}