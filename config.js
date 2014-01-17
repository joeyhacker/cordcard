/**
 * Created with JetBrains WebStorm.
 * User: hadoop
 * Date: 13-4-1
 * Time: 下午5:50
 * To change this template use File | Settings | File Templates.
 */


// some config here ~

module.exports = {

    redisCfg: {
        hostname: 'localhost',
        port: 6379
    },

    mongoCfg: {
        hostname: 'localhost',
        port: 27017,
        db: 'recall'
    },


    getMongoUrl: function(){
        var obj;
        if(process.env.VCAP_SERVICES){
            var env = JSON.parse(process.env.VCAP_SERVICES);
            obj = env['mongodb-2.0'][0]['credentials'];
            console.log('start mongo in cloud ... ');
        }else{
            obj = this.mongoCfg;
            console.log('start mongo in local ... ');
        }

        if(obj.username && obj.password){
            return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
        }
        else{
            return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
        }
    },

    appPort: process.env.VMC_APP_PORT || 8888,
    appHost: process.env.VCAP_APP_HOST || 'localhost'
}