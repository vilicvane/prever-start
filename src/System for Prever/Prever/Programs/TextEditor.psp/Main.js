/*
    Prever Text Editor
    版本 1.0.0
    作者 Vilic Vane
    ©2009-2010 Micriod Studio
*/

function $T( annex )
{
    var _this = this;
    
    var main, body;
    
    var filePath = annex.AimFile;
    var tFile;
    var status = true;
    
    var fS;
    
    var text, bt_save, bt_create, bts;
    
    var editor = new function()
    {
        var textFile = null;
        
        this.Open = function( path )
        {
            tFile = new My.TextFile( path );
            tFile.Read( handle );
            
            function handle( done, error )
            {
                if ( done )
                {
                    text.value = tFile.Text;
                    main.SetTitle( tFile.FileName );
                }
                else if ( error == 'FileNotFound' )
                    main.Message( { Text: '目标文件不存在!', Type: 'Error' } );
            }
        };
        
        this.Save = function()
        {
            tFile.Text = text.value;
            
            //if ( !tFile.Path ) saveTo( pathSet );
            //else pathSet( true );
            
            //function pathSet( done )
            //{
            //    if ( !done ) return;
            //    status = false;
                tFile.Save( saved );
                
                bt_save.innerHTML = '保存中...';
                setButtons( false );
                
                function saved( done )
                {
                    if ( done ) main.SetTitle( tFile.FileName );
                    else main.Message( { Text: '保存过程中出现了错误!', Type: 'Error' } );
            //        status = true;
                    bt_save.innerHTML = '保存';
                    setButtons( true );
                }
            //}
        };
        
        /*
        this.Create = function()
        {
            if ( !status ) return;
            if ( tFile.Text != text.value )
                main.Message( { Text: '文件尚未保存,确定要继续吗?', Type: 'Confirm', Yes: '继续' }, confirmed )
            else confirmed();
            
            function confirmed()
            {
                main.SetTitle( '新建文本文档' );
                text.value = '';
                tFile = { Text: null };
            }
        };
        
        function saveTo( handle )
        {
            if ( !fS )
            {
                var fOp =
                {
                    HostWindow: main,
                    Handle: sHandle,
                    MultiSelect: false,
                    FileExtensions: { Text: '文本文件', Exts: 'txt,text' },
                    SaveMode: true
                };
                
                _this.AddControl( 'Prever.FileSelector', createControl, fOp );
                
            }
            else fS.Open();
            
            function sHandle( bool, files )
            {
                if ( bool )
                {
                    My.File.E
                    var temp = tFile.Text;
                    tFile = new My.TextFile( files[ 0 ] );
                    tFile.Text = temp;
                }
                
                checkExist( exist )
                {
                    
                }
                
                handle( bool );
            }
            
            function createControl( done, control )
            {
                if ( done )
                {
                    fS = control;
                    fS.Open();
                }
            }
        }
        */
    }();
    
    this.Start = function()
    {
        config = new My.Config( My.Path.GetDirectoryName( _this.Path ) + 'Config.pcd' );
        config.Read( readConfig );
    };
    
    function readConfig()
    {
        cValue = config.Value;
        
        checkConfig();
        
        //创建窗口选项
        var option = new System.Window.Option();
        option.Title = '文本编辑器';
        option.IconPath = 'Icons\\16.png';
        
        option.Width = 500;
        option.Height = 300;
        
        //创建窗口
        
        main = new System.Window.Normal( _this, option );
        main.Resizer.MinWidth = 200;
        main.Resizer.MinHeight = 100;
        
        body = main.Body;
        main.AddCSS( 'Main.css', init );
    }
    
    function init()
    {
        body.innerHTML =
        '<div class="MenuBar Window_Background_Normal">' +
            '<button>保存</button>' +
        //    '<button>新建</button>' +
        '</div>' +
        '<textarea></textarea>';
        bts = body.childNodes[ 0 ].childNodes;
        
        bt_save = bts[ 0 ];
        //bt_create = bts[ 1 ];
        bts[ 0 ].onclick = editor.Save;
        //bts[ 1 ].onclick = editor.Create;
        
        text = body.childNodes[ 1 ];
        text.onresize = function(){ return false; };
        
        main.Initialize();
        
        setSize();
        main.OnResize = setSize;
        if ( filePath ) editor.Open( filePath );
        //else editor.Create();
        else _this.Dispose();
    }
    
    function checkConfig()
    {
        
    }
    
    
    function setSize()
    {
        text.style.width = body.clientWidth - 10 + 'px';
        text.style.height = body.clientHeight - 40 + 'px';
    }
    
    function setButtons( bool )
    {
        for ( var i = 0; i < bts.length; i++ )
            bts[ i ].disabled = !bool;
    }
}