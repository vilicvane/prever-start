//Prever.FileSelector.PreverScriptControl

function $F( annex )
{
    var _this = this;
    
    /*
        annex参数
        Handle: function( selected: bool, files: Array ){} 回调
        FileExtensions:
        [
            {
                Text: string //Optional
                Exts: string
            }
        ]
        MultiSelect
        SaveMode: bool
    */
    
    //事件
    this.OnFileSelected = function(){};
    this.OnCancel = function(){};
    
    var fM; //FileManager控件
    
    var win = System.Window;
    var main, body;
    
    var mOp = new win.Option(); //Main Window Option 窗口选项
    
    mOp.Title = '选择文件'
    mOp.CreateTaskCard = false;
    mOp.Width = 410;
    mOp.Height = 245;
    
    var mainHTML =
    '<div class="MainBox">' +
        '<div class="FuncBox">' + //功能栏
            '<div class="PosBox Window_Border_Flat">' +
                '<div class="Position"></div>' +
                '<div class="PosArrow Window_Button_OpacityCover"></div>' +
            '</div>' +
            '<div class="FuncButtonBox">' +
                '<div class="Bt_Back Window_Button_OpacityCover" title="后退"></div>' +
                '<div class="Bt_Up Window_Button_OpacityCover" title="向上"></div>' +
                '<div class="Bt_CreateFolder Window_Button_OpacityCover" title="新建文件夹"></div>' +
                '<div class="Bt_ViewMode Window_Button_OpacityCover" title="视图"></div>' +
            '</div>' +
        '</div>' +
        '<div class="FMBox Window_Border_Flat"></div>' + //主要
        '<div class="OpBox">' +
            '<div class="FileInfoBox">' +
                '<div>　文件名: <input type="text" /></div>' +
                '<div>文件类型: <select></select></div>' +
            '</div>' +
            '<div class="OpButtonBox">' +
                '<button class="Disabled" disabled="disabled">' + ( annex.SaveMode ? '保存' : '打开' ) + '</button>' +
                '<button>取消</button>' +
            '</div>' +
        '</div>' + //操作栏
    '</div>' +
    '<div class="PosMenu Window_Border_Flat"></div>';
    
    var vMObj =
    {
        Texts: [ '缩略图', '图标', '列表' ],
        Conditions: [ true, true, true ],
        Functions:
        [
            function(){ fM.SetViewMode( 'Thumbnail' ); },
            function(){ fM.SetViewMode( 'Normal' ); },
            function(){ fM.SetViewMode( 'List' ); }
        ]
    };
    
    var cM = My.Control.ContextMenu;
    
    var vMMenu;
    var vMItems = cM.CreateItems( vMObj.Texts, vMObj.Conditions, vMObj.Functions );
    
    var nvgBox, mainBox;
    var funcBar, fMBox, opBar;
    
    var posMenu, posMenuBt;
    var posRootEles = [];
    
    var posText;
    var bt_back, bt_up, bt_cF, bt_vM;
    var input_file, select_type;
    var bt_ok, bt_cancel;
    
    var hostWindow = annex.HostWindow;
    
    var isTextMain = false; //指定打开以选取框为准还是以文本为准
    var defaultExts;
    var defaultExt;
    
    this.Start = function()
    {
        
    };
    
    //方法
    this.Open = function()
    {
        if ( !main )
        {
            main = new win.Popup( _this, mOp );
            main.AddCSS( 'Main.css', init );
        }
        else open();
    };
    
    //内外兼用
    
    //内部函数
    function init()
    {
        main.OnDispose = close;
        
        body = main.Body;
        body.className += ' Window_Background_Light';
        body.innerHTML = mainHTML;
        
        mainBox = body.childNodes[ 0 ];
        posMenu = body.childNodes[ 1 ];
        
        //指向元素
        var mainChs = mainBox.childNodes;
        funcBox = mainChs[ 0 ];
        fMBox = mainChs[ 1 ];
        opBox = mainChs[ 2 ];
        
        var posEles = funcBox.childNodes[ 0 ].childNodes;
        var funcBts = funcBox.childNodes[ 1 ].childNodes;
        
        posText = posEles[ 0 ];
        posMenuBt = posEles[ 1 ];
        
        bt_back = funcBts[ 0 ];
        bt_up = funcBts[ 1 ];
        bt_cF = funcBts[ 2 ];
        bt_vM = funcBts[ 3 ];
        
        var fileInfos = opBox.childNodes[ 0 ].childNodes;
        input_file = fileInfos[ 0 ].lastChild;
        select_type = fileInfos[ 1 ].lastChild;
        
        select_type.onchange = function()
        {
            fM.SetFileExtensions( select_type.value );
            defaultExts = select_type.value;
            defaultExt = select_type.value[ 0 ];
        };
        
        //添加文件类型选项
        (function()
        {
            var info = annex.FileExtensions;
            
            if ( !info ) info = [ { Text: '所有文件', Exts: '*' } ];
            else if ( typeof info == typeof [] && info.length == null ) info = [ info ];
            else if ( typeof info == typeof '' ) info = [ { Text: '文件', Exts: info } ];
            
            for ( var i = 0; i < info.length; i++ )
            {
                var option = document.createElement( 'OPTION' );
                
                var group = info[ i ];
                var text = group.Text || '文件';
                var exts = group.Exts;
                exts = exts.split( ',' );
                
                option.innerHTML = text + '(' + exts.join( ', ' ) + ')';
                option.value = exts;
                if ( !i )
                {
                    defaultExts = exts; //默认
                    defaultExt = exts[ 0 ];
                }
                select_type.appendChild( option );
            }
        })();
        
        //初始化位置栏
        (function()
        {
            var items = [ '桌面', 'System:\\', 'Disk:\\' ];
            var paths = [ My.Path.GetDesktopPath(), 'System:\\', 'Disk:\\' ];
            var url = My.Path.GetURL( My.FileSystem.GetIconPath( '#', true ) ); //获取小图标URL
            
            for ( var i = 0; i < items.length; i++ )
            {
                var node = createNode( items[ i ], url );
                setClick( node, paths[ i ] );
                posRootEles.push( node );
                posMenu.appendChild( node );
            }
            
            posMenu.onmouseout = function( ev )
            {
                if ( My.Element.IsMouseOut( posMenu, ev || event ) )
                    closePosMenu();
            };
            
            function setClick( node, path )
            {
                node.onclick = function(){ fM.SetPath( path ); };
            }
        })();
        
        var opBts = opBox.childNodes[ 1 ].childNodes;
        bt_ok = opBts[ 0 ];
        bt_cancel = opBts[ 1 ];
        
        
        vMMenu = new cM( cM.PositionType.ElementBottom, bt_vM, true );
        vMMenu.AddItems( vMItems );
        
        var op =
        {
            HostWindow: main,
            ViewMode: 'List',
            SelectHandle: openItem,
            MultiSelect: annex.MultiSelect,
            DefaultExtensions: defaultExts
        };
        
        _this.AddControl( 'Prever.FileManager', createControl, op );
        
        function createControl( done, control )
        {
            if ( done )
            {
                fM = control;
                fMBox.appendChild( fM.Element );
                fM.SetSize( 400, 150 );
                
                setPath( fM.CurrentPath );
                onBCh( fM.Backable );
                onUCh( fM.Uppable );
                
                fM.OnCurrentPathChange = setPath;
                fM.OnBackableChange = onBCh;
                fM.OnUppableChange = onUCh;
                fM.OnSelectedChange = checkSelect;
                
                bt_ok.onclick = openItem;
                bt_cancel.onclick = function()
                {
                    annex.Handle( false );
                    close();
                };
                
                main.OnDispose = function()
                {
                    annex.Handle( false );
                    var bool = main.IsMinimized;
                    close();
                    return bool;
                };
        
                input_file.onpropertychange = setOpenBt;
                My.Element.AddEvent( input_file, 'input', setOpenBt );
                
                bt_back.onclick = fM.Back;
                bt_up.onclick = fM.Up;
                bt_cF.onclick = fM.CreateFolder;
                bt_vM.onclick = function( ev )
                {
                    var e = ev || event;
                    vMMenu.Open( e );
                };
                
                posMenuBt.onclick = openPosMenu;
                
                complete();
            }
        }
        
        function complete()
        {
            main.Initialize();
            open();
        }
    }
    
    function open()
    {
        hostWindow.AddFocusHijack( main );
        fM.Refresh();
        input_file.value = '';
        main.CancelMinimized( hostWindow );
    }
    
    function close()
    {
        hostWindow.RemoveFocusHijack( main );
        main.Minimize();
    }
    
    function openPosMenu()
    {
        posMenu.style.display = 'block';
    }
    
    function closePosMenu()
    {
        posMenu.style.display = 'none';
    }
    
    //状态变化
    function onBCh( bool )
    {
        bt_back.className = 'Bt_Back ' + ( bool ? 'Window_Button_OpacityCover' : 'Window_Button_OpacityCoverDisabled' );
    }
    
    function onUCh( bool )
    {
        bt_up.className = 'Bt_Up ' + ( bool ? 'Window_Button_OpacityCover' : 'Window_Button_OpacityCoverDisabled' );
    }
    
    function checkSelect()
    {
        var items = fM.SelectedItems;
        
        var files = [];
        for ( var i = 0; i < items.length; i++ )
        {
            var item = items[ i ];
            if ( !item.IsFolder ) files.push( item.Name ); 
        }
        
        var len = files.length;
        if ( len )
        {
            if ( len == 1 )
                input_file.value = files[ 0 ];
            else
                input_file.value = '"' + files.join( '" "' ) + '"';
        }
        
        setOpenBt();
        isTextMain = false;
    }
    
    function setOpenBt()
    {
        if ( input_file.value || fM.CurrentItem )
        {
            bt_ok.disabled = false;
            bt_ok.className = '';
        }
        else
        {
            bt_ok.disabled = true;
            bt_ok.className = 'Disabled';
        }
        isTextMain = true;
    }
    
    function setPath( path )
    {
        closePosMenu();
        posText.title = path;
        var name = My.Path.GetFolderName( path );
        if ( name.EndsWith( ':' ) ) name += '\\';
        posText.innerHTML = name;
        var root = My.Path.GetRoot( path );
        path = path.substr( path.indexOf( ':' ) + 1 ).TrimStart( '\\' );
        
        
        var eles = posMenu.childNodes;
        
        for ( var i = 0; i < eles.length; i++ )
        {
            var ele = eles[ i ];
            ele.className = 'Node';
            var ch;
            while( ch = ele.childNodes[ 1 ] )
                ele.removeChild( ch );
        }
        
        var parentNode;
        
        switch ( root.toLowerCase() )
        {
            case 'system:\\':
                parentNode = eles[ 1 ];
                break;
            case 'disk:\\':
                parentNode = eles[ 2 ];
                break;
            default: return;
        }
        
        var i;
        var nPath = root;
        while ( ( i = path.indexOf( '\\' ) ) >= 0 )
        {
            var node = path.Left( i );
            nPath += node + '\\';
            
            path = path.substr( i + 1 );
            //创建节点
            
            var type = My.Path.GetExtension( node, true ); //获取类型
            var iconURL = My.Path.GetURL( My.FileSystem.GetIconPath( type, true ) ); //获取小图标URL
            
            var nodeDiv = createNode( node, iconURL );
            
            (function()
            {
                var path = nPath;
                nodeDiv.onclick = function( ev )
                {
                    fM.SetPath( path );
                    My.Event.CancelBubble( ev || event );
                };
            })();
            
            parentNode.appendChild( nodeDiv );
            parentNode = nodeDiv;
        }
        
        parentNode.className += ' Selected';
    }
    
    function openItem()
    {
        var files;
        var cI = fM.CurrentItem;
        if ( cI && cI.IsFolder && !isTextMain ) //如果当前选中的是一个文件夹,且以选取框为准
            fM.SetPath( cI.Name );
        else
        {
            var cP = fM.CurrentPath;
            files = [];
            var filesStr = input_file.value;
            if ( filesStr.Contains( '"' ) )
                filesStr.replace( /"(.+?)"/g, deal )
            else if ( filesStr )
                files.push( cP + addExt( filesStr ) );
            annex.Handle( true, files );
            close();
        }
        
        function deal( s, file )
        {
            files.push( cP + addExt( file ) );
        }
        
        function addExt( file )
        {
            var ext = My.Path.GetExtension( file );
            var addon = '.' + defaultExt;
            
            if ( ext )
            {
                ext = ext.substr( 1 );
                if ( defaultExts.Contains( ext ) ) addon = '';
            }
            
            return file + addon;
        }
    }
    
    function createNode( text, url )
    {
        var div = My.Element.CreateByHTML( '<div class="Node"><div class="Text"></div></div>');
        div.childNodes[ 0 ].innerHTML = text;
        div.style.backgroundImage = 'url(' + url + ')';
        return div;
    }
}