//Prever.FileManager.PreverScriptControl

/*

    annex选项
    IconHandle
    ShowHidden
    OpenFolderBySelf
    OpenName
    HostWindow: System.Window.*
    AimDirectory
    DefaultExtensions

*/

function $F( annex )
{
    var _this = this;
    
    /*******************************************************/
    //事件
    this.OnUppableChange = function(){};
    this.OnBackableChange = function(){};
    this.OnForwardableChange = function(){};
    
    this.OnSelectedChange = function(){};
    this.OnCurrentPathChange = function(){};
    /*******************************************************/
    
    this.Uppable = null;
    this.Backable = null;
    this.Forwardable = null;
    this.CurrentPath = '';
    
    this.SelectedItems = [];
    /*******************************************************/
    
    var showHidden = annex.ShowHidden || false;
    
    var openSelf = ( annex.OpenFolderBySelf == null ) ? true : annex.OpenFolderBySelf;
    var openName = annex.OpenName || '打开';
    openName = '!' + openName;
    
    var hostWindow = annex.HostWindow;
    var selectHandle = annex.SelectHandle;
    
    var Icon = My.Control.Icon;
    
    var div = document.createElement( 'DIV' );
    this.Element = div;
    
    div.className = '$F';
    
    var iC;
    
    var myDir;
    
    var nowPathPos = 0; //当前路径在记录中的位置
    var pathNote = [];
    
    var itemsToCut = []; //记录被剪切的项,用于还原
    var dExts = annex.DefaultExtensions;
    
    var extMenuArr =
    [
        {
            Texts: [ '上传文件', '下载到本地' ],
            Conditions: [ isUploadable, isDownloadable ],
            Functions: [ function(){ upload( true ); }, download ]
        },
        {
            Texts: [ '粘贴', '剪切', '复制' ],
            Conditions: [ function(){ return isPastable( true ); }, true, true ],
            Functions: [ paste, cut, copy ]
        },
        {
            Texts: [ /*'创建快捷方式', */'删除', '重命名' ],
            Conditions: [ /*false, */true, true ],
            Functions: [ /*null, */del, rename ]
        },
        {
            Texts: [ '属性' ],
            Conditions: [ true ],
            Functions: [ viewPrototype ]
        }
    ];
    
    var eleMenuArr =
    [
        {
            Texts: [ '上传文件' ],
            Conditions: [ true ],
            Functions: [ function(){ upload( false ); } ]
        },
        {
            Texts: [ '查看' ],
            Conditions: [ true ],
            Functions: []
        },
        {
            Texts: [ '刷新' ],
            Conditions: [ true ],
            Functions: [ refresh ]
        },
        {
            Texts: [ '粘贴', '粘贴快捷方式' ],
            Conditions: [ isPastable, isLinkable ],
            Functions: [ paste, createLinkFile ]
        },
        {
            Texts: [ '新建文件夹' ],
            Conditions: [ true ],
            Functions: [ createFolder ]
        },
        {
            Texts: [ '属性' ],
            Conditions: [ true ],
            Functions: [ viewPrototype ]
        }
    ];
    
    var viewMenuObj =
    {
        Texts: [ '缩略图', '图标', '列表' ],
        Conditions: [ true, true, true ],
        Functions:
        [
            function(){ setViewMode( 'Thumbnail' ); },
            function(){ setViewMode( 'Normal' ); },
            function(){ setViewMode( 'List' ); }
        ]
    };
    
    var eleMenu = getEleMenu();
    
    this.Start = function()
    {
        myDir = new My.Directory();
        
        var aimDir = annex.AimDirectory || 'Disk:\\';
        
        var option =
        {
            GetMenuArray: getMenuArr,
            EleMenu: eleMenu,
            XFirst: annex.XFirst,
            AutoAdjust: annex.AutoAdjust,
            LeftToRight: annex.LeftToRight,
            TopToBottom: annex.TopToBottom,
            MultiSelect: annex.MultiSelect
        };
        
        iC = new Icon.Container( getIconClass( annex.ViewMode ), iconHandle, option );
        
        _this.SelectedItems = iC.SelectedItems;
        iC.OnSelectedChange = function()
        {
            _this.CurrentItem = iC.CurrentItem;
            _this.OnSelectedChange();
        };
        
        div.appendChild( iC.Element );
        setPath( aimDir );
    };
    
    this.OpenSelected = function()
    {
        //#####################################################
    };
    
    this.SetSize = function( width, height )
    {
        if ( width != null )
        {
            if ( width < 0 ) width = 0;
            div.style.width = ( _this.Width = width ) + 'px';
        }
        if ( height != null )
        {
            if ( height < 0 ) height = 0;
            div.style.height = ( _this.Height = height ) + 'px';
        }
        iC.SetSize( width, height );
    };
    
    this.SetShowHidden = function( bool )
    {
        showHidden = bool;
        refresh();
    };
    
    //设置文件选取的把手
    this.SetSelectHandle = function( handle )
    {
        selectHandle = handle;
    };
    
    this.SetViewMode = setViewMode;
    
    this.FocusIn = function()
    {
        
    };
    
    this.FocusOut = function()
    {
        iC.FocusOut();
    };
    
    this.CancelCut = function()
    {
        for ( var i = 0; i < itemsToCut.length; i++ )
            itemsToCut[ i ].SetCut( false );
        itemsToCut = [];
    };
    
    this.SetFileExtensions = function( exts )
    {
        if ( typeof exts == typeof '' ) exts = exts.split( ',' );
        dExts = exts;
        refresh();
    };
    
    this.Load = load;
    this.SetPath = setPath;
    this.Up = up;
    this.Forward = forward;
    this.Back = back;
    this.Refresh = refresh;
    
    this.CreateFolder = createFolder;
    
    function load( path, handle )
    {
        myDir.SetPath( path );
        
        var extRe;
        if ( dExts && dExts[ 0 ] != '*' ) extRe = '(' + dExts.join( '|' ) + ')$';
        
        myDir.GetDirsAndFiles( dHandle, showHidden, extRe );
        
        handle = handle || function(){};
        
        function dHandle( done )
        {
            if ( done )
            {
                var dItems = myDir.Directories;
                var fItems = myDir.Files;
                
                var dNames = dItems.Names;
                var dHiddens = dItems.Hiddens;
                var dLasts = dItems.LastWriteTimes;
                
                var fNames = fItems.Names;
                var fSizes = fItems.Sizes;
                var fHiddens = fItems.Hiddens;
                var fLasts = fItems.LastWriteTimes;
                
                var fS = My.FileSystem;
                var fl = fS.File;
                var fd = fS.Folder;
                
                var list = [];
                
                for ( var i = 0; i < dNames.length; i++ )
                    list.push( new fd( dNames[ i ], path, dHiddens[ i ], dLasts[ i ] ) );
                    
                for ( var i = 0; i < fNames.length; i++ )
                    list.push( new fl( fNames[ i ], path, fSizes[ i ], fHiddens[ i ], fLasts[ i ] ) );
                    
                iC.ClearAll();
                iC.Add( list );
                handle( true );
            }
            else handle( false );
        }
    }
    
    function setPath( path, note )
    {
        var bfr = _this.CurrentPath;
        path = My.Path.Normalize( path, true );
        if ( !My.Path.IsAbsolute( path ) ) path = bfr + path;
        
        load( path, handle );
        
        function handle( done )
        {
            if ( done )
            {
                if ( note == null || note )
                {
                    if ( pathNote.length > 20 ) pathNote.shift();
                    pathNote.push( path );
                    nowPathPos = pathNote.length - 1;
                }
                
                itemsToCut = [];
                
                _this.CurrentItem = null;
                _this.CurrentPath = path;
                _this.OnCurrentPathChange( path );
                
                checkPath();
            }
            else hostWindow.Message( { Text: '访问失败!该目录可能不存在,或您没有足够的权限!', Type: 'Error', No: '重试' }, mHandle );
        }
        
        function mHandle( bool )
        {
            if ( bool != null && !bool ) setPath( path, note );
        }
    }
    
    function back()
    {
        if ( nowPathPos > 0 )
        {
            nowPathPos--;
            if ( _this.CurrentPath == pathNote[ nowPathPos ] )
            {
                pathNote.RemoveByIndex( nowPathPos );
                back();
            }
            else setPath( pathNote[ nowPathPos ], false );
        }
    }
    
    function forward()
    {
        if ( nowPathPos + 1 < pathNote.length )
        {
            nowPathPos++;
            if ( _this.CurrentPath == pathNote[ nowPathPos ] )
            {
                pathNote.RemoveByIndex( nowPathPos );
                forward();
            }
            else setPath( pathNote[ nowPathPos ], false );
        }
    }
    
    function up()
    {
        var path = _this.CurrentPath;
        if ( path.EndsWith( ':\\' ) ) return;
        path = path.Left( path.length - 1 );
        path = path.substr( 0, path.lastIndexOf( '\\' ) + 1 );
        setPath( path );
    }
    
    function checkPath()
    {
        var bfr, now;
        
        //检查是否可后退
        bfr = _this.Backable;
        now = ( nowPathPos > 0 );
        
        if ( bfr != now )
        {
            _this.OnBackableChange( now );
            _this.Backable = now;
        }
        
        //检查是否可前进
        bfr = _this.Forwardable;
        now = ( nowPathPos + 1 < pathNote.length );
        if ( bfr != now )
        {
            _this.OnForwardableChange( now );
            _this.Forwardable = now;
        }
        
        //检查是否可向上
        bfr = _this.Uppable;
        now = !_this.CurrentPath.EndsWith( ':\\' );
        if ( bfr != now )
        {
            _this.OnUppableChange( now );
            _this.Uppable = now;
        }
    }
    
    function getMenuArr( type )
    {
        var CM = My.Control.ContextMenu;
        var mArr = [ CM.CreateItems( [ openName ], [ true ], [ iconHandle ] ) ];
        
        mArr.Append( [ CM.GetItemsFor( type, cMHandle ) ] );
        
        for ( var i = 0; i < extMenuArr.length; i++ )
        {
            var one = extMenuArr[ i ];
            mArr.push( CM.CreateItems( one.Texts, one.Conditions, one.Functions ) );
        }
        
        return mArr;
    }
    
    function getEleMenu()
    {
        var CM = My.Control.ContextMenu;
        var cM = new CM();
        
        var eItems = [];
        
        for ( var i = 0; i < eleMenuArr.length; i++ )
        {
            var one = eleMenuArr[ i ];
            eItems[ i ] = CM.CreateItems( one.Texts, one.Conditions, one.Functions );
            if ( i ) cM.AddSeparator();
            cM.AddItems( eItems[ i ] );
        }
        
        var viewM = new CM();
        
        var vItems = CM.CreateItems( viewMenuObj.Texts, viewMenuObj.Conditions, viewMenuObj.Functions );
        
        viewM.AddItems( vItems );
        eItems[ 1 ][ 0 ].AddChildMenu( viewM ); //第二个小项的第一个
        
        return cM;
    }
    
    function cMHandle( item, annex )
    {
        if ( !item.Annex ) item.Annex = {};
        
        item.Annex.AimFiles = annex.AimFiles;
        item.Annex.AimDirectories = annex.AimDirectories;
        item.Annex.FileManager = _this;
        
        var path, type;
        var gE = My.Path.GetExtension;
        if ( annex.AimFile )
        {
            path = annex.AimFile;
            type = gE( path );
        }
        else if ( annex.AimDirectory )
        {
            path = annex.AimDirectory;
            type = gE( path, true );
        }
        
        if ( path )
            System.FileSystem.Open( path, type, item.ProgramUID, item.Annex );
    }
    
    function iconHandle( annex )
    {
        if ( annex.AimFile )
        {
            if ( selectHandle ) selectHandle( annex );
            else System.FileSystem.Open( annex.AimFile, null, null, { FileManager: _this } );
        }
        else if ( annex.AimDirectory )
        {
            var path = annex.AimDirectory;
            var ext = My.Path.GetExtension( path, true );
            
            if ( !System.FileSystem.RelatedPrograms[ ext ] ) ext = '#';
            
            if ( ext == '#' && openSelf ) setPath( path );
            else if ( selectHandle ) selectHandle( annex );
            else System.FileSystem.Open( path, ext, null, { FileManager: _this } );
        }
    }
    
    function setViewMode( mode )
    {
        iC.SetIconClass( getIconClass( mode ) );
    }
    
    function getIconClass( mode )
    {
        var Icon = My.Control.Icon;
        if ( mode )
        {
            mode = mode.toLowerCase();
            
            if ( mode == 'thumbnail' )
                return Icon.Thumbnail;
            if ( mode == 'list' )
                return Icon.List;
        }
        return Icon.Normal;
    }
    
    /****************************************************************/
    /****************************************************************/
    //右键菜单函数
    
    function refresh()
    {
        load( _this.CurrentPath );
    }
    
    //功能函数
    function del()
    {
        var sItems = iC.SelectedItems;
        var list = getSelected();
        var files = list.Files;
        var dirs = list.Dirs;
    
        var amt = files.length + dirs.length;
        
        hostWindow.Message( { Text: '确认将删除所选的 ' + amt + ' 个项目,此操作将无法恢复!', Type: 'Confirm' }, handle )
        
        function handle( bool )
        {
            if ( bool ) My.FileSystem.Delete( files, dirs, delHandle );
        }
        
        function delHandle( done )
        {
            if ( done ) refresh();
        }
    }
    
    function copy( isCut )
    {
        var data = System.Clipboard.GetData( 'FileSystem' );
        if ( data && data.Operation == 'Cut' && data.Operator && data.Operator.CancelCut )
            data.Operator.CancelCut();
            
        var list = getSelected();
        var files = list.Files;
        var dirs = list.Dirs;
        System.Clipboard.SetData( { Files: files, Directories: dirs, Operation: ( isCut == true ? 'Cut' : 'Copy' ), Operator: _this }, 'FileSystem' );
    }
    
    function cut()
    {
        copy( true );
        
        var items = iC.SelectedItems;
        itemsToCut = [];
        for ( var i = 0; i < items.length; i++ )
        {
            var item = items[ i ];
            item.SetCut( true );
            itemsToCut.push( item );
        }
    }
    
    function paste()
    {
        var to;
        
        var cItem = iC.CurrentItem;
        if ( cItem && cItem.IsFolder ) to = cItem.Path;
        else to = _this.CurrentPath;  
        
        var data = System.Clipboard.GetData( 'FileSystem' );
        if ( !data ) return;
        var files = data.Files;
        var dirs = data.Directories;
        
        var isCut = ( data.Operation == 'Cut' );
        var operator = data.Operator;
        
        var opFunction = isCut ? My.FileSystem.LotSizeMove : My.FileSystem.LotSizeCopy;
        
        if ( isCut ) System.Clipboard.SetData( null, 'FileSystem' );
        
        opFunction( files, dirs, to, null, handle );
        
        function handle( done, e )
        {
            if ( done ) fHandle( true );
            else if ( ( e == 'FileAlreadyExists' || e == 'DirectoryAlreadyExists' ) )
                hostWindow.Message( { Text: '目标目录中有文件或文件夹与当前文件或文件夹重名,是否覆盖其中的同名文件或文件夹?', Type: 'Confirm', Yes: '全是', No: '全否' }, cHandle );
            else fHandle( false, e );
        }
        
        function cHandle( bool )
        {
            if ( bool == null ) return;
            opFunction( files, dirs, to, bool, fHandle );
        }
        
        function fHandle( done, e )
        {
            if ( !done )
            {
                var msg;
                
                if ( ( e == 'FileNotFound' || e == 'DirectoryNotFound' ) )
                    msg = '源文件或文件夹不存在!';
                else if ( ( e == 'AimFileEqualsSourceFile' || e == 'AimDirectoryEqualsSourceDirectory' ) )
                    msg = '源文件或文件夹与目标文件或文件夹相同!';
                else if ( e == 'SourceDirectoryContainsAimDirectory' )
                    msg = '源文件夹是目标文件夹的父文件夹!';
                else
                    msg = '操作中发生错误,请重试!';
                
                hostWindow.Message( { Text: msg, Type: 'Error' } );
                
            }
            
            if ( to == _this.CurrentPath ) refresh();
            if ( isCut && !!operator ) operator.Refresh();
        }
    }
    
    function createFolder()
    {
        My.FileSystem.GetAvailableName( _this.CurrentPath, '新建文件夹', gHandle );
        
        var sPath; //建议路径
        
        function gHandle( path )
        {
            path = path.Trim();
            sPath = path;
            name = My.Path.GetFileName( path );
            hostWindow.Input( { Text: '请输入文件夹名称:', Title: '新建文件夹', Value: name, Width: 200 }, cHandle );
        }
        
        function cHandle( name )
        {
            if ( name == null ) return;
            
            if ( !My.Path.IsFileName( name ) )
                hostWindow.Message( { Text: '请输入合法的文件夹名称!', Type: 'Waring' }, function(){ gHandle( sPath ); } );
            else
                My.FileSystem.CreateDirectory( _this.CurrentPath + name, fHandle );
        }
        
        function fHandle( done, e )
        {
            if ( done ) refresh();
            else if ( e == 'FileAlreadyExists' || e == 'DirectoryAlreadyExists' )
                hostWindow.Message( { Text: '已存在同名文件或文件夹!', Type: 'Error' }, function(){ gHandle( sPath ); } );
            else hostWindow.Message( { Text: '操作中发生错误,请重试!', Type: 'Error' } );
        }
    }
    
    function rename()
    {
        var cItem = iC.CurrentItem;
        
        if ( !cItem ) return;
        
        var srcName = cItem.Name;
        var isFolder = cItem.IsFolder;
        var cPath = _this.CurrentPath;
        
        hostWindow.Input( { Text: '请输入重命名名称:', Title: '重命名', Value: srcName, Width: 200 }, rHandle );
        
        function rHandle( name )
        {
            if ( name == null || ( name = name.Trim() ) == srcName ) return;
            
            if ( !My.Path.IsFileName( name ) )
                hostWindow.Message( { Text: '请输入合法的名称!', Type: 'Waring' }, rename );
            else
                My.FileSystem.Move( cPath + srcName, cPath + name, isFolder, fHandle );
        }
        
        function fHandle( done, e )
        {
            if ( done ) refresh();
            else if ( e == 'FileAlreadyExists' || e == 'DirectoryAlreadyExists' )
                hostWindow.Message( { Text: '已存在同名文件或文件夹!', Type: 'Error' }, rename );
            else hostWindow.Message( { Text: '操作中发生错误,请重试!', Type: 'Error' } );
        }
    }
    
    function viewPrototype()
    {
        var annex = {};
        var item = iC.CurrentItem;
        
        if ( item )
        {
            var path = item.Path;
            if ( item.IsFolder ) annex.AimDirectory = path;
            else annex.AimFile = path;
        }
        else annex.AimDirectory = _this.CurrentPath;
        
        System.Program.Launch( _this.Path + '\\PrototypeViewer.psp', null, annex );
    }
    
    function getSelected()
    {
        var sItems = iC.SelectedItems;
        
        var files = [];
        var dirs = [];
        
        for ( var i = 0; i < sItems.length; i++ )
        {
            var item = sItems[ i ];
            if ( item.IsFolder ) dirs.push( item.Path );
            else files.push( item.Path );
        }
        
        return { Files: files, Dirs: dirs };
    }
    
    function upload( bool )
    {
        var annex =
        {
            AutoDispose: true,
            AimDirectory: bool ? iC.CurrentItem.Path : _this.CurrentPath
        };
        
        System.Program.Launch( _this.Path + '\\Upload.psp', handle, annex );
        
        function handle( done, obj )
        {
            if ( !bool && done ) obj.OnFinishUpload = finish;
        }
        
        function finish()
        {
            hostWindow.Message( '文件上传完毕!' );
            refresh();
        }
    }
    
    function createLinkFile()
    {
        var path = _this.CurrentPath + '\\';
        
        var data = System.Clipboard.GetData( 'FileSystem' );
        if ( !data ) return;
        var files = data.Files;
        var dirs = data.Directories;
        
        var src;
        var isFolder;
        
        if ( files.length )
        {
            src = files[ 0 ];
            isFolder = false;
        }
        else if ( dirs.length )
        {
            src = dirs[ 0 ];
            isFolder = true;
        }
        else return;
        
        My.FileSystem.CreateLinkFile( src, path + My.Path.GetFileName( src ), isFolder, handle );
        
        function handle()
        {
            refresh();
        }
    }
    
    function download()
    {
        var path = iC.CurrentItem.Path;
        var url = My.Path.GetDownloadURL( path );
        window.location.href = url;
    }
    
    //菜单条件
    
    function isPastable( onFolder )
    {
        var bool = !!System.Clipboard.GetData( 'FileSystem' );
        if ( onFolder )
        {
            if ( bool && iC.CurrentItem.IsFolder ) return true;
            return;
        }
        return bool;
    }
    
    function isLinkable()
    {
        var data = System.Clipboard.GetData( 'FileSystem' );
        if ( data )
        {
            var files = data.Files;
            var dirs = data.Directories;
            
            if ( files.length + dirs.length == 1 ) return true;
        }
        return false;
    }
    
    function isUploadable()
    {
        if ( iC.CurrentItem.IsFolder ) return true;
    }
    
    function isDownloadable()
    {
        if ( !iC.CurrentItem.IsFolder ) return true;
    }
}