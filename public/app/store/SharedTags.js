Ext.define('recall.store.SharedTags', {
    extend: 'Ext.data.TreeStore',
    proxy: {
        type: 'ajax',
        url: '/shared/tags',
        reader: 'json'
    },
    defaultRootId: 'shared',
    autoLoad: true
});