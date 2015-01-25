/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.Element = {};

My.Element.LoadScript = function( paths, handle, processHandle, classLabel, className )
{
    if ( typeof paths != typeof [] ) paths = [ paths ];
    var scriptIndex = 0;
    var scriptAmount = paths.length;
    var scripts = [];
    
    var classExt;
    if ( className ) classExt = '&class=' + className;
    else classExt = '';
    
    loadOne();
    
    function loadNext( done, text )
    {
        if ( done )
        {
            scripts.push( text );
            if ( processHandle ) processHandle( scriptIndex, scriptAmount );
            loadOne();
        }
        else
        {
            handle( false );
            return;
        }
    }
    
    function loadOne()
    {
        if (  scriptIndex == scriptAmount )
        {
            My.Element.CreateScript( scripts, classLabel, className );
            handle( true, className );
            return;
        }
        var url = My.Path.GetURL( paths[ scriptIndex++ ] ) + classExt;
        My.XMLHttp.Get( url, loadNext );
    }
};

My.Element.CreateScript = function( scripts, classLabel, className )
{
    if ( typeof scripts != typeof [] ) scripts = [ scripts ];
    
    if ( classLabel != null && className != null )
    {
        for ( var i = 0; i < scripts.length; i++ )
            scripts[ i ] = scripts[ i ].Replace( classLabel, className, 'g' );
    }
    
    for ( var i = 0; i < scripts.length; i++ )
    {
        var scriptBox = document.createElement( 'SCRIPT' );
        scriptBox.type = 'text/javascript';
        scriptBox.defer = true;
        scriptBox.text = scripts[ i ];
        System.Element.ScriptArea.appendChild( scriptBox );
    }
};

My.Element.LoadedCSS = [];

My.Element.LoadCSS = function( paths, loadImage, handle, processHandle, classLabel, className )
{
    if ( typeof paths != typeof [] ) paths = [ paths ];
    
    for ( var i = 0; i < paths.length; i++ )
        paths[ i ] = paths[ i ].toLowerCase();
    
    loadImage = loadImage || false;
    var cssIndex = 0;
    var cssAmount = paths.length;
    var csss = [];
    
    var loaded = My.Element.LoadedCSS[ className ] = [];
    
    var classExt;
    if ( className ) classExt = '&class=' + className;
    else classExt = '';
    
    loadOne();
    
    function loadNext( done, text )
    {
        if ( done )
        {
            csss.push( text );
            loaded[ paths[ cssIndex++ ] ] = true;
            
            if ( processHandle ) processHandle( cssIndex, cssAmount );
            
            loadOne();
        }
        else
        {
            handle( false );
            return;
        }
    }
    
    function loadOne()
    {
        var path;
        
        while ( true )
        {
            if ( cssIndex == cssAmount )
            {
                finishLoad();
                return;
            }
            
            path = paths[ cssIndex ];
            
            //alert( loaded[ path ] );
            
            if ( !loaded[ path ] || clearBuffer ) break;
            else cssIndex++;
        }
        
        My.XMLHttp.Get( My.Path.GetURL( path ) + classExt, loadNext );
    }
    
    function finishLoad()
    {
        if ( loadImage && handle )
        {
            var images = [];
            for ( var i = 0; i < csss.length; i++ )
            {
                var re = /\[p:(.+?)\]/gi;
                var cssDirectory = My.Path.GetDirectoryName( paths[ i ] );
                csss[ i ] = csss[ i ].replace( re, function( a, b ){ var u = My.Path.GetURL( cssDirectory + b, 'image' ); images.push( u ); return u; } );
            }
            My.Element.LoadImage( images, doLoad, processHandle );
        }
        else
        {
            for ( var i = 0; i < csss.length; i++ )
            {
                var re = /\[p:(.+?)\]/gi;
                var cssDirectory = My.Path.GetDirectoryName( paths[ i ] );
                csss[ i ] = csss[ i ].replace( re, function( a, b ){ return My.Path.GetURL( cssDirectory + b, 'image' ); } );
            }
            doLoad();
        }
    }
    
    function doLoad()
    {
        My.Element.CreateCSS( csss, classLabel, className );
        handle( true );
    }
};

My.Element.CreateCSS = function( csss, classLabel, className )
{
    if ( typeof csss != typeof [] ) csss = [ csss ];
    
    if ( classLabel != null && className != null )
    {
        className = '.' + className;
        for ( var i = 0; i < csss.length; i++ )
            csss[ i ] = csss[ i ].Replace( classLabel, className, 'g' );
    }
    
    if ( document.createStyleSheet )
        for ( var i = 0; i < csss.length; i++ )
        {
            var css = document.createStyleSheet();
            css.cssText = csss[ i ];
        }
    else
    {
        for ( var i = 0; i < csss.length; i++ )
        {
            var cssBox = document.createElement( 'STYLE' );
            cssBox.type = 'text/css';
            cssBox.textContent = csss[ i ];
            
            System.Element.CSSArea.appendChild( cssBox );
        }
    }
};

My.Element.LoadImage = function( path, handle, processHandle, timeout )
{
    if ( typeof path != typeof [] ) path = [ path ];
    if ( path.length == 0 )
    {
        if ( handle ) handle( true );
        return;
    }
    
    var finish = System.AddProgress();
    
    timeout = timeout || 5;
    timeout *= 1000;
    var imgIndex = 0;
    var imgAmount = path.length;
    
    var complete = true;
    
    var url = [];
    for ( var i = 0; i < path.length; i++ )
        url.push( My.Path.GetURL( path[ i ], 'image' ) );
    
    var newImg = new Image();
    newImg.src = url[ imgIndex++ ];
    
    var timer = setTimeout( timeoutDo, timeout );
    
    if ( !newImg.complete ) newImg.onload = loadNext;
    else loadNext();

    function loadNext()
    {
        clearTimeout( timer );
        
        if ( processHandle ) processHandle( imgIndex, imgAmount );
        if ( imgIndex == imgAmount )
        {
            finish();
            if ( handle ) handle( complete );
            return;
        }
        newImg = new Image();
        newImg.src = url[ imgIndex++ ];
        
        timer = setTimeout( timeoutDo, timeout );
        
        if ( !newImg.complete ) newImg.onload = loadNext;
        else loadNext();
    }
    
    function timeoutDo()
    {
        complete = false;
        newImg.onload = function(){};
        loadNext();
    }
};

My.Element.CreateDiv = function( style )
{
    var temp = document.createElement( 'div' );
    temp.innerHTML = '<div' + ( style ? ' style="' + style + '"' : '' ) + '></div>';
    return temp.firstChild;
};

My.Element.CreateButton = function( text )
{
    var bt = document.createElement( 'BUTTON' );
    bt.innerHTML = text;
    return bt;
};

My.Element.CreateByHTML = function( html )
{
    var temp = document.createElement( 'div' );
    temp.innerHTML = html;
    var children = temp.childNodes;
    return ( children.length > 1 ) ? children : children[ 0 ];
};

My.Element.SetOpacity = function( obj, value )
{
    if ( typeof obj.style.filter == typeof '' )
    {
        var filter = obj.style.filter;
        var vStr = 'alpha(opacity=' + value + ')';
        
        var re = /alpha\(.*?\)/i;
        if ( re.test( filter ) ) filter = filter.replace( re, vStr );
        else filter += ' ' + vStr;
        
        obj.style.filter = filter;
    }
    else obj.style.opacity = value / 100;
    
};

My.Element.AddEvent = function( obj, eventStr, func )
{
    if ( obj.attachEvent )
        obj.attachEvent( 'on' + eventStr, func );
    else
        obj.addEventListener( eventStr, func, false );
};

My.Element.RemoveEvent = function( obj, eventStr, func )
{
    if ( obj.detachEvent )
        obj.detachEvent( 'on' + eventStr, func );
    else
        obj.removeEventListener( eventStr, func, false );
};

//MoveBar Class 用于实现拖动
My.Element.Mover = function( element )
{
    var _this = this;
    
    var changed;
    
    this.Movable = true;
    
    this.SetLeft = function( dis ){ element.style.left = this.Start.Left + dis + 'px'; };
    this.SetTop = function( dis ){ element.style.top = this.Start.Top + dis + 'px'; };
    
    this.OnMouseDown = function(){};
    this.OnMouseMoveStart = function(){};
    this.OnMouseMove = function(){};
    this.OnMouseUp = function(){};
    
    this.AddHandle = function( handle )
    {
        My.Element.SetSelectable( handle, false );
        
        handle.onmousedown = function( ev )
        {
            mouseDown( ev || event );
        };
    };
    
    function mouseDown( ev )
    {
        if ( !_this.Movable ) return false;
        
        var e = ev || event;
        
        changed = false;
        _this.Start =
        {
            X: e.clientX, 
            Y: e.clientY,
            Left: element.offsetLeft,
            Top: element.offsetTop
        };
        
        My.Element.AddEvent( document, 'mousemove', mouseMove );
        My.Element.AddEvent( document, 'mouseup', mouseUp );
        
        _this.OnMouseDown();
        return false;
    };
    
    function mouseMove( ev )
    {
        var e = ev || event;
        
        var body = document.body;
        
        var x = e.clientX;
        var y = e.clientY;
        
        var bW = body.clientWidth;
        var bH = body.clientHeight - Skin.Element.Taskbar.BarHeight;
        
        if ( x < 0 ) x = 0;
        else if ( x > bW ) x = bW;
        
        if ( y < 0 ) y = 0;
        else if ( y > bH ) y = bH;
        
        _this.Current = { X: x, Y: y };
        
        var disX = _this.Current.X - _this.Start.X;
        var disY = _this.Current.Y - _this.Start.Y;
        
        _this.SetLeft( disX );
        _this.SetTop( disY );
        
        if ( !changed )
        {
            changed = true;
            _this.OnMouseMoveStart();
        }
        _this.OnMouseMove();
    }
    
    function mouseUp()
    {
        My.Element.RemoveEvent( document, 'mousemove', mouseMove );
        My.Element.RemoveEvent( document, 'mouseup', mouseUp );
        
        _this.OnMouseUp( changed );
    }
};


//Resizer Class 用于实现窗口大小调整

My.Element.ResizeType =
{
    LeftOnly: { X: 1, Y: 0, Cursor: 'w-resize' },
    RightOnly: { X: 2, Y: 0, Cursor: 'e-resize' },
    TopOnly: { X: 0, Y: 1, Cursor: 'n-resize' },
    BottomOnly: { X: 0, Y: 2, Cursor: 's-resize' },
    
    LeftAndTop: { X: 1, Y: 1, Cursor: 'nw-resize' },
    RightAndTop: { X: 2, Y: 1, Cursor: 'ne-resize' },
    
    LeftAndBottom: { X: 1, Y: 2, Cursor: 'sw-resize' },
    RightAndBottom: { X: 2, Y: 2, Cursor: 'se-resize' }
};

My.Element.Resizer = function( element )
{
    var _this = this;
    
    var changed;
    
    this.PositionElement = element; //用于定位的元素
    
    this.MaxWidth = Number.MAX_VALUE;
    this.MaxHeight = Number.MAX_VALUE;
    this.MinWidth = 0;
    this.MinHeight = 0;
    
    this.OnMouseDown = function(){};
    this.OnMouseMoveStart = function(){};
    this.OnMouseMove = function(){};
    this.OnMouseUp = function(){};

    this.AddHandle = function( handle, resizeType )
    {
        handle.style.cursor = resizeType.Cursor;
    
        //My.Element.SetSelectable( handle, false );
        
        var eles = My.Element.GetAllChildren( handle );
        eles.push( handle );
        
        var addEvent = My.Element.AddEvent;
        
        for ( var i = 0; i < eles.length; i++ )
        {
            var ele = eles[ i ];
            ele.unselectable = 'on';
            My.Element.AddEvent( ele, 'mousedown', cS );
        }
        
        handle.onmousedown = function( ev )
        {
            mouseDown( ev || event, resizeType.X, resizeType.Y );
            return false;
        };
        
        function cS( ev )
        {
            ( ev || event ).returnValue = false;
        }
        
    };

    this.SetSize = function( width, height )
    {
        if ( width ) element.style.width = width + 'px';
        if ( height ) element.style.height = height + 'px';
    };
    
    this.SetLeft = function( dis )
    {
        _this.PositionElement.style.left = _this.Start.Left + dis + 'px';
    };
    
    this.SetTop = function( dis )
    {
        _this.PositionElement.style.top = _this.Start.Top + dis + 'px';
    };

    
    /**************************************************************/
    function leftResize( e )
    {
        var x = e.clientX;
        var dis = x - _this.Start.X;
        var width = _this.Start.Width - dis;
        
        if ( width < _this.MinWidth )
        {
            width = _this.MinWidth;
            dis = _this.Start.Width - width; 
        }
        else if ( width > _this.MaxWidth )
        {
            width = _this.MaxWidth;
            dis = _this.Start.Width - width; 
        }
        
        _this.SetLeft( dis );
        _this.SetSize( width );
    }
    
    function rightResize( e )
    {
        var x = e.clientX;
        var dis = x - _this.Start.X;
        var width = _this.Start.Width + dis;
        
        if ( width < _this.MinWidth ) width = _this.MinWidth;
        else if ( width > _this.MaxWidth ) width = _this.MaxWidth;
        
        _this.SetSize( width );
    }
    
    function topResize( e )
    {
        var y = e.clientY;
        var dis = y - _this.Start.Y;
        var height = _this.Start.Height - dis;
        
        if ( height < _this.MinHeight )
        {
            height = _this.MinHeight;
            dis = _this.Start.Height - height; 
        }
        else if ( height > _this.MaxHeight )
        {
            height = _this.MinHeight;
            dis = _this.Start.Height - height; 
        }
        
        _this.SetTop( dis );
        _this.SetSize( null, height );
    }
    
    function bottomResize( e )
    {
        var y = e.clientY;
        var dis = y - _this.Start.Y;
        var height = _this.Start.Height + dis;
        
        if ( height < _this.MinHeight ) height = _this.MinHeight;
        else if ( height > _this.MaxHeight ) height = _this.MaxHeight;
        
        _this.SetSize( null, height );
    }
    
    /**************************************************************/
    
    function mouseDown( e, moveX, moveY )
    {
        if ( !_this.Resizable ) return;
        
        changed = false;
        
        _this.MoveX = moveX;
        _this.MoveY = moveY;
        
        _this.Start = {};
        if ( _this.MoveX )
        {
            _this.Start.X = e.clientX;
            _this.Start.Width = element.offsetWidth;
            if ( _this.MoveX == 1 ) _this.Start.Left = _this.PositionElement.offsetLeft;
        }
        if ( _this.MoveY )
        {
            _this.Start.Y = e.clientY;
            _this.Start.Height = element.offsetHeight;
            if ( _this.MoveY == 1 ) _this.Start.Top = _this.PositionElement.offsetTop;
        }
        
        My.Element.AddEvent( document, 'mousemove', mouseMove );
        My.Element.AddEvent( document, 'mouseup', mouseUp );
        
        _this.OnMouseDown();
    }
    
    function mouseMove( ev )
    {
        var e = ev || event;
        if ( _this.MoveX == 1 ) leftResize( e );
        else if ( _this.MoveX == 2 ) rightResize( e );
        if ( _this.MoveY == 1 ) topResize( e );
        else if ( _this.MoveY == 2 ) bottomResize( e );
        
        if ( !changed )
        {
            changed = true;
            _this.OnMouseMoveStart();
        }
        _this.OnMouseMove();
    }
    
    function mouseUp()
    {
        My.Element.RemoveEvent( document, 'mousemove', mouseMove );
        My.Element.RemoveEvent( document, 'mouseup', mouseUp );
        
        _this.OnMouseUp( changed );
    }
    
};

My.Element.GetAllChildren = function( element )
{
    var es = [];
    search( element );
    
    function search( e )
    {
        var children = e.childNodes;
        for ( var i = 0; i < children.length; i++ )
        {
            var c = children[ i ];
            if ( c.tagName )
            {
                es.push( c );
                search( c );
            }
        }
    }
    
    return es;
};

My.Element.RemoveAllChildren = function( parent )
{
    var child;
    while ( child = parent.childNodes[ 0 ] ) parent.removeChild( child );
};

My.Element.SetSelectable = function( element, bool )
{
    var es = My.Element.GetAllChildren( element );
    
    es.push( element );
    
    var cS = My.Element.SetSelectable._cS;
    
    if ( bool )
    {
        var removeEvent = My.Element.RemoveEvent;
        for ( var i = 0; i < es.length; i++ )
        {
            var e = es[ i ];
            removeEvent( e, 'selectstart', cS );
            removeEvent( e, 'mousedown', cS );
        }
    }
    else
    {
        var addEvent = My.Element.AddEvent;
        for ( var i = 0; i < es.length; i++ )
        {
            var e = es[ i ];
            addEvent( e, 'selectstart', cS );
            addEvent( e, 'mousedown', cS );
        }
    }
};

My.Element.SetSelectable._cS = function( ev )
{
    var e = ev || event;
    e.returnValue = false;
    if ( e.preventDefault ) e.preventDefault();
    return false;
};

My.Element.FillText = function( ele, str )
{   
    setTimeout( main, 0 ); //避免无法正确取宽高.
    function main()
    {
        var max, len;
        max = len = str.length;
        var min = 0;
        
        ele.innerHTML = str;
        
        if ( ele.scrollWidth > ele.offsetWidth )
        {
            while ( min < max )
            {
                var n = Math.ceil( ( max + min ) / 2 );
                ele.innerHTML = str.Left( n ) + '..';
                if ( ele.scrollWidth > ele.offsetWidth ) max = n - 1;
                else min = n;
            }
            
            ele.innerHTML = str.Left( min ) + '..';
        }
    }
};

My.Element.IsMouseOut = function( ele, e )
{
    var sPos = ele.getBoundingClientRect();
    var sX = sPos.left;
    var sY = sPos.top;
    var eX = sX + ele.offsetWidth;
    var eY = sY + ele.offsetHeight;
    
    var x = e.clientX;
    var y = e.clientY;
    
    return !( x > sX && x < eX && y > sY && y < eY );
};