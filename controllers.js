var Dao = require('./dao');


function doRegist(req, res){
    res.render('register',{
        username: '',
        password: '',
        errorMsg: ''
    });
}

function regist(req, res){
    var username = req.param('username');
    var password = req.param('password');
    var repassword = req.param('repassword');
    if(username && password && repassword){
        Dao.getUserByUsername(username, function(err, doc){
            if(err) throw err;
            if(doc){
                res.render('register',{
                    username: '',
                    errorMsg: '该用户名已存在!'
                });
                return;
            }
            if(password != repassword){
                res.render('register',{
                    username: '',
                    errorMsg: '两次密码输入不一致!'
                });
                return;
            }

            Dao.createUser({
                username: username,
                password: password
            }, function(doc){
                Dao.createTag({
                    parentId: doc._id,
                    name: '/',
                    desc: 'root'
                });
            });

            res.render('login',{
                username: username,
                password: password,
                errorMsg: '注册成功'
            });
        });
    }else{
        res.render('register',{
            username: '',
            errorMsg: '用户名或密码不能为空!'
        });
    }
}


function logout(req, res){
    req.session = null;
    res.render('login',{
        username: '',
        password: '',
        errorMsg: ''
    });
    console.log('logout ...');
}

function doLogin(req, res){
    res.render('login',{
        username: '',
        password: '',
        errorMsg: ''
    });
}

function login(req, res){
    var username = req.param('username');
    var password = req.param('password');

    if(username && password){
        Dao.getUserByUsername(username, function(err, doc){
            if(err) throw err;
            if(!doc || doc.password != password){
                res.render('login',{
                    username: '',
                    password: '',
                    errorMsg: '用户名不存在或密码错误!'
                });
            }else{
                req.session.user = {
                    id: doc._id,
                    username: username
                };
                res.redirect('index');
            }
        });
    }else{
        res.render('login',{
            username: '',
            password: '',
            errorMsg: '用户名或密码不能为空!'
        });
    }
}


//  snippet

function snippet_list(req, res){
    var start = req.param('start');
    var limit = req.param('limit');
    var filter = req.param('filter');

    console.log(start + ',' + limit + ',' +  filter);

    var _filter = {};
    if(filter){
        _filter = JSON.parse(filter);
        _filter.userId = req.session.user.id;
    }

    Dao.countSnippets(_filter, function(err, count){
        if(err) throw err;
        if(!count) {
            res.json({
                success: true,
                items: [],
                total: 0
            });
        }else{
            Dao.getSnippets(start, limit, _filter, function(err, docs){
                if(err) throw err;
                res.json({
                    success: true,
                    items: docs,
                    total: count
                });
            })
        }
    });
}

function snippet_get(req, res){
    var _id = req.param('_id');
    Dao.getSnippet(_id, function(doc){
        res.json({
            success: true,
            doc: doc
        });
    });
}


function snippet_update(req, res){
    //console.log('add:' + req.body);
    var _id = req.param('_id');
    var type = req.param('type');
    var title = req.param('title');
    var content = req.param('content');

    Dao.updateSnippet(_id, {
        type: type,
        title: title,
        content: content
    });

    res.json({
        success: true
    });
}

function snippet_save(req, res){
    var id = req.param('id');
    if(req.body.content && req.body.content.length > 200){
        req.body.short = req.body.content.substring(0, 200);
    }else{
        req.body.short = req.body.content;
    }
    if(id){
        delete req.body['tagId'];
        Dao.updateSnippet(id, req.body);
        res.json({
            success: true
        });
    }else{
        req.body.userId = req.session.user.id;
        req.body.createTime = new Date();
        req.body.updateTime = req.body.createTime;
        Dao.createSnippet(req.body, function(doc){
            res.json({
                id: doc._id,
                success: true
            });
        });
    }
}


function snippet_remove(req, res){
    var id = req.param('_id');
    Dao.removeSnippet(id);
    res.json({
        success: true
    });
}

function snippet_move(req, res){
    var id = req.param('id');
    var tagId = req.param('tagId');
    console.log('tagId=' + tagId);
    Dao.moveSnippet(id, tagId, function(){
        res.json({
            success: true
        });
    })
}

//  snippet end ~


function tag_create(req, res){
    Dao.createTag(req.body, function(doc){
        res.json({
            success: true,
            id: doc._id
        });
    });
}

function tag_update(req, res){
    var id = req.param('_id');
    var name = req.param('name');
    Dao.updateTag(id, {
        name: name
    });
    res.json({
        success: true
    });
}


function tag_list(req, res){
    var userId = req.session.user.id;
    var node = req.query.node;
    var _node = '';
    var expanded = false;

    if(node == 'root'){
        _node = userId;
        expanded = true;
    }else{
        _node = node;
    }

    Dao.getTags(_node, expanded, function(json){
        console.log('tree :' + json);
        res.send(json);
    })
}

function shared_tag_list(req, res){
    var node = req.query.node;
    Dao.getTags(node, node == 'shared', function(json){
        console.log('tree :' + json);
        res.send(json);
    });
}

function tag_remove(req, res){
    /*var keys = req.param('keys');
    Dao.removeTag(keys);
    res.json({
        success: true
    });*/
    var id = req.param('_id');
    Dao.countTags({
        parentId: id
    }, function(err, count){
        if(err) throw err;
        if(count){
            res.json({
                success: false,
                errorMsg: 'There is some sub-tags in the tag!'
            });
        }else{
            Dao.countSnippets({
                tagId: id
            }, function(err, count){
                if(err) throw err;
                if(count){
                    res.json({
                        success: false,
                        errorMsg: 'There is some snippets in the tag!'
                    });
                }else{
                    Dao.removeTag(id);
                    res.json({
                        success: true
                    });
                }
            })
        }
    });
}


function index(req, res){
    console.log('index...');
    res.render('index', {
        user: req.session.user
    });
}


function passwd(req, res){
    var username = req.param('username');
    var password = req.param('password');

    if(username && password){
        Dao.passwd(username, password, function(){
            res.json({
                success: true
            });
        })
    }
}

function auth(req, res, next){
   console.log('[auth] path: ' + req.path + ' , sessionid: ' + req.session.id);
   if(req.session && req.session.user){
       next();
   }else{
       res.render('login',{
           username: '',
           password: '',
           errorMsg: ''
       });
   }
}


module.exports = function(app){
    app.get('/', auth, index);
    app.get('/index', auth, index);

    app.get('/regist', doRegist);
    app.post('/regist', regist);
    app.post('/passwd', passwd);

    app.get('/logout', logout);
    app.get('/login', doLogin);
    app.post('/login', login);

    app.get('/snippets', auth, snippet_list);
    app.post('/snippet/get', auth, snippet_get);
    app.post('/snippet/update', auth, snippet_update);
    app.post('/snippet/save', auth, snippet_save);
    app.post('/snippet/remove', auth, snippet_remove);
    app.post('/snippet/move', auth, snippet_move);

    app.get('/tags', auth, tag_list);
    app.get('/shared/tags', shared_tag_list);
    app.post('/tag/update', auth, tag_update);
    app.post('/tag/create', auth, tag_create);
    app.post('/tag/remove', auth, tag_remove);
}