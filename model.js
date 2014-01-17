
var _User = {
    name: String,
    username: String,
    password: String,
    createTime: Date
}

var _Tag = {
    parentId: String,
    name: String,
    desc: String,
    userId: String
}

var _Snippet = {
    title: String,
    short: String,
    content: String,
    createTime: Date,
    updateTime: Date,
    lang: String,
    theme: String,
    userId: String,
    tagId: String
}


module.exports = function(mongoose, schema){
    console.log('building models ...');
    return {
        User: mongoose.model('User', new schema(_User)),
        Snippet: mongoose.model('Snippet', new schema(_Snippet)),
        Tag: mongoose.model('Tag', new schema(_Tag))
    }
}

