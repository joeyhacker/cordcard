Ext.define('recall.model.Snippet', {
    extend : 'Ext.data.Model',
    idProperty: '_id',
    fields : [ '_id', 'title', 'short', 'lang', 'theme',
        {
        name: 'createTime',
        convert: function(val){
            var date = Ext.data.Types.DATE.convert(val);
            return Ext.Date.format(date, 'y-m-d H:i');
        }
    }]
});
