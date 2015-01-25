function $S( annex )
{
    var _this = this;
    
    var main, body;
    var config, cValue;
    
    var fS;
    var viewBox;
    
    this.Start = function()
    {
        config = new My.Config( My.Path.GetDirectoryName( _this.Path ) + 'Config.pcd' );
        config.Read( readConfig );
    };
    
    function readConfig()
    {
        cValue = config.Value;
        
        //创建窗口选项
        var option = new System.Window.Option();
        option.Title = '我的桌面设置';
        option.IconPath = '..\\Icons\\16.png';
        
        option.Width = 250;
        option.Height = 215;
        
        //创建窗口
        
        main = new System.Window.Popup( _this, option );
        
        body = main.Body;
        main.AddCSS( 'Main.css', init );
    }
    
    function init()
    {
        body.innerHTML =
        '<div class="Main">' +
            '<div class="ViewBox"></div>' +
            '<div class="BtBox">' +
                '<button>选择图像</button><br />' +
                '<button>默认</button>' +
                '<button>保存</button>' +
                '<button>取消</button>' +
            '</div>' +
        '</div>';
        
        var mainChs = body.childNodes[ 0 ].childNodes;
        
        viewBox = mainChs[ 0 ];
        
        change( cValue.Background );
        
        var bts = mainChs[ 1 ].childNodes;
        
        bts[ 0 ].onclick = openFile;
        bts[ 2 ].onclick = function(){ change( My.Path.GetDirectoryName( _this.Path ) + 'Default.jpg' ); };
        bts[ 3 ].onclick = save;
        bts[ 4 ].onclick = _this.Dispose;
        
        main.Initialize();
    }
    
    function openFile()
    {
        if ( !fS )
        {
            var fOp =
            {
                HostWindow: main,
                Handle: handle,
                MultiSelect: false,
                FileExtensions: { Text: '图象文件', Exts: 'jpg,jpeg,gif,bmp,png' }
            };
            
            _this.AddControl( 'Prever.FileSelector', createControl, fOp );
            
        }
        else fS.Open();
        
        function handle( bool, files )
        {
            if ( bool ) change( files[ 0 ] );
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
    
    function change( path )
    {
        cValue.Background = path;
        viewBox.style.backgroundImage = 'url(' + My.Path.GetThumbnailURL( path, 200, 150 ) + ')';
    }
    
    function save()
    {
        config.Save( handle );
        
        function handle( done )
        {
            if ( done )
            {
                changeBg();
                main.Message( '设置保存成功!', _this.Dispose );
            }
            else main.Message( { Text: '保存过程中出现异常,操作失败.', Type: 'Error' }, _this.Dispose );
        }
        
        function changeBg()
        {
            var path = My.Path.GetDirectoryName( _this.Path );
            path = path.Left( path.length - 1 ).toLowerCase();
            
            var running = System.Program.Running;
            
            for ( var i = 0; i < running.length; i++ )
            {
                var one = running[ i ];
                var p = one.Path.toLowerCase();
                if ( p == path )
                {
                    one.SetBackground( cValue.Background );
                    break;
                }
            }
        }
    }
}