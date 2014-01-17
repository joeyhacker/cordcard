/**
 * Created with JetBrains WebStorm.
 * User: hadoop
 * Date: 13-4-1
 * Time: 下午5:21
 * To change this template use File | Settings | File Templates.
 */

var express = require('express'),
    jade = require('jade'),
    config = require('./config'),
    session_store  = new express.session.MemoryStore;
    app = express();

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'recall', key: 'express.sid', store: session_store}));
    app.use(app.router);
    app.use(express.compress());
    app.use(express.static(__dirname + '/public'));
});

require('./controllers')(app)

var server = app.listen(config.appPort, config.appHost);


console.log('server has startup !');



