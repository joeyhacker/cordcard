Ext.define('recall.store.Tags', {
    extend: 'Ext.data.TreeStore',
    proxy: {
        type: 'ajax',
        url: '/tags',
        reader: 'json'
    },
    autoLoad: true
});