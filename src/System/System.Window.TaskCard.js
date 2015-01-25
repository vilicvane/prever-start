/*(C)2007-2009 ViCRiLoR v.O Studio*/

System.Window.TaskCard = function( host )
{
    var _this = this;
    var ele = System.Element;
    var win = System.Window;
    
    var div = document.createElement( 'DIV' );
    div.innerHTML = '<img /><span></span>';
    div.className = 'Normal';
    
    this.Element = div;
    
    var tB, iB;
    var tt;
    var tCs = System.Window.TaskCard.List;
    
    var fT = My.Element.FillText;
    
    
    var cM = My.Control.ContextMenu;
    
    var menu = new cM( null, null, true );
    var items = new cM.CreateItems( [ '关闭窗口' ], [ true ], [ host.Dispose ] );
    menu.AddItems( items );
    
    this.IconBox = iB = div.childNodes[ 0 ];
    this.TitleBox = tB = div.childNodes[ 1 ];
    this.Host = host;
    
    this._SetTitle = function( title )
    {
        tt = div.title = title;
        _this._FillTitle();
    };
    
    this._FillTitle = function()
    {
        if ( tt ) fT( tB, tt );
    };
    
    this.Dispose = function()
    {
        div.parentNode.removeChild( div );
        tCs.RemoveByValue( _this );
        win.TaskCard.CheckWidth();
    };
    
    this._SetCurrent = function( bool )
    {
        div.className = bool ? 'Current' : 'Normal';
    };
    
    div.onclick = function()
    {
        if ( host.IsCurrent ) host.Minimize();
        else win.ChangeCurrent( host );
    };
    
    div.oncontextmenu = function( ev )
    {
        menu.Open( ev || event );
    };
    
    ele.TaskBox.appendChild( div );
    
    tCs.push( this );
    
    win.TaskCard.CheckWidth();
}

System.Window.TaskCard.List = [];

System.Window.TaskCard.CheckWidth = function()
{
    var ele = System.Element;
    var win = System.Window;
    var sE = Skin.Element.TaskCard;
    
    var tB = ele.TaskBox;
    
    var bW = tB.offsetWidth;
    
    var maxWidth = sE.MaxWidth;
    
    var cards = tB.childNodes;
    var amt = cards.length;
    
    var dW;
    var eW = sE.ExtraWidth;
    var extra = 0;
    
    if ( ( maxWidth + eW ) * amt < bW ) dW = maxWidth;
    else
    {
        extra = bW % amt;
        dW = Math.floor( bW / amt ) - eW;
        if ( dW < 0 ) dW = 0;
    }
    
    var sW = dW + sE.TitleTextAvailableWidth;
    if ( sW < 0 ) sW = 0;
    
    for ( var i = extra; i < amt; i++ )
    {
        cards[ i ].style.width = dW + 'px';
        cards[ i ].childNodes[ 1 ].style.width = sW + 'px';
    }
    
    dW += 1;
    sW += 1;
    
    for ( var i = 0; i < extra; i++ )
    {
        cards[ i ].style.width = dW + 'px';
        cards[ i ].childNodes[ 1 ].style.width = sW + 'px';
    }
    
    var tCs = System.Window.TaskCard.List;
    
    for ( var i = 0; i < tCs.length; i++ )
        tCs[ i ]._FillTitle();
}