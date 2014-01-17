Ext.define('recall.model.Chat', {
    extend: 'Ext.data.Model',
    fields: [
        { name:'sessionId', type:'string' },
        { name:'sender', type:'string' },
        { name:'sendTime', type:'Date', convert: function(v){
            return Ext.Date.format(v, 'g:i:s a')
        }},
        { name:'content', type:'String' }
    ]
});