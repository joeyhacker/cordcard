var redis = require('redis'),
    config = require('./config');



var Cache = function(){
   var cfg = config.redisCfg;
   var client = redis.createClient(cfg.port, cfg.hostname);

   client.on("error", function (err) {
        console.log("Redis connection error to " + client.host + ":" + client.port + " - " + err);
   });

   return {
       put: function(key, value){
           client.set(key, value);
       }
   }
}

module.exports = new Cache()