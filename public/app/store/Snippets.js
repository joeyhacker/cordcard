Ext.define('recall.store.Snippets', {
    extend: 'Ext.data.Store',
    model: 'recall.model.Snippet',
    remoteFilter: true,
    autoLoad: false,
    pageSize: 20,
    proxy: {
        type: 'ajax',
        url: '/snippets',
        reader: {
            type: 'json',
            root: 'items',
            totalProperty: 'total',
            useSimpleAccessors: true
        }
    }
});