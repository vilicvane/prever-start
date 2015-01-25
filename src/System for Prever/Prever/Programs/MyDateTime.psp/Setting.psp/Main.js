function $S( annex )
{
    /*
        annex
        
        Handle( config.Value )
    */
    var _this = this;
    
    var main, body;
    var config, cValue;
    
    var xText, yText;
    var squares;
    var lastSquare;
    
    var posMode =
    [
        { X: 0, Y: 0 }, { X: 1, Y: 0 }, { X: 2, Y: 0 },
        { X: 0, Y: 1 }, { X: 1, Y: 1 }, { X: 2, Y: 1 },
        { X: 0, Y: 2 }, { X: 1, Y: 2 }, { X: 2, Y: 2 }
    ];
    
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
        option.Title = '我的时间设置';
        option.IconPath = '..\\Icons\\16.png';
        
        option.Width = 280;
        option.Height = 125;
        
        //创建窗口
        
        main = new System.Window.Popup( _this, option );
        
        body = main.Body;
        main.AddCSS( 'Main.css', init );
    }
    
    function init()
    {
        body.innerHTML =
        '<div class="Main">' +
            '<div class="SquareHolder">' +
                '<span>位置:</span>' +
                '<div class="PosSquare">' +
                    '<div>左上</div><div>上</div><div>右上</div>' +
                    '<div>左</div><div>中</div><div>右</div>' +
                    '<div>左下</div><div>下</div><div>右下</div>' +
                '</div>' +
            '</div>' +
            '<div class="XYHolder">' +
                '<span>偏移:</span>' +
                '<div class="PosXY">' +
                    '<div><span>X: </span><input type="text" /><span> 像素</span></div>' +
                    '<div><span>Y: </span><input type="text" /><span> 像素</span></div>' +
                '</div>' +
            '</div>' +
            '<div class="BtBox">' +
                '<button>保存</button>' +
                '<button>取消</button>' +
            '</div>' +
        '</div>';
        
        var mainChs = body.childNodes[ 0 ].childNodes;
        
        
        squares = mainChs[ 0 ].childNodes[ 1 ].childNodes;
        
        var pXYChs = mainChs[ 1 ].childNodes[ 1 ].childNodes;
        xText = pXYChs[ 0 ].childNodes[ 1 ];
        yText = pXYChs[ 1 ].childNodes[ 1 ];
        
        xText.value = cValue.Position.X;
        yText.value = cValue.Position.Y;
        
        squares[ lastSquare ].className = 'Current';
        
        var bts = mainChs[ 2 ].childNodes;
        bts[ 0 ].onclick = save;
        bts[ 1 ].onclick = _this.Dispose;
        
        for ( var i = 0; i < 9; i++ )
        {
            (function()
            {
                var idx = i;
                var x = i % 3;
                var y = Math.floor( i / 3 );
                
                squares[ i ].onclick = function()
                {
                    cValue.PositionMode = { X: x, Y: y };
                    squares[ lastSquare ].className = '';
                    squares[ idx ].className = 'Current';
                    lastSquare = idx;
                };
            })();
        }
        main.Initialize();
    }
    
    function checkConfig()
    {
        var win = System.Window;
        
        if ( cValue.PositionMode == null )
            var pM = cValue.PositionMode = win.PositionMode.Right;
        if ( cValue.Position == null )
            cValue.Position = { X: -20, Y: 0 };
            
        var pM = cValue.PositionMode;
        lastSquare = pM.Y * 3 + pM.X;
    }
    
    function save()
    {
        var x = xText.value;
        var y = yText.value;
        
        var re = /^-?[0-9]+$/;
        
        if ( !( re.test( x ) && re.test( y ) ) )
        {
            main.Message( '请输入有效的整数!' );
            return;
        }
        
        cValue.Position.X = Number( xText.value );
        cValue.Position.Y = Number( yText.value );
        
        config.Save( finish );
        
        function finish()
        {
            if ( annex.Handle )
            {
                annex.Handle( cValue );
                _this.Dispose();
            }
            else main.Message( '设置保存成功,程序将在下次启动时应用此设置.', _this.Dispose );
        }
    }
}