require('dotenv').config();
let lol = require('lol-js');
let async = require('async');
let MongoCache = require('./mongo-cache');
let Repo = require('./db/repos/repo');
let repo = new Repo();
let seedData = ['Nyx', 'KortyElBo3Bo3', 'mous', 'seifwafa', 'nettY135'];
let region = 'eune';
let lolClient = lol.client({
    apiKey: 'RGAPI-834e64ce-7179-4e27-be06-96b25fc6b1c0',
    cache: new MongoCache(),
});
let _summonerIdsList = [];
function summonersIdsList(summonersIds) {
  let out = [];
  _summonerIdsList.splice(0, 0, ...summonersIds);
  while(_summonerIdsList.length >= 40) {
    out.push({summonersIds: _summonerIdsList.slice(0, 40)});
    _summonerIdsList = _summonerIdsList.slice(40);
  }
  return out;
}

function getRecentGames(summonerId, callback) {
  let summonersIds = [];
  lolClient.getRecentGamesForSummoner(region, summonerId)
  .then(({games}) => {
    console.log('fetched games for:', summonerId);
    summonersIds = games
      .filter(game => (game && true) || false)
      .reduce((acc, game) => {
        let playersIds = game.fellowPlayers.map(player => player.summonerId);
        acc.splice(0, 0, ...playersIds);
        return acc;
      }, []);
  }).catch(console.error)
  .then(() => callback(null, summonersIds));
}


let mongoQueue = async.queue(({summoners}, callback) => {
  repo.saveSummoners(summoners, callback);
}, 5);
let summonersQueue = async.queue(({summonersIds}, callback) => {
  lolClient.getSummonersById(region, summonersIds)
  .then(summonersObj=> {
    let keys = Object.keys(summonersObj);
    console.log('Fetched summoners by ids:', keys.length)
    let summoners = keys.map(key => summonersObj[key])
      .filter(summoner => (summoner && true) || false);
    summoners.forEach(summoner => summoner.summonerId = summoner.id);
    mongoQueue.push({summoners});
    for (let summoner of summoners) {
      recentGamesQueue.push({summonerId: summoner.summonerId});
    }
  }).catch(console.error)
  .then(() => callback(null));
}, 5);
let recentGamesQueue = async.queue(({summonerId}, callback) => {
  getRecentGames(summonerId, (err, summonersIds) => {
    summonersQueue.push(summonersIdsList(summonersIds));
  });
}, 5);

lolClient.getSummonersByName(region, seedData, (err, summonersObj) => {
  let summoners = Object.keys(summonersObj)
    .map(key => summonersObj[key])
    .filter(summoner => (summoner && true) || false);
  summoners.forEach(summoner => summoner.summonerId = summoner.id);
  mongoQueue.push({summoners});
  for (let summoner of summoners) {
    recentGamesQueue.push({summonerId: summoner.summonerId});
  }
});