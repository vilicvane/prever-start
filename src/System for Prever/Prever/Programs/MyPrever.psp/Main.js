/*
    Prever My Prever
    版本 1.0.0
    作者 Vilic Vane
    ©2009 ViCRiLoR v.O Studio
*/

function $M()
{
    var _this = this;
    
    var desktopDir = My.Path.GetDesktopPath();
    
    var main, body, frame;
    var bgImg, bg, bgURL;
    
    var f;
    
    var config, cValue;
    
    this.Start = function()
    {
        var ones = My.Program.GetRunningByPath( _this.Path );
        
        if ( ones.length > 1 )
        {
            _this.Dispose();
            return;
        }
        //创建窗口选项
        var option = new System.Window.Option();
        option.Title = 'My Prever';
        option.IconPath = 'Icons\\16.png';
        option.CreateTaskCard = false;
        option.Order = System.Window.Order.Desktop;
        option.SizeMode = System.Window.SizeMode.Maximized;
        
        //创建窗口
        
        main = new System.Window.Elementary( _this, option );
        
        body = main.Body;
        frame = main.Frame;
        
        config = new My.Config( _this.Path + '\\Config.pcd' );
        config.Read( readConfig );
        
    };
    
    this.SetBackground = setBg;
    
    function readConfig()
    {
        cValue = config.Value;
        checkConfig();
        
        bg = document.createElement( 'IMG' );
        bg.className = 'Background';
        body.appendChild( bg );
        
        //干掉IE的一个疑似BUG.图片抢鼠标.
        body.appendChild( My.Element.CreateByHTML( '<div style="position: absolute; height: 100%; width: 100%; background-color: #FFFFFF; filter: alpha(opacity=0); opacity: 0;"></div>' ) )
        
        setBg( cValue.Background );

        main.AddCSS( 'Main.css', init );
        
        function checkConfig()
        {
            var changed = false;
            if ( !cValue.Background )
            {
                cValue.Background = _this.Path + '\\Default.jpg';
                changed = true;
            }
            if ( changed ) config.Save();
        }
    }
    
    function init()
    {
        main.Initialize();
        main.OnResize = setSize;
        
        var annex =
        {
            AimDirectory: desktopDir,
            XFirst: false,
            AutoAdjust: true,
            OpenFolderBySelf: false,
            HostWindow: main
        };
        
        _this.AddControl( 'Prever.FileManager', createControl, annex );
    
        function createControl( done, control )
        {
            if ( done )
            {
                f = control;
                
                main.OnFocusOut = f.FocusOut;
                
                body.appendChild( f.Element );
                
                setSize();
            }
        }
    }
    
    function setBg( path )
    {
        bgURL = My.Path.GetURL( path );
        bgImg = new Image();
        bgImg.src = bgURL;
        if ( bgImg.complete ) loadBg();
        else bgImg.onload = loadBg;
    }

    function loadBg()
    {
        setSize();
        bg.src = bgURL;
        bg.style.display = 'block';
    }
    
    function setSize()
    {
        var w = bgImg.width;
        var h = bgImg.height;
        
        var bW = body.clientWidth;
        var bH = body.clientHeight;
        
        //更改文件浏览控件的大小
        if ( f ) f.SetSize( bW, bH );
        
        //更改背景图片的大小
        var time = w / h;
        
        var iW, iH; //图像的宽高
        var left, top;
        
        if ( time > bW / bH )
        {
            iH = bH;
            iW = time * bH;
            
            top = 0;
            left = ( bW - iW ) / 2;
        }
        else
        {
            iW = bW;
            iH = bW / time;
            
            top = ( bH - iH ) / 2;
            left = 0;
        }
        
        bg.width = iW;
        bg.height = iH;
        bg.style.top = top + 'px';
        bg.style.left = left + 'px';
    }
}