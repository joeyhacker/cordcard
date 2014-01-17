Ext.define('recall.view.LoginWin', {
    extend : 'Ext.window.Window',
    xtype: 'loginWin',
    title: 'Login',
    height: 160,
    width: 300,
    bodyPadding: 10,
    modal: true,
    closable: false,
    layout: 'fit',
    items: {
        xtype: 'form',
        border: false,
        items: [{
            xtype: 'textfield',
            fieldLabel: '用户名',
            name: 'username',
            allowBlank: false
        },{
            xtype: 'textfield',
            inputType: 'password',
            fieldLabel: '密码',
            name: 'password',
            allowBlank: false
        }]
    },
    buttons: [{
        action: 'submit',
        text: 'submit'
    },{
        action: 'regist',
        text: 'regist'
    }]
});