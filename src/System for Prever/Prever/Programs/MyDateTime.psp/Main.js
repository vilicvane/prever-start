/*
    Prever My DateTime
    版本 1.0.0
    作者 Vilic Vane
    ©2009 ViCRiLoR v.O Studio
*/

function $D()
{
    var _this = this;
    
    var main, body, frame;
    var config, cValue;
    
    var dAmts = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    
    var lastDay;
    
    var mBox, yBox, tBox, box;
    
    this.Start = function()
    {
        var ones = My.Program.GetRunningByPath( _this.Path );
        
        if ( ones.length > 1 )
        {
            _this.Dispose();
            return;
        }
        
        config = new My.Config( _this.Path + '\\Config.pcd' );
        config.Read( readConfig );
    };
    
    function readConfig()
    {
        cValue = config.Value;
        
        //创建窗口选项
        var option = new System.Window.Option();
        option.Title = 'My DateTime';
        option.CreateTaskCard = false;
        option.Order = System.Window.Order.AlwaysBottom;
        
        option.Width = 200;
        option.Height = 250;
        
        checkConfig(); //检查配置的值
        
        option.PositionMode = cValue.PositionMode;
        option.Position = cValue.Position;
        
        //创建窗口
        
        main = new System.Window.Elementary( _this, option );
        
        body = main.Body;
        frame = main.Frame;
        
        main.AddCSS( 'Main.css', init );
        
        function checkConfig()
        {
            var win = System.Window;
            var changed = false;
            if ( cValue.PositionMode == null )
            {
                cValue.PositionMode = win.PositionMode.Right;
                changed = true;
            }
            if ( cValue.Position == null )
            {
                cValue.Position = { X: -20, Y: 0 };
                changed = true;
            }
            
            if ( changed ) config.Save();
        }
    }
    
    function init()
    {
        var mover = new My.Element.Mover( frame );
        mover.AddHandle( frame );
        
        main.Initialize();
        
        body.innerHTML =
        '<div class="MYBox"><span class="Month"></span><span class="Year"></span><span class="Time"></span></div>' +
        '<div class="DayLabel"><div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div></div>' +
        '<div class="DateBox"></div>';
        
        var tempChs = body.childNodes[ 0 ].childNodes;
        mBox = tempChs[ 0 ];
        yBox = tempChs[ 1 ];
        tBox = tempChs[ 2 ];
        
        box = body.childNodes[ 2 ];
        
        //创建日期表格
        for ( var i = 0; i < 42; i++ )
            box.appendChild( document.createElement( 'DIV' ) );
        
        //创建菜单
        var cM = My.Control.ContextMenu;
        var menu = new cM();
        var items = new cM.CreateItems( [ '设置', '关闭' ], [ true, true ], [ openSetting, _this.Dispose ] );
        menu.AddItems( items );
        
        body.oncontextmenu = function( ev )
        {
            menu.Open( ev || event );
        };
        
        body.onclick = main.OnFocusOut = menu.Close;
        
        resetTime();
        setInterval( resetTime, 1000 );
    }
    
    function resetTime()
    {
        var myDate = new Date();
        
        var timeStr = myDate.toTimeString();
        
        tBox.innerHTML = timeStr.Left( timeStr.indexOf( ' ' ) );
        
        var nowDay = myDate.toDateString();
        if ( nowDay != lastDay )
        {
            lastDay = nowDay;
            resetDate( myDate );
        }
    }
    
    function resetDate( myDate )
    {
        var year = myDate.getFullYear();
        var month = myDate.getMonth();
        var day = myDate.getDay();
        var date = myDate.getDate();
        
        var isLeap = ( year % 400 == 0 || ( year % 100 != 0 && year % 4 == 0 ) );
        
        var dAmt = dAmts[ month++ ];
        if ( month == 2 && isLeap ) dAmt++;
        
        var nDay = day + 1;
        
        mBox.innerHTML = month;
        yBox.innerHTML = '.' + year;
        
        var sDay = ( day - date + 36 ) % 7 - 1;
        
        var children = box.childNodes;
        
        for ( var i = 0; i < 42; i++ )
        {
            var child = children[ i ];
            child.innerHTML = '';
            child.className = '';
        }
        
        for ( var i = 1; i <= dAmt; i++ )
        {
            var child = children[ i + sDay ];
            child.innerHTML = i;
            if ( i == date ) child.className = 'Today';
        }
    }
    
    function openSetting()
    {
        var path = _this.Path + '\\Setting.psp';
        System.Program.Launch( path, null, { Handle: change } );
        
        function change( newCValue )
        {
            cValue = config.Value = newCValue;
            main.PositionMode = cValue.PositionMode;
            main.Position = cValue.Position;
            main.ResetPosition();
        }
    }
}