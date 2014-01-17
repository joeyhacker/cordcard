/**
 * Created with JetBrains WebStorm.
 * User: hadoop
 * Date: 13-4-1
 * Time: 下午5:37
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    util = require('util'),
    fs = require('fs'),
    config = require('./config'),
    Model
    ;




var Dao = function(){
    var uri = config.getMongoUrl();
    console.log('db uri: ' + uri);
    mongoose.connect(uri);
    Model =  require('./model')(mongoose, schema);


    function create(clazz, object, callback){
         new clazz(object).save(function(err, doc){
             if(err) throw err;
             if(callback)
                 callback.call(this, doc);
             console.log('doc saved. ');
         });
    }

    function get(clazz, id, callback){
        clazz.findOne({
            _id: id
        }, function(err, doc){
            if(err) throw err;
            if(callback)
                callback.call(this, doc);
            console.log('doc getted. ');
        });
    }

    function remove(clazz, ids){
        if(!util.isArray(ids)){
            ids = [ids];
        }
        clazz.remove({
            _id: {
                $in: ids
            }
        }, function(err){
            if(err) throw err;
            console.log('doc removed. ');
        });
    }


    function update(clazz, id, object){
        clazz.update({
            _id: id
        }, {
            $set: object
        }, function(err){
            if(err) throw err;
            console.log('doc updated. ');
        });
    }


   function getSubNode(docs, obj, cd){
       docs.forEach(function(doc){
           var node = {
               id: doc._id,
               text: doc.name,
               leaf: true
           };
           if(!obj.children){
               obj.children = [];
           }
           obj.children.push(node);
           Model.Tag.find({
               parentId: doc._id
           }).sort('name').exec(function(err, _docs){
                   if(err) throw err;
                   if(_docs && _docs.length){
                       cd(doc.name, _docs.length);
                       node.leaf = false;
                       getSubNode(_docs, node, cd);
                   }
                   cd(obj.tagName, -1);
               });
       });
       //console.log('obj: ' + JSON.stringify(obj));
   }

   function buildTree(userId, callback){
       var map = {};
       var tree = {};
       function checkdone(key, value){
           if(!map[key]){
               map[key] = value;
           }else{
               map[key] += value;
           }
           var done = 0;
           for(var k in map){
               done += map[k];
           }
           if(done == 0){
               //console.log('tree: ' + JSON.stringify(tree));
               callback.call(this, JSON.stringify({
                   children: tree
               }));
           }
       }
       Model.Tag.findOne({
           userId: userId
       }).exec(function(err, doc){
               if(err) throw err;
               if(doc){
                   Model.Tag.find({
                       parentId: doc._id
                   }).exec(function(err, docs){
                           tree = {
                               id: doc._id,
                               text: doc.name,
                               expanded: true
                           }
                           checkdone(tree.tagName, docs.length);
                           getSubNode(docs, tree, checkdone);
                       });
               }
           });
   }

//    Cache = redis.createClient(config.redisCfg.port, config.redisCfg.hostname);


    function buildTags(nodeId, expanded, callback){
        Model.Tag.find({
            parentId: nodeId
        }).exec(function(err, docs){
                var children = [];
                if(docs && docs.length){
                    docs.forEach(function(d){
                        children.push({
                            id: d._id,
                            text: d.name,
                            expanded: expanded
                        });
                    });
                }
                callback.call(this, JSON.stringify({
                    children: children
                }));
            });
    }

    function createSharedTag(nodeId){
        Model.Tag.findOne({
            parentId: nodeId
        }).exec(function(err, doc){
                if(err) throw err;
                if(doc){
                    console.log('find shared tag id: ' + doc._id);
                    //sharedTagId = doc._id;
                    //callback.call(this, doc._id);
                }else{
                    create(Model.Tag, {
                        name: '/',
                        parentId: nodeId,
                        desc: 'public root tag'
                    }, function(doc2){
                        console.log('create shared tag id: ' + doc2._id);
                        //sharedTagId = doc2._id;
                        //callback.call(this, doc2._id);
                    });
                }
            });
    }

    createSharedTag('shared');

    return {

        countTags: function(filter, callback){
            Model.Tag.count(filter, callback);
        },

        getTags: function(node, expanded, callback){
            buildTags(node, expanded, callback);
        },

        createTag: function(object, callback){
            create(Model.Tag, object, callback);
        },

        removeTag: function(ids){
            remove(Model.Tag, ids);
        },

        updateTag: function(id, object){
            update(Model.Tag, id, object);
        },

        createUser: function(object, callback){
            object.createTime = new Date();
            create(Model.User, object, callback);
        },

        passwd: function(username, password, callback){
            Model.User.findOneAndUpdate({
                username: username
            },{
                $set: {
                    password: password
                }
            }, callback);
        },

        getUserByUsername: function(username, callback){
            Model.User.findOne({
                username: username
            }, callback);
        },
		
        getSnippets: function(start, limit, filter, callback){
            Model.Snippet.find(filter).skip(start).limit(limit).select('title short createTime lang').sort('-createTime').exec(callback);
        },

        getSnippet: function(id, callback){
            get(Model.Snippet, mongoose.Types.ObjectId(id), callback);
        },

        countSnippets: function(filter, callback){
            Model.Snippet.count(filter, callback);
        },

        createSnippet: function(object, callback){
            create(Model.Snippet, object, callback);
        },

        updateSnippet: function(id, object){
            object.updateTime = new Date();
            update(Model.Snippet, id, object);
        },

        removeSnippet: function(ids){
            remove(Model.Snippet, ids);
        },

        moveSnippet: function(id, tagId, callback){
            Model.Snippet.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(id)
            },{
                $set: {
                    tagId: tagId
                }
            }, callback);
        }
    };
}

module.exports = new Dao()



