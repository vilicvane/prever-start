/*
    Prever Intro
    版本 1.0.0
    作者 Vilic Vane
    ©2009 ViCRiLoR v.O Studio
*/

function $I()
{
    var _this = this;
    this.Start = function()
    {
        var option = new System.Window.Option();
        option.Width = 300;
        option.Height = 180;
        option.Order = System.Window.Order.AbsoluteTop;
        option.CreateTaskCard = false;
        
        var main = new System.Window.Elementary( _this, option );
        var body = main.Body;
        
        var img = new Image();
        img.src = My.Path.GetURL( _this.Path + '\\Intro.jpg' );
        if ( img.complete ) done();
        else img.onload = done;
        
        var interval;
        var opacity = 0;
        My.Element.SetOpacity( body, 0 );
        
        main.Initialize();
        
        function done()
        {
            body.style.backgroundImage = 'url(' + img.src + ')';
            interval = setInterval( change, 50 );
        }
        
        function change()
        {
            opacity += 5;
            var op = checkOpacity( opacity );
            My.Element.SetOpacity( body, op );
            if ( op == 0 )
            {
                clearInterval( interval );
                _this.Dispose();
            }
        }
        
        function checkOpacity( o )
        {
            if ( o > 100 )
            {
                if ( o > 120 ) o = 220 - o;
                else o = 100;
            }
            
            return o;
        }
    };
    
}
