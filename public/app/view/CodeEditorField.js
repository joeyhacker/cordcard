Ext.define('recall.view.CodeEditorField', {
    extend: 'Ext.form.field.TextArea',
    alias: 'widget.codeeditorfield',
    xtype: 'codeeditorfield',
    constructor: function(config) {
        this.config = config;
        this.config.onFocus = Ext.bind(this.onFocus, this);
        this.callParent(arguments);
    },

    initComponent: function() {
        Ext.apply(this, {
            autoScroll: false,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                resize: function(field, width, height){
                    this.editor.setSize(width, height);
                    this.editor.focus();
                },
                afterrender: function(field) {
                    this.editor = CodeMirror.fromTextArea(document.getElementById(field.getInputId()), this.config);
                    this.editor.setOption("theme", this.themeObj);
                    //CodeMirror.autoLoadMode(this.editor, this.config.mode);
                    //debugger;
                    if(this.modeObj){
                        this.change_mode(this.modeObj.mode, this.modeObj.mime);
                    }
                }
            }
        });

        this.callParent(arguments);

        this.on('focus', function(field){
            this.editor.focus();
            this.editor.showLine(1);
        }, this);
    },


    format_code: function(){
        var range = {
            from: this.editor.getCursor(true),
            to: this.editor.getCursor(false)
        };
        this.editor.autoFormatRange(range.from, range.to);
    },

    change_mode: function(mode, mime){
        CodeMirror.autoLoadMode(this.editor, mode);
        this.mode = mode;
        this.editor.setOption("mode", mime);
    },

    change_theme: function(themeName){
        this.editor.setOption("theme", themeName);
    },

    destroy: function() {
        this.editor.toTextArea();
        this.callParent(arguments);
    },

    getMode: function(){

    },

    getValue: function() {
        this.editor.save();
        return this.callParent(arguments);
    },

    setValue: function(value) {
        if (this.editor) {
            this.editor.setValue(value);
        }
        return this.callParent(arguments);
    }
});