var Mongoose = require("mongoose");
var config = require("../config");

var ConnectionManager = {
  _makeConnection: function () {
    if (config.db.password !== "") {
      return (
        "mongodb://" +
        config.db.user +
        ":" +
        config.db.password +
        "@" +
        config.db.host +
        "/" +
        config.db.database
      );
    } else {
      return "mongodb://" + config.db.host + "/" + config.db.database;
    }
  },
  connect: function () {
    Mongoose.connect(ConnectionManager._makeConnection(), {
      useNewUrlParser: true,
      poolSize: 100,
    });
    return new Promise((resolve, reject) => {
      var db = Mongoose.connection;
      db.on("error", () => {
        reject();
      });
      db.once("open", () => {
        resolve();
      });
    });
  },
};
const DB_KEY = Symbol("mongoose_connection");
global[DB_KEY] = null;

var Pool = {
  connect: function () {
    if (global[DB_KEY] === null || Mongoose.connection.readyState !== 1) {
      return new Promise((resolve, reject) => {
        ConnectionManager.connect()
          .then(() => {
            global[DB_KEY] = Mongoose.connection;
            resolve();
          })
          .catch(() => reject());
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve();
      });
    }
  },
};

module.exports = Pool;
