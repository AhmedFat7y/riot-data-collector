const {KVStore} = require('../models/kv-store');
const {Summoner} = require('../models/summoner');
const async = require('async');

module.exports = class Repo {
  saveSummoners(summonersData, callback) {
    let self = this;
    async.each(summonersData, (summoner, eachCallback) => {
      self.saveSummoner(summoner, eachCallback);
    }, err => {
      console.log('Saved Summoners:', summonersData.length);
      callback(err);
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