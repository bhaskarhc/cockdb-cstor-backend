var async = require('async');
var fs = require('fs');
var pg = require('pg');
// Connect to the "bank" database.
var config = {
    user: 'root',
    host: `${process.argv[2]}`,
   // database: 'maya',
    port: 26257
};

// Create a pool.
var connection = new pg.Pool(config);

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
      console.log('connected as id ' + connection.threadId);


      connection.query("CREATE DATABASE if not exists maya", function (err, result) {
        if (err) throw err;
        console.log("Database created");
      });
    

});

module.exports = connection;