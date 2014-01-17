Ext.define('recall.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    requires: [
        'Ext.layout.ColumnLayout',
        'Ext.layout.BorderLayout',
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.menu.Menu',
        'recall.view.CodeEditorField'
    ],
    items: [{
        region: 'north',
        xtype: 'appHeader',
        height: 35
    }, {
        region: 'center',
        layout: {
            type: 'hbox',
            pack: 'start',
            align: 'stretch'
        },
        items: [{
            layout: {
                // layout-specific configs go here
                type: 'accordion',
                animate: true,
                multi: true
            },
            width: 200,
            items: [{
                xtype: 'tagTree',
                title: 'My Tags',
                store : 'Tags'
            },{
                xtype: 'tagTree',
                title: 'Shared Tags',
                store : 'SharedTags'
            }]
        },{
            id: 'snippet-panel',
            width: 250,
            hidden: true,
            layout: 'fit',
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'snippet-view',
                layout: 'fit',
                items: ['->' ,{
                    id: 'search-field',
                    xtype: 'trigger',
                    enableKeyEvents: true,
                    trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
                }]
            }],
            items: {
                xtype: 'snippetView'
            }
//            dockedItems: [{
//                xtype: 'pagingtoolbar',
//                store: 'Snippets',   // same store GridPanel is using
//                dock: 'top',
//                displayInfo: false,
//                listeners: {
//                    'afterlayout': function(me){
//                        var obj = me.items;
//                        obj.items[obj.indexMap['first']].hide();
//                        obj.items[obj.indexMap['last']].hide();
//                        obj.items[obj.indexMap['refresh']].hide();
//                        //obj.items.splice(obj.indexMap['last'], 1);
//                    }
//                }
//            }]
        },{
            id: 'main-panel',
            xtype: 'tabpanel',
            flex: 1,
            layout: 'fit',
            minTabWidth: 100,
            items: [{
                id: 'content-panel',
                title: 'Dashboard',
                xtype: 'dashboard'
            }]
        }]
    }]
});