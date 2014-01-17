Ext.define('recall.view.SnippetPanel', {
    extend : 'Ext.panel.Panel',
    xtype: 'snippetPanel',
    initComponent: function() {
        Ext.apply(this, {
            headerPosition: 'bottom',
            height: 300,
            layout: 'fit',
            closable: false,
            resizable: true,
            border: false,
            frame: false,
            cls: 'snippet-panel',
            tools: [{
                type: 'maximize',
                tooltip: '最大化'
            }],
            items: {
                xtype: 'textarea',
                fieldStyle: "background: #ffc none repeat scroll 0 0 !important;"
            }
        });

        this.callParent(arguments);

        this.on('afterrender', function(c){
            c.getHeader().add({
                rid: this.record.data._id,
                xtype: 'checkbox',
                margin: '0 0 0 5px'
            });
            this.updateRecord(this.record);
        }, this);
    },
    updateRecord: function(rec){
        this.setTitle(rec.data.title + ' [' + rec.data.createTime + ']');
        this.setIconCls(rec.data.type + '-cls');
        this.down('textarea').setValue(rec.data.content);
    }
});