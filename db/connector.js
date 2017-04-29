"use strict";
const mongoose = require("mongoose");
const {RIOT_DB} = require("../config");
let isConnectCalled = false;
let singletonMongoose = null;
let options = {
  promiseLibrary: global.Promise,
  uri_decode_auth: true
};
module.exports = {
  connect() {
    // console.log('Environment Variables:', process.env);
    if (isConnectCalled) {
      return singletonMongoose;
    }
    let authentication = ``;
    if (RIOT_DB.USER) {
      authentication = `${RIOT_DB.USER}:${RIOT_DB.PASSWORD.replace('@', '%40')}@`;
    }
    let connectionString = `mongodb://${authentication}${RIOT_DB.HOST}:${RIOT_DB.PORT}/${RIOT_DB.NAME}`;
    mongoose.connect(connectionString, options);
    console.log('Connection String:', connectionString);
    // mongoose.set('debug', true);
    mongoose.connection
      .on("connected", ref => {
        console.info("Connected To MongoDB!")
      })
      .on("error", err => {
        console.error("Couldn't Connect to MongoDB!", err);
      })
      .on("disconnected", () => {
        console.warn("Disconnected from MongoDB!");
      });
    isConnectCalled = true;
    singletonMongoose = mongoose;
    return mongoose;
  }
};