/*
    File Manager
    版本 1.0.0
    作者 Vilic Vane
    ©2009 ViCRiLoR v.O Studio
*/

function $F( annex )
{
    var _this = this;
    var main, frame, body;
    
    var myConfig;
    var config = {};
    
    var f;
    
    var mainHTML = 
        '<div class="Operation">' +
            '<div class="ButtonBox">' +
                '<div class="Back Enabled" title="后退"></div>' +
                '<div class="Forward Enabled" title="前进"></div>' +
                '<div class="Up Enabled" title="向上"></div>' +
            '</div>' +
            '<div class="AddressBox">' +
                '<div class="AddrLeft"></div>' +
                '<div class="AddrHolder">' +
                    '<input class="Address" />' +
                '</div>' +
                '<div class="Go"></div>' +
            '</div>' +
        '</div>' +
        '<div class="Navigation">' +
            '<div class="Nvg" style="float: right;">设置</div>' +
            '<div class="NvgSp" style="float: right;"></div>' +
        '</div>';
    
    var opBox, btBox;
    var nvgBox;
    var adHolder, address;
    var bt_back, bt_forward, bt_up, bt_go;
    var configBt;
    
    var nvgs = [];
    var currentNvg = null;
    
    var mWOp = new System.Window.Option(); //主窗口 窗口选项
   
    mWOp.Title = '文件管理器';
    mWOp.IconPath = 'Icons\\16.png';
    mWOp.Width = 600;
    mWOp.Height = 450;
    
    var cWOp; //配置窗口 窗口选项
    
    this.Start = function()
    {
        main = new System.Window.Normal( _this, mWOp );
        main.Resizer.MinHeight = 100;
        main.Resizer.MinWidth = 250;
        
        frame = main.Frame;
        body = main.Body;
        
        body.innerHTML = mainHTML;
        
        opBox = body.childNodes[ 0 ];
        nvgBox = body.childNodes[ 1 ];
        
        btBox = opBox.childNodes[ 0 ];
        adBox = opBox.childNodes[ 1 ];
        
        var btChildren = btBox.childNodes;
        var adChildren = adBox.childNodes;
        
        bt_back = btChildren[ 0 ];
        bt_forward = btChildren[ 1 ];
        bt_up = btChildren[ 2 ];
        
        adHolder = adChildren[ 1 ];
        address = adHolder.childNodes[ 0 ];
        bt_go = adChildren[ 2 ];
        
        configBt = nvgBox.childNodes[ 0 ];
        
        configBt.onclick = editConfig;
        
        new nvgItem( '桌面', My.Path.GetDesktopPath(), '' );
        new nvgItem( 'System:\\', 'System:\\', 'System:\\' );
        new nvgItem( 'Disk:\\', 'Disk:\\', 'Disk:\\' );
        
        main.AddCSS( 'Main.css', getConfig );
        
    };
    
    function getConfig()
    {
        myConfig = new My.Config( _this.Path + '\\Config.pcd' );
        myConfig.Read( cHandle );
        
        function cHandle( done, status )
        {
            if ( done )
            {
                var value = myConfig.Value;
                config.DefaultPath = value.DefaultPath;
                config.DefaultViewMode = value.DefaultViewMode;
                config.ShowHidden = value.ShowHidden;
            }
            else
            {
                config.DefaultPath = 'Disk:\\';
                config.DefaultViewMode = 'Normal';
                config.ShowHidden = false;
                
                if ( status == 400 )
                {
                    myConfig.Value = config;
                    myConfig.Save();
                }
            }
            
            init();
        }
    }
    
    function init()
    {
        var fOption =
        {
            AimDirectory: annex.AimDirectory || config.DefaultPath,
            ViewMode: config.DefaultViewMode,
            ShowHidden: config.ShowHidden,
            HostWindow: main
        };
        
        _this.AddControl( 'Prever.FileManager', createControl, fOption );
        
        function createControl( done, control )
        {
            if ( done )
            {
                f = control;
                
                bt_back.onclick = f.Back;
                bt_forward.onclick = f.Forward;
                bt_up.onclick = f.Up;
                bt_go.onclick = turnTo;
                address.onkeypress = goPress;
                
                onCPCh( f.CurrentPath );
                onBCh( f.Backable );
                onFCh( f.Forwardable );
                onUCh( f.Uppable );
                
                f.OnCurrentPathChange = onCPCh;
                
                f.OnBackableChange = onBCh;
                f.OnForwardableChange = onFCh;
                f.OnUppableChange = onUCh;
                
                main.OnFocusOut = f.FocusOut;
                
                body.appendChild( f.Element );
                
                main.Initialize();
                main.OnResize = setSize;
                setSize();
    
            }
        }
    }
    
    function setSize()
    {
        var w = body.clientWidth;
        f.SetSize( w, body.clientHeight - 65 );
        
        adHolder.style.width = w - 180 + 'px';
        address.style.width = w - 182 + 'px';
        
    }
    
    function editConfig()
    {
        System.Program.Launch( _this.Path + '\\Setting.psp', null, { HostWindow: main, FileManager: f } );
    }
    
    //状态变化
    function onCPCh( path )
    {
        address.value = path;
        var sWith = My.Path.GetRoot( path ).toLowerCase();
        var then = nvgs[ sWith ];
        
        if ( then != null && then != currentNvg)
        {
            if ( currentNvg ) currentNvg.SetCurrent( false );
            then.SetCurrent( true );
            currentNvg = then;
        }
    }
    
    function onBCh( bool )
    {
        bt_back.className = bool ? 'Back Enabled' : 'Back Disabled';
    }
    
    function onFCh( bool )
    {
        bt_forward.className = bool ? 'Forward Enabled' : 'Forward Disabled';
    }
    
    function onUCh( bool )
    {
        bt_up.className = bool ? 'Up Enabled' : 'Up Disabled';
    }
    
    /*************************************************************/
    
    function turnTo()
    {
        f.SetPath( address.value );
    }
    
    function goPress( ev )
    {
        var e = ev || event;
        if ( e.keyCode == 13 ) turnTo();
    }
    
    function nvgItem( text, linkTo, sWith, right )
    {
        var bt = document.createElement( 'DIV' );
        bt.className = 'Nvg';
        var sp = document.createElement( 'DIV' );
        sp.className = 'NvgSp';
        
        nvgBox.appendChild( bt );
        nvgBox.appendChild( sp );
        
        bt.innerHTML = text;
        bt.onclick = lTo;
        
        nvgs[ sWith.toLowerCase() ] = this;
        
        this.SetCurrent = function( bool )
        {
            bt.className = bool ? 'NvgCurrent' : 'Nvg';
        }
        
        function lTo()
        {
            f.SetPath( linkTo );
        }
    }
};
