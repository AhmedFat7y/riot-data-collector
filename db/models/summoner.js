let mongoose = require('mongoose');

let SummonerSchema = new mongoose.Schema({
  name: {type: String, index: {unique: true, dropDups: true}},
  profileIconId: {type: Number},
  summonerLevel: {type: Number},
  revisionDate: {type: Number},
  summonerId: {type: Number, index: {unique: true, dropDups: true}},
  accountId: {type: Number},
}, {timestamps: true});
let SummonerModel = mongoose.model('Summoner', SummonerSchema);

module.exports = {
  Summoner: SummonerModel
};