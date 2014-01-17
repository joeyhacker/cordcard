Ext.Loader.setPath('Ext.ux', 'app/ux');

Ext.application({

    name: 'recall',
    controllers: [
        'Main',
        'Dashboard'
    ],
    autoCreateViewport: true,
    init: function() {
        CodeMirror.modeURL = '/codemirror-' + CodeMirror.version + '/mode/%N/%N.js';
        Ext.tip.QuickTipManager.init();
        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
    }
});