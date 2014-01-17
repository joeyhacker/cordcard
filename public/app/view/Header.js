Ext.define('recall.view.Header', {
    id: 'header',
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'appHeader',
    initComponent: function() {
        this.items = [{
            id: 'header-title',
            xtype: 'component',
            html: 'CodeCard 3.0'
        },'->',{
            xtype:'splitbutton',
            text: user.username,
            iconCls: 'user',
            margin: '0 24px 0 0',
            menu: new Ext.menu.Menu({
                width: 100,
                items: [
                    {
                        id: 'passwd-button',
                        iconCls: 'passwd',
                        text: 'Passwd'
                    },
                    {
                        xtype: 'menuseparator'
                    },
                    {
                        id: 'logout-button',
                        iconCls: 'logout',
                        text: 'Logout'
                    }
                ]
            })
        }];
        this.callParent();
    }
});
