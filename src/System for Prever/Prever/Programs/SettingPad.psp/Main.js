/*
    Prever Setting Pad
    版本 1.0.0
    作者 Vilic Vane
    ©2009 ViCRiLoR v.O Studio
*/

function $D()
{
    var _this = this;
    
    var f;
    
    this.Start = function()
    {
        //创建窗口选项
        var option = new System.Window.Option();
        option.Title = 'Prever设置面板';
        option.IconPath = 'Icons\\16.png';
        
        option.Width = 500;
        option.Height = 250;
        
        main = new System.Window.Normal( _this, option );
        
        main.Resizer.MinWidth = 200;
        main.Resizer.MinHeight = 100;
        
        body = main.Body;
        
        init();
    };
    
    function init()
    {
        var fOption =
        {
            AimDirectory: 'System:\\Prever\\Registration\\System\\Settings\\',
            ShowHidden: false,
            HostWindow: main
        };
        
        _this.AddControl( 'Prever.FileManager', createControl, fOption );
        
        function createControl( done, control )
        {
            if ( done )
            {
                f = control;
                
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
        f.SetSize( body.clientWidth, body.clientHeight );
    }
}