Ext.define('recall.controller.Main', {
    extend: 'Ext.app.Controller',
    views: ['Header', 'SnippetView', 'TagTree', 'Dashboard'],
    stores: ['Snippets', 'Tags', 'SharedTags'],
    refs: [{
        ref: 'contentPanel',
        selector: '#main-panel'
    },{
        ref: 'tagTree',
        selector: 'tagTree'
    },{
        ref: 'snippetView',
        selector: 'snippetView'
    },{
        ref: 'snippetPanel',
        selector: '#snippet-panel'
    }],
    languages: [{
        name: 'C'
    },{
        name: 'Java'
    },{
        name: 'JavaScript'
    },{
        name: 'Python'
    },{
        name: 'CSS'
    },{
        name: 'XML'
    },{
        name: 'Shell'
    },{
        name: 'HTML'
    },{
        name: 'SQL'
    }],
    init: function() {
        this.control({
            'tagTree': {
                'itemcontextmenu': 'onTagTreeItemContextmenu',
                'itemclick': 'reloadSnippetView',
                'load': 'onTagTreeLoad',
                'containercontextmenu': 'donothing'
            },
            'tagTree treeview': {
                'render': 'initTagTreeDD'
            },
            'snippetView': {
                'itemdblclick': 'onSnippetViewItemClick',
                'containercontextmenu':'onSnippetContextMenu',
                'itemcontextmenu': 'onSnippetItemContextMenu',
                'containercontextmenu': 'donothing',
                'render': 'initSnippetViewDD'
            },
            '#main-panel': {
                'remove': 'onTabItemRemoved'
            },
            '#main-panel tabbar': {
                'dblclick': 'switchSnippetView'
            },
            '#passwd-button': {
                'click': 'doPasswd'
            },
            '#logout-button': {
                'click': 'doLogout'
            },
            '#search-field': {
                keypress: 'onSearchPressed'
            }
        });
        if(CodeMirror.modeInfo){
            CodeMirror.Modes = {};
            CodeMirror.modeInfo.forEach(function(obj){
                CodeMirror.Modes[obj.name] = {
                    mime: obj.mime,
                    mode: obj.mode
                };
            });
        }

        this.languages.forEach(function(l){
            Ext.util.CSS.createStyleSheet('.' + l.name + '-cls { background-image: url(resources/icons/lang/' + l.name + '.jpg) !important }');
        });

        Ext.get('loading').hide({
            duration: 1000
        });

        if(!Ext.isChrome){
           Ext.Msg.alert('Info', 'Please using Google Chrome To best effect !');
           return;
        }

//        this.spot = Ext.create('Ext.ux.Spotlight', {
//            easing: 'easeOut',
//            duration: 300
//        });
    },
    onSearchPressed: function(me, e){
        if(e.getKey() == Ext.EventObject.ENTER && me.getValue()){
            var store = this.getStore('Snippets');
            store.load({
                params: {
                    filter: Ext.encode({
                        title: {
                            $regex: '.*' + me.getValue() + '.*'
                        }
                    })
                }
            });
            this.getSnippetPanel().show();
        }
    },
    doPasswd: function(){
        Ext.Msg.prompt('Passwd', 'enter your new password', function(btn, text){
            if (btn == 'ok' && text){
                Ext.Ajax.request({
                    url: '/passwd',
                    params: {
                        username: user.username,
                        password: text
                    },
                    success: function(o){
                        Ext.Msg.alert('Info', 'Success, please remember it, <font color="red">' + text + '</font>');
                    }
                });
            }
        });
    },
    doLogout: function(){
        location.href = '/logout';
    },
    switchSnippetView: function(){
        if(!this.getSnippetPanel().isHidden()){
            this.getSnippetPanel().hide();
        }else{
            this.getSnippetPanel().show();
        }
    },
    onTagTreeLoad: function(me, node, rec){
//        if(!rec.length){
//            var id = me.ownerTree.getView().id;
//            this.spot.show(id);
//        }
    },
    reloadSnippetView: function(me, rec, item, idx, e){
        me.expand(rec);
        var _filter = {
            tagId: rec.internalId
        }
        this.getStore('Snippets').load({
            scope: this,
            start: 0,
            params: {
                filter: Ext.encode(_filter)
            },
            callback: function(recs, op){
                /*if(recs && recs.length){
                 this.getSnippetPanel().setVisible(true);
                 }else{
                 this.getSnippetPanel().setVisible(false);
                 }*/
                this.getSnippetPanel().show();
            }
        });
    },
    appandNode: function(pId, id, text, leaf){
        var tree = this.getTagTree();
        var node =  tree.getRootNode().findChild('id', pId, true);
        node.appendChild({
            id: id,
            text: text,
            leaf: leaf
        });
    },
    onTabItemRemoved: function(me, p){
        //alert(p.fileId);
    },
    showSnippetTab: function(tagId, fileId, title, lang, content, theme){
        var that = this;
        var cp = that.getContentPanel();
        if(!cp.ids){
            cp.ids = [];
        }

        if(fileId){
            if(cp.ids.indexOf(fileId) > -1){
                return;
            }else{
                cp.ids.push(fileId);
            }
        }

        var ds = [];
        this.languages.forEach(function(l){
            ds.push({
                name: l.name
            });
        });

        var t = new Ext.form.field.ComboBox({
            store: Ext.create('Ext.data.Store', {
                fields: ['name'],
                data : [{name: 'eclipse'}, {name: 'monokai'}, {name: 'xq-dark'}]
            }),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            value: theme || 'eclipse',
            editable: false,
            width: 100,
            listeners: {
                scope: that,
                select: function(me, rs){
                    editor.change_theme(rs[0].data.name);
                }
            }
        });

        var c = new Ext.form.field.ComboBox({
            store: Ext.create('Ext.data.Store', {
                fields: ['name'],
                data : ds
            }),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            value: lang,
            editable: false,
            width: 100,
            lazyRender: true,
            listConfig: {
                itemTpl: Ext.create('Ext.XTemplate',
                    '<div>',
                    '<img src="/resources/icons/lang/{name}.jpg" style="vertical-align:middle;"/>&nbsp{name}',
                    '</div>'
                )
            },
            listeners: {
                scope: that,
                select: function(me, rs){
                    var modeObj = CodeMirror.Modes[rs[0].data.name];
                    editor.change_mode(modeObj.mode, modeObj.mime);
                }
            }
        });


        function doSave(){
            if(!ti.getValue()){
                ti.focus(true, 100);
                Ext.Msg.alert('Error', 'Title can\'t be null !');
                return;
            }
            var params = {
                id: fileId,
                tagId: tagId,
                title: ti.getValue(),
                content: editor.getValue(),
                lang: c.getValue(),
                theme: t.getValue()
            };
            Ext.Ajax.request({
                url: '/snippet/save',
                params: params,
                scope: that,
                success: function(o){
                    var obj = Ext.decode(o.responseText);
                    if(obj.id){
                        fileId = obj.id;
                        cp.ids.push(fileId);
                        Ext.easy.msg('Info', 'Snippet has been saved !');
                    }else{
                        Ext.easy.msg('Info', 'Snippet has been updated !');
                    }
                    that.getStore('Snippets').reload();
                }
            });
        }


        var editor = Ext.create('recall.view.CodeEditorField',{
            lineNumbers: true,
            tabSize: 4,
            indentUnit: 0,
            indentWithTabs: true,
            lineWrapping: true,
            modeObj: lang ? CodeMirror.Modes[lang]: '',
            value: content,
            themeObj: theme ? theme: 'eclipse',
            extraKeys: {
                'Ctrl-S': doSave
            }
        });

        var b = Ext.create('Ext.button.Button', {
            iconCls: 'save',
            text: 'Save',
            scope: that,
            handler: doSave
        });

        var ti = Ext.create('Ext.form.field.Text', {
            width: 200,
            value: title
        });


        var f =  Ext.create('Ext.button.Button', {
            text: 'Format',
            scope: that,
            handler: function(){
               editor.format_code();
            }
        });


        var p = cp.add({
            id: fileId + '-tab',
            xtype: 'panel',
            iconCls: lang + '-cls',
            title: title,
            layout: 'fit',
            closable: true,
            items: editor,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                ui: 'footer',
                items: ['Title', ti,'Lang', c,'-','Theme', t,'->', b]
            }]
        });

        p.on('close', function(){
            if(fileId){
                var idx = cp.ids.indexOf(fileId);
                cp.ids.splice(idx, 1);
            }
        });

        Ext.defer(function(){
            cp.setActiveTab(p);
        }, 1);
    },
    onSnippetViewItemClick: function(me, rec, item, idx, e){
        //e.stopEvent();
        var id = rec.data._id;
        var cp = this.getContentPanel();
        var p = cp.getComponent(id + '-tab');

        if(p){
            cp.setActiveTab(p);
        }else{
            snippetViewLoadMask.show();
            Ext.Ajax.request({
                url: '/snippet/get',
                params: {'_id': id},
                scope: this,
                success: function(o){
                    snippetViewLoadMask.hide();
                    var obj = Ext.decode(o.responseText);
                    var doc = obj.doc;
                    if(doc){
                        this.showSnippetTab(doc.tagId, doc._id, doc.title, doc.lang, doc.content, doc.theme);
                    }
                }
            });
        }
    },
    onTagTreeItemContextmenu: function(me, rec, item, idx, e){
        e.stopEvent();
        //this.reloadSnippetView(me, rec);

        var tree = me.ownerCt;
        var node =  tree.getRootNode().findChild('id', rec.internalId, true);
        function createTag(pId, name){
            Ext.Ajax.request({
                url: '/tag/create',
                params: {
                    parentId: pId,
                    name: name
                },
                scope: this,
                success: function(o){
                    var obj = Ext.decode(o.responseText);
                    if(node){
                        if(node.isLeaf()){
                            node.data.leaf = false;
                        }
                        if(!node.isExpanded()){
                            node.expand();
                        }else{
                            node.appendChild({
                                id: obj.id,
                                text: name
                            });
                        }
                    }
                }
            });
        }
        function updateTag(id, name){
            Ext.Ajax.request({
                url: '/tag/update',
                params: {
                    _id: id,
                    name: name
                },
                scope: this,
                success: function(o){
                    node.updateInfo(true, {
                        text: name
                    });
                }
            });
        }
        function deleteTag(id){
            Ext.Ajax.request({
                url: '/tag/remove',
                params: {
                    _id: id
                },
                scope: this,
                success: function(o){
                    var obj = Ext.decode(o.responseText);
                    if(!obj.success){
                        Ext.Msg.alert('Error', obj.errorMsg);
                    }else{
                        node.remove(true);
                    }
                }
            });
        }

        var that = this;
        var menu = Ext.create('Ext.menu.Menu', {
            plain: true,
            fixed: true,
            title: node.data.text,
            items: [{
                iconCls: 'create',
                text: 'New',
                menu: {
                    items: [{
                        iconCls: 'file',
                        text: 'File',
                        hidden: !idx,
                        handler: function(){
                            Ext.Msg.prompt('New File', '', function(btn, text){
                                if (btn == 'ok' && text){
                                    that.showSnippetTab(rec.internalId, '', text, '', '');
                                }
                            });
                        }
                    },{xtype: 'menuseparator',hidden: !idx},{
                        iconCls: 'folder',
                        text: 'Tag',
                        handler: function(){
                            Ext.Msg.prompt('New Tag', '', function(btn, text){
                                if (btn == 'ok' && text){
                                    createTag(rec.internalId, text);
                                }
                            });
                        }
                    }]
                }
            },{xtype: 'menuseparator',hidden: !idx},{
                iconCls: 'edit',
                text: 'Edit',
                hidden: !idx,
                handler: function(){
                    Ext.Msg.prompt('Rename Tag', '', function(btn, text){
                        if (btn == 'ok' && text){
                            updateTag(rec.internalId, text);
                        }
                    }, true, false, node.data.text);
                }
            },{xtype: 'menuseparator',hidden: !idx},{
                iconCls: 'delete',
                text: 'Delete',
                hidden: !idx,
                handler: function(){
                    Ext.Msg.confirm('Confirm?', 'I will delete the tag ?', function(buttonId){
                        if(buttonId == 'yes'){
                            deleteTag(rec.internalId);
                        }
                    });
                }
            }]
        });
        menu.showAt(e.getX(), e.getY(), true);
    },
    onSnippetContextMenu: function(me, e){
        /*e.stopEvent();
        var menu = Ext.create('Ext.menu.Menu', {
            plain: true,
            fixed: true,
            title: node.data.text,
            items: [{
                iconCls: 'create',
                text: 'New',
                menu: {
                    items: [{
                        iconCls: 'file',
                        text: 'File',
                        hidden: !idx,
                        handler: function(){
                            Ext.Msg.prompt('New File', '', function(btn, text){
                                if (btn == 'ok' && text){
                                    that.showSnippetTab(rec.internalId, '', text, '', '');
                                }
                            });
                        }
                    }]
                }
            }]
        });
        menu.showAt(e.getX(), e.getY(), true);*/
    },
    onSnippetItemContextMenu: function(me, rec, item, idx, e){
        e.stopEvent();
        var that = this;
        var deleteSnippet = function(id){
            if(that.getContentPanel().ids && that.getContentPanel().ids.indexOf(id) > -1){
                Ext.Msg.alert('Error', 'The file is already has been opened , please close it first!');
                return;
            }
            Ext.Ajax.request({
                url: '/snippet/remove',
                params: {
                    _id: id
                },
                scope: this,
                success: function(){
                    that.getStore('Snippets').remove(rec);
                }
            });
        }
        var menu = Ext.create('Ext.menu.Menu', {
            plain: true,
            fixed: true,
            title: rec.data.title,
            items: [{
                iconCls: 'edit',
                text: 'Edit',
                scope: this,
                handler: function(){
                    this.onSnippetViewItemClick(me, rec);
                }
            },{xtype: 'menuseparator'},{
                iconCls: 'delete',
                text: 'Delete',
                handler: function(){
                    Ext.Msg.confirm('Confirm?', 'I will delete the snippet?', function(buttonId){
                        if(buttonId == 'yes'){
                            deleteSnippet(rec.data._id);
                        }
                    });
                }
            }]
        });
        menu.showAt(e.getX(), e.getY(), true);
    },
    donothing: function(me, e){
        e.stopEvent();
    },
    initTagTreeDD: function(v){
        var panel = v.up('treepanel');
        var that = this;
        panel.dropZone = Ext.create('Ext.dd.DropZone', v.getEl(), {
            ddGroup: this.id + '-ddGroup',
            getTargetFromEvent: function(e) {
                var node = e.getTarget('tr.x-grid-row');
                if(node){
                    var r = v.getRecord(node);
                    if(r){
                        return {
                            node: node,
                            record: r
                        }
                    }
                }

            },
            onNodeEnter : function(target, dd, e, data){
                v.addRowCls(target.node, 'node-drop-enter');
            },
            onNodeOut: function(target, dd, e, data) {
                v.removeRowCls(target.node, 'node-drop-enter');
            },
            onNodeOver : function(target, dd, e, data){
                return Ext.dd.DropZone.prototype.dropAllowed;
            },
            onNodeDrop: function(target, dd, e, data) {
                var data = data.patientData;
                if(data){
                    var id = data._id;
                    var store = that.getStore('Snippets');
                    var idx = store.indexOfId(id);
//                    if(idx == -1){
                        var tagId = target.record.internalId;
                        Ext.Ajax.request({
                            url: '/snippet/move',
                            params: {
                                id: id,
                                tagId: tagId
                            },
                            scope: this,
                            success: function(o){
                                Ext.easy.msg('Info', 'Snippet has been moved !');
                                store.removeAt(idx);
                            }
                        });
//                    }
                }
            }
        });
    },
    initSnippetViewDD: function(v){
        snippetViewLoadMask = new Ext.LoadMask(this.getContentPanel(), {msg:"Loading Code ..."});

        v.dragZone = Ext.create('Ext.dd.DragZone', v.getEl(), {
            ddGroup: this.id + '-ddGroup',
            animRepair: false,
            getDragData: function(e) {
                var sourceEl = e.getTarget(v.itemSelector), d;
                if (sourceEl) {
                    d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return (v.dragData = {
                        sourceEl: sourceEl,
                        repairXY: Ext.fly(sourceEl).getXY(),
                        ddel: d,
                        patientData: v.getRecord(sourceEl).data
                    });
                }
            },

            getRepairXY: function() {
                return this.dragData.repairXY;
            }
        });
    }
});
