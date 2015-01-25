/*
    Start Menu
    版本 1.0.0
    作者 Evix Vilic
    ©2009 ViCRiLoR v.O Studio
*/

function $S( annex )
{
    var _this = this;
    var main, frame, body;
    
    this.Start = function()
    {
        var sWin = System.Window;
        var option = new sWin.Option();
        option.PositionMode = sWin.PositionMode.LeftBottom;
        option.Order = sWin.Order.AlwaysTop;
        option.Width = 200;
        option.Height = 70;
        option.CreateTaskCard = false;
        
        main = new sWin.Elementary( _this, option );
        
        frame = main.Frame;
        body = main.Body;
        body.className = 'PreverMenu';
        
        body.innerHTML =
        '<div class="Main">' +
            '<div class="Title"></div>' +
            '<div class="Items">' +
                '<div class="Item">' +
                    '<div><div class="LoginOutIcon"></div>注销Prever(Start)</div>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        body.childNodes[ 0 ].childNodes[ 1 ].childNodes[ 0 ].onclick = System.Dispose;
        
        main.OnFocusOut = _this.Close;
        
        main.Initialize();
    };
    
    this.Open = function()
    {
        _this.Opened = true;
        main.ChangeToCurrent();
    };
    
    this.Close = function()
    {
        _this.Opened = false;
        main.Minimize();
    };
    
    this.Opened = true;
};
