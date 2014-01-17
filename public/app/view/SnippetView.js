Ext.define('recall.view.SnippetView', {
    extend : 'Ext.view.View',
    xtype: 'snippetView',
    store: 'Snippets',
    cls: 'snippet-view',
    emptyText: '',
    autoScroll: true,
    trackOver: true,
    itemSelector: 'div.snippet-item',
    multiSelect: true,
    selectedItemCls: 'snippet-item-selected',
    overItemCls: 'snippet-item-over',
    tpl: new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="snippet-item">',
        '<div><span class="snippet-item-title">{title}</span><span class="snippet-item-createTime">{createTime}</span></div>',
        '<div class="x-clear"></div>',
        '<div class="snippet-item-short">{[Ext.util.Format.htmlEncode(values.short)]}</div>',
        '</div>',
        '</tpl>',
        '<div class="x-clear"></div>'
    )
});