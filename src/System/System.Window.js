/*(C)2007-2009 ViCRiLoR v.O Studio*/

System.Window = function( host, option, isNormal )
{
    var _this = this;

    /****************************************************/
    //公开事件
    this.OnLoad = function(){};
    this.OnClose = function(){};
    
    this.OnMove = function(){};
    this.OnResize = function(){};
    
    this.OnFocusIn = function(){};
    this.OnFocusOut = function(){};
    
    this.OnMaximize = function(){};
    this.OnMinimize = function(){};
    this.OnRestore = function(){};
    this.OnCancelMinimized = function(){};
    
    this.OnDispose = function(){};
    
    //内部事件
    
    this._OnCurrentChange = function(){};
    this._OnFrameResize = function(){};
    this._OnBodyResize = function(){};
    this._OnTitleChange = function(){};
    this._OnIconChange = function(){};
    this._OnMaximize = function(){};
    this._OnRestore = function(){};
    this._OnWindowShown = function(){};
    
    /****************************************************/
    
    var frame = My.Element.CreateDiv( 'position: absolute; overflow: hidden; display: none;' );
    var body;
    this.Frame = frame;
    
    var hijackDiv = My.Element.CreateDiv( 'position: absolute; left: 0px; top: 0px; height: 100%; width: 100%; background: #FFFFFF; filter: alpha(opacity=0); opacity: 0;' )
        
    var win = System.Window;
    var eW = System.Element.Window;
    var sE = Skin.Element;
    
    this.IsMain = ( host.Windows.length == 0 ) ? true : false;
    this.Host = host;
    
    this.FocusHijacks = [];
    
    frame.onmousedown = function()
    {
        win.ChangeCurrent( _this );
    };
    
    eW.appendChild( frame );

    var bW, bsW;
    
    this.SetSize = function( width, height )
    {
        if ( _this.SizeMode == win.SizeMode.FullScreen ) return;
        
        if ( width != null )
            body.style.width = width + 'px';
        if ( height != null )
            body.style.height = height + 'px';
        
        _this._OnBodyResize( width, height );
        _this.OnResize();
    };
    
    this._SetCurrent = function( bool )
    {
        if ( _this.IsCurrent != bool )
        {
            if ( bool )
            {
                win.Current = _this;
                _this.OnFocusIn();
            }
            else
            {
                win.Current = null;
                _this.OnFocusOut();
            }
            _this.IsCurrent = bool;
            if ( _this.TaskCard ) _this.TaskCard._SetCurrent( bool );
            _this._OnCurrentChange( bool );
        }
    };
    
    this.AddFocusHijack = function( aim )
    {
        _this.FocusHijacks.RemoveByValue( aim );
        _this.FocusHijacks.push( aim );
        if ( hijackDiv.parentNode != frame )
            frame.appendChild( hijackDiv );
    };
    
    this.RemoveFocusHijack = function( aim )
    {
        _this.FocusHijacks.RemoveByValue( aim );
        if ( !_this.FocusHijacks.length && hijackDiv.parentNode == frame )
            frame.removeChild( hijackDiv );
    };
    
    this.AddCSS = function( paths, handle )
    {
        var hostPath = host.Path;
        
        if ( typeof paths != typeof [] ) paths = [ paths ];
        for ( var i = 0; i < paths.length; i++ )
            paths[ i ] = hostPath + '\\' + paths[ i ];
            
        var settings = host.Settings;
        
        My.Element.LoadCSS( paths, true, handle, null, settings.ClassLabel, settings.ClassName, host.IsRelaunch );
    };
    
    this.SetTitle = function( title )
    {
        if ( _this.TaskCard ) _this.TaskCard._SetTitle( title );
        _this.Title = title;
        _this._OnTitleChange( title );
    };
    
    this.SetIcon = function( path )
    {
        _this.IconPath = path;
        
        path = My.Path.GetAbsolutePath( path, host.Path );
        var url = My.Path.GetURL( path );
        
        if ( _this.TaskCard ) _this.TaskCard.IconBox.src = url;
        _this._OnIconChange( url );
    };
    
    //初始化
    this._Initialize = function()
    {
        body = _this.Body;
        body.className = host.Settings.ClassName; //CSS类名
    };
    
    this.Initialize = function()
    {
        if ( _this.CreateTaskCard ) _this.AddTaskCard();
        frame.style.display = 'block';
        
        _this._OnWindowShown();
        
        if ( _this.SizeMode == win.SizeMode.Normal )
            _this.SetSize( _this.Width, _this.Height );
        
        _this.ResetPosition();
        
        _this.SetTitle( _this.Title );
        _this.SetIcon( _this.IconPath );
        
        _this.IsMinimized = false;
        
        win.ChangeCurrent( _this );
        
    };
    
    this.Dispose = function( force )
    {
        win.Dispose( _this, force );
    };
    
    this.ResetPosition = function()
    {
        if ( _this.SizeMode == win.SizeMode.Normal )
        {
            var pT = _this.PositionMode;
            
            var xt = pT.X / 2;
            var yt = pT.Y / 2;
            
            var x = _this.Position.X + ( eW.offsetWidth - frame.offsetWidth ) * xt;
            var y = _this.Position.Y + ( eW.offsetHeight - frame.offsetHeight ) * yt;
            
            frame.style.left = x + 'px';
            frame.style.top = y + 'px';
        }
        else if ( _this.SizeMode == win.SizeMode.Maximized )
        {
            frame.style.left = - bW + 'px';
            frame.style.top = - bW + 'px';
            
            var fW = eW.offsetWidth + bsW;
            var fH = eW.offsetHeight + bsW;
            
            frame.style.width = fW + 'px';
            frame.style.height = fH + 'px';
            
            _this._OnFrameResize( fW, fH );
            _this.OnResize();
            
        }
        else if ( _this.SizeMode == win.SizeMode.FullScreen )
        {
            body.style.width = eW.offsetWidth + 'px';
            body.style.height = eW.offsetHeight + 'px';
            
            frame.style.left = '0px';
            frame.style.top = '0px';
            
            _this._OnBodyResize( eW.offsetWidth, eW.offsetHeight );
            _this.OnResize();
            
        }
    };
    
    My.Element.AddEvent( window, 'resize', this.ResetPosition );
    
    this.RecordPosition = function( changed )
    {
        if ( !changed ) return;
        _this.Position.X = getX( frame.offsetLeft );
        _this.Position.Y = getY( frame.offsetTop );
        _this.Width = body.offsetWidth;
        _this.Height = body.offsetHeight;
    };
    
    this.Maximize = function() //最大化
    {
        if ( _this.SizeMode == win.SizeMode.Maximized ) return;
        
        _this.SizeMode = win.SizeMode.Maximized;
        _this.ResetPosition();
        _this._OnMaximize();
        _this.OnMaximize();
    };
    
    this.Restore = function() //还原
    {
        if ( _this.SizeMode == win.SizeMode.Normal ) return;
        
        _this.SizeMode = win.SizeMode.Normal;
        _this.SetSize( _this.Width, _this.Height );
        _this.ResetPosition();
        _this._OnRestore();
        _this.OnRestore();
    };
    
    this.Minimize = function() //最小化
    {
        if ( _this.IsMinimized ) return;
        
        win.CancelCurrent( _this );
        
        _this.IsMinimized = true;
        frame.style.display = 'none';
        _this.OnMinimize();
    };
    
    this.ChangeToCurrent = function(){ win.ChangeCurrent( _this ); }
    
    this.CancelMinimized = function( toBeCurrent ) // 取消最小化
    {
        if ( !_this.IsMinimized ) return;
        _this.IsMinimized = false;
        
        frame.style.display = 'block';
        
        if ( toBeCurrent == null || toBeCurrent ) win.ChangeCurrent( _this );
        _this.ResetPosition();
        _this.OnCancelMinimized();
    };
    
    this.AddTaskCard = function()
    {
        if ( !_this.TaskCard )
            _this.TaskCard = new win.TaskCard( _this );
    };
    
    this.RemoveTaskCard = function()
    {
        if ( _this.TaskCard )
            _this.TaskCard.Dispose();
    };
    
    this.Message = win._Message;
    this.Input = win._Input;
    

    My.Object.CopyPrototype( option, this );
    host.Windows.push( this ); //添加窗口元素到数组
    
    if ( isNormal )
    {
        bW = sE.Window.BorderWidth;
        bsW = bW * 2;
    }
    else bW = bsW = 0;
    /******************内部函数******************/
    
    //获取窗口相对位置
    function getX( left )
    {
        var pM = _this.PositionMode.X;
        var x = left - ( eW.offsetWidth - frame.offsetWidth ) * pM / 2;
        return x;
    }
    
    function getY( top )
    {
        var pM = _this.PositionMode.Y;
        var y = top - ( eW.offsetHeight - frame.offsetHeight ) * pM / 2;
        return y;
    }
    
};

System.Window._Message = function( option, handle )
{
    var _this = this;
    var host = this.Host;
    var win = System.Window;
    var createBt = My.Element.CreateButton;
    
    var text, type;
    if ( typeof option != typeof {} )
    {
        text = option;
        option = {};
    }
    else text = option.Text;
    
    type = ( option.Type || 'information' ).toLowerCase();
    
    var op = new win.Option();
    
    op.Title = option.Title || _this.Title;
    
    op.CreateTaskCard = false;
    op.IconPath = _this.IconPath;
    op.Width = option.Width || 300;
    op.Height = option.Height || 0;
    
    var txtDis = -Skin.Element.Window.MessageTextAvailableWidth;
    if ( op.Width < txtDis ) op.Width = txtDis;
    
    var main = new win.Popup( host, op );
    main.OnDispose = cancelClick;
    
    this.AddFocusHijack( main );
    var body = main.Body;
    
    body.className = 'Window_Message';
    body.innerHTML =
        '<div class="Img"></div>' +
        '<div class="Text"></div>' +
        '<div class="ButtonBox"></div>';
    
    var bCh = body.childNodes;
    var img = bCh[ 0 ];
    var txt = bCh[ 1 ];
    var btBox = bCh[ 2 ];
    
    main.Initialize();
    
    txt.innerHTML = '.';
    var h = txt.offsetHeight;
    txt.innerHTML = text;
    
    txt.style.width = op.Width - txtDis + 'px';
    
    if ( txt.offsetHeight > h ) txt.className += ' Multi';
    else txt.className += ' Single';
    
    var yes = option.Yes;
    var no = option.No;
    var cancel = option.Cancel;
    handle = handle || function(){};
    
    if ( type == 'confirm' )
    {
        imgClass = ' Confirm';
        
        yes = yes || '确定' ;
        cancel = cancel || '取消';
    }
    else
    {
        if ( type == 'information' )
            imgClass = ' Info';
        else if ( type == 'waring' )
            imgClass = ' Waring';
        else if ( type == 'error' )
            imgClass = ' Error';
        
        yes = yes || '确定';
    }
    
    if ( yes )
    {
        var bt = createBt( yes );
        bt.onclick = yesClick;
        btBox.appendChild( bt );
        bt.focus();
    }
    if ( no )
    {
        var bt = createBt( no );
        bt.onclick = noClick;
        btBox.appendChild( bt );
    }
    if ( cancel )
    {
        var bt = createBt( cancel );
        bt.onclick = function(){ cancelClick( true ); };
        btBox.appendChild( bt );
    }
    
    img.className += imgClass;
    
    if ( !option.Height )
    {
        img.style.height = txt.offsetHeight + 'px';
        var tH = txt.offsetHeight + btBox.offsetHeight;
        main.SetSize( null, tH );
        main.Position.Y = 0;
        main.ResetPosition();
    }
    
    function yesClick()
    {
        dispose( true );
        handle( true );
    }
    
    function noClick()
    {
        dispose( true );
        handle( false );
    }
    
    function cancelClick( w )
    {
        dispose( w );
        handle( null );
    }
    
    function dispose( w )
    {
        _this.RemoveFocusHijack( main );
        
        main.OnDispose = function(){};
        if ( w ) main.Dispose();
    }
    
}

System.Window._Input = function( option, handle )
{
    var _this = this;
    var host = this.Host;
    var win = System.Window;
    var createBt = My.Element.CreateButton;
    
    var text, value;
    if ( typeof option != typeof {} )
    {
        text = option;
        option = {};
    }
    else text = option.Text;
    
    var op = new win.Option();
    
    op.Title = option.Title || _this.Title;
    
    op.CreateTaskCard = false;
    op.IconPath = _this.IconPath;
    op.Width = option.Width || 300;
    op.Height = option.Height || 0;
    
    var main = new win.Popup( host, op );
    main.OnDispose = cancelClick;
    
    this.AddFocusHijack( main );
    var body = main.Body;
    
    body.className = 'Window_Input';
    body.innerHTML =
        '<div class="Information"></div>' +
        '<div class="InputBox"><input type="text" /></div>' +
        '<div class="ButtonBox"></div>';
    
    var bCh = body.childNodes;
    var info = bCh[ 0 ];
    var inputBox = bCh[ 1 ];
    var input = inputBox.childNodes[ 0 ];
    var btBox = bCh[ 2 ];
    
    main.Initialize();
    
    var done = option.Done || '确认';
    var cancel = option.Cancel || '取消';
    handle = handle || function(){};
    
    info.innerHTML = text || '';
    input.value = option.Value || '';
    input.style.width = op.Width + Skin.Element.Window.InputTextAvailableWidth - 2 + 'px';
    input.select();

    //确认键
    var doneBt = createBt( done );
    doneBt.onclick = doneClick;
    btBox.appendChild( doneBt );
    
    input.onkeypress = function( ev )
    {
        var e = ev || event;
        if ( e.keyCode == 13 ) doneClick();
    };
    
    //取消键
    var cancelBt = createBt( cancel );
    cancelBt.onclick = function(){ cancelClick( true ); };
    btBox.appendChild( cancelBt );
    
    if ( !option.Height )
    {
        var tH = info.offsetHeight + inputBox.offsetHeight + btBox.offsetHeight;
        main.SetSize( null, tH );
        main.Position.Y = 0;
        main.ResetPosition();
    }
    
    function doneClick()
    {
        dispose( true );
        handle( input.value );
    }
    
    function cancelClick( w )
    {
        dispose( w );
        handle( null );
    }
    
    function dispose( w )
    {
        _this.RemoveFocusHijack( main );
        
        main.OnDispose = function(){};
        if ( w ) main.Dispose();
    }
    
}

System.Window.Elementary = function( host, option /*System.Window.Option 类*/ )
{
    System.Window.call( this, host, option );
    var _this = this;
    
    var body = My.Element.CreateDiv( 'position: relative; overflow: hidden;' );
    var frame = this.Frame;
    
    frame.appendChild( body );
    
    this.Body = body;
    
    this._OnFrameResize = function( width, height )
    {
        if ( width )
            body.style.width = width + 'px';
        if ( height )
            body.style.height = height + 'px';
    };
    
    this._OnBodyResize = function( width, height )
    {
        if ( width )
            frame.style.width = width + 'px';
        if ( height )
            frame.style.height = height + 'px';
    };
    
    /**********************************************************/
    //初始化
    
    this._Initialize();
};

System.Window.Popup = function( host, option )
{
    System.Window.call( this, host, option, true );
    var _this = this;
    
    var win = System.Window;
    var eW = System.Element.Window;
    var sE = Skin.Element.Window;
    
    var windowHTML =
        '<div class="Window_T">' +
            '<div class="Window_T_L"></div>' +
            '<div class="Window_T_C"></div>' +
            '<div class="Window_T_R"></div>' +
        '</div>' +
        '<div class="Window_M">' +
            '<div class="Window_M_L"></div>' +
            '<div class="Window_M_C">' +
                '<div class="Window_TiBox">' +
                    '<div class="Window_Ti_L"></div>' +
                    '<div class="Window_Ti_C">' +
                        '<img class="Window_Icon" />' +
                        '<div class="Window_Title"></div>' +
                        '<div class="Window_BtBox">' +
                            '<div class="Window_ClsBt"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="Window_Ti_R"></div>' +
                '</div>' +
                '<div style="float: left; overflow: hidden; position: relative;"></div>' +
            '</div>' +
            '<div class="Window_M_R"></div>' +
        '</div>' +
        '<div class="Window_B">' +
            '<div class="Window_B_L"></div>' +
            '<div class="Window_B_C"></div>' +
            '<div class="Window_B_R"></div>' +
        '</div>';
    
    //指向元素
    var frame = this.Frame;
    frame.className = 'Window_Normal';
    frame.innerHTML = windowHTML;
    
    var top = frame.childNodes[ 0 ];
    var top_left = top.childNodes[ 0 ];
    var top_center = top.childNodes[ 1 ];
    var top_right = top.childNodes[ 2 ];
    
    var mid = frame.childNodes[ 1 ];
    var mid_left = mid.childNodes[ 0 ];
    var mid_center = mid.childNodes[ 1 ];
    var mid_right = mid.childNodes[ 2 ];
    
    var bot = frame.childNodes[ 2 ];
    var bot_left = bot.childNodes[ 0 ];
    var bot_center = bot.childNodes[ 1 ];
    var bot_right = bot.childNodes[ 2 ];
    
    var titleDiv = mid_center.childNodes[ 0 ];
    var title_center = titleDiv.childNodes[ 1 ];
    var titleText = title_center.childNodes[ 1 ];
    
    var buttonDiv = title_center.childNodes[ 2 ];
    var button_close = buttonDiv.childNodes[ 0 ];
    
    var body = mid_center.childNodes[ 1 ];
    
    
    this.IconBox = title_center.childNodes[ 0 ];
    
    this.TitleBox = titleText;
    this.Body = body;
    
    button_close.onclick = this.Dispose; //关闭
    
    //拖拽相关
    var mover = new My.Element.Mover( frame );
    this.Mover = mover;
    
    mover.AddHandle( titleDiv );
    mover.OnMouseUp = this.RecordPosition;
    
    //设置窗口大小.
    /*以BODY为参考*/
    var bsW = sE.BorderWidth * 2;
    var btW, disTW;
    var tCAW = sE.TitleCenterAvailableWidth;
    
    this._OnWindowShown = function()
    {
        btW = buttonDiv.offsetWidth;
        disTW = sE.TitleTextAvailableWidth - btW;
    };
    
    this._OnFrameResize = function( width, height )
    {
        if ( width != null )
        {
            var bW = width - bsW;
            var tCW = bW + tCAW;
            var tTW = tCW + disTW;
            
            title_center.style.width = tCW + 'px';
            titleText.style.width = tTW + 'px';
            
            titleDiv.style.width =
            body.style.width =
            top_center.style.width =
            mid_center.style.width =
            bot_center.style.width = bW + 'px';
        }
        if ( height != null )
        {
            var iH = height - bsW;
            var bH = iH - sE.TitleHeight;
            
            mid.style.height = mid_left.style.height = mid_center.style.height = mid_right.style.height = iH + 'px';
            body.style.height = bH + 'px';
        }
    };
    
    this._OnBodyResize = function( width, height )
    {
        if ( width != null )
        {
            var fW = width + bsW;
            var tCW = width + tCAW;
            var tTW = tCW + disTW;
            
            frame.style.width = fW + 'px';
            
            title_center.style.width = tCW + 'px';
            titleText.style.width = tTW + 'px';
            
            titleDiv.style.width =
            top_center.style.width =
            mid_center.style.width =
            bot_center.style.width = width + 'px';
        }
        if ( height != null )
        {
            var iH = height + sE.TitleHeight;
            var fH = iH + bsW;
            
            frame.style.height = fH + 'px';
            
            mid.style.height = mid_left.style.height = mid_center.style.height = mid_right.style.height = iH + 'px';
        }
    };
    
    this.SetMovable = function( bool )
    {
        _this.Movable = bool;
        if ( _this.SizeMode != win.SizeMode.Maximized ) mover.Movable = bool;
    };

    //设置是否为当前窗口
    this._OnCurrentChange = function( bool )
    {
        frame.className = bool ? 'Window_Normal_Current' : 'Window_Normal';
    };
    
    this._OnTitleChange = function( title )
    {
        _this.TitleBox.innerHTML = title;
    };
    
    this._OnIconChange = function( url )
    {
        _this.IconBox.src = url;
    };
    
    this._Initialize();
    
    this.SetMovable( this.Movable );
};

System.Window.Normal = function( host, option )
{
    System.Window.call( this, host, option, true );
    var _this = this;
    
    var win = System.Window;
    var eW = System.Element.Window;
    var sE = Skin.Element.Window;
    
    var windowHTML =
        '<div class="Window_T">' +
            '<div class="Window_T_L"></div>' +
            '<div class="Window_T_C"></div>' +
            '<div class="Window_T_R"></div>' +
        '</div>' +
        '<div class="Window_M">' +
            '<div class="Window_M_L"></div>' +
            '<div class="Window_M_C">' +
                '<div class="Window_TiBox">' +
                    '<div class="Window_Ti_L"></div>' +
                    '<div class="Window_Ti_C">' +
                        '<img class="Window_Icon" />' +
                        '<div class="Window_Title"></div>' +
                        '<div class="Window_BtBox"></div>' +
                    '</div>' +
                    '<div class="Window_Ti_R"></div>' +
                '</div>' +
                '<div style="float: left; overflow: hidden; position: relative;"></div>' +
            '</div>' +
            '<div class="Window_M_R"></div>' +
        '</div>' +
        '<div class="Window_B">' +
            '<div class="Window_B_L"></div>' +
            '<div class="Window_B_C"></div>' +
            '<div class="Window_B_R"></div>' +
        '</div>';
    
    //指向元素
    var frame = this.Frame;
    frame.className = 'Window_Normal';
    frame.innerHTML = windowHTML;
    
    var top = frame.childNodes[ 0 ];
    var top_left = top.childNodes[ 0 ];
    var top_center = top.childNodes[ 1 ];
    var top_right = top.childNodes[ 2 ];
    
    var mid = frame.childNodes[ 1 ];
    var mid_left = mid.childNodes[ 0 ];
    var mid_center = mid.childNodes[ 1 ];
    var mid_right = mid.childNodes[ 2 ];
    
    var bot = frame.childNodes[ 2 ];
    var bot_left = bot.childNodes[ 0 ];
    var bot_center = bot.childNodes[ 1 ];
    var bot_right = bot.childNodes[ 2 ];
    
    var titleDiv = mid_center.childNodes[ 0 ];
    var title_center = titleDiv.childNodes[ 1 ];
    var titleText = title_center.childNodes[ 1 ];
    
    var buttonDiv = title_center.childNodes[ 2 ];
    
    var button_min = {};
    var button_max = {};
    var button_close = {};
    
    function addBt( cName )
    {
        var div = document.createElement( 'DIV' );
        div.className = cName;
        buttonDiv.appendChild( div );
        return div;
    }
    
    if ( option.MinimizeButton ) button_min = addBt( 'Window_MinBt' );
    if ( option.MaximizeButton ) button_max = addBt( 'Window_MaxBt' );
    if ( option.CloseButton ) button_close = addBt( 'Window_ClsBt' );
    
    var body = mid_center.childNodes[ 1 ];
    
    this.IconBox = title_center.childNodes[ 0 ];
    
    this.TitleBox = titleText;
    this.Body = body;
    
    //最大化/还原
    titleDiv.ondblclick = button_max.onclick = function()
    {
        if ( _this.SizeMode == win.SizeMode.Maximized ) _this.Restore();
        else _this.Maximize();
    };
    
    button_min.onclick = this.Minimize; //最小化
    button_close.onclick = this.Dispose; //关闭
    
    //拖拽相关
    var mover = new My.Element.Mover( frame );
    this.Mover = mover;
    
    mover.AddHandle( titleDiv );
    mover.OnMouseUp = this.RecordPosition;
    
    //窗口缩放
    var resizer = new My.Element.Resizer( body );
    this.Resizer = resizer;
    
    resizer.SetSize = this.SetSize;
    resizer.PositionElement = frame;
    resizer.OnMouseUp = this.RecordPosition;
    
    var rT = My.Element.ResizeType;
    
    resizer.AddHandle( top_center, rT.TopOnly );
    resizer.AddHandle( top_left, rT.LeftAndTop );
    resizer.AddHandle( top_right, rT.RightAndTop );
    resizer.AddHandle( mid_left, rT.LeftOnly );
    resizer.AddHandle( mid_right, rT.RightOnly );
    resizer.AddHandle( bot_center, rT.BottomOnly );
    resizer.AddHandle( bot_left, rT.LeftAndBottom );
    resizer.AddHandle( bot_right, rT.RightAndBottom );
    
    //设置窗口大小.
    /*以BODY为参考*/
    var bsW = sE.BorderWidth * 2;
    var btW, disTW;
    var tCAW = sE.TitleCenterAvailableWidth;
    
    this._OnWindowShown = function()
    {
        btW = buttonDiv.offsetWidth;
        disTW = sE.TitleTextAvailableWidth - btW;
        var minWidth = btW - sE.TitleTextAvailableWidth - sE.TitleCenterAvailableWidth;
        if ( minWidth > resizer.MinWidth )
            resizer.MinWidth = minWidth;
    };
    
    this._OnFrameResize = function( width, height )
    {
        if ( width != null )
        {
            var bW = width - bsW;
            var tCW = bW + tCAW;
            var tTW = tCW + disTW;
            
            title_center.style.width = tCW + 'px';
            titleText.style.width = tTW + 'px';
            
            titleDiv.style.width =
            body.style.width =
            top_center.style.width =
            mid_center.style.width =
            bot_center.style.width = bW + 'px';
        }
        if ( height != null )
        {
            var iH = height - bsW;
            var bH = iH - sE.TitleHeight;
            
            mid.style.height = mid_left.style.height = mid_center.style.height = mid_right.style.height = iH + 'px';
            body.style.height = bH + 'px';
        }
    };
    
    this._OnBodyResize = function( width, height )
    {
        if ( width != null )
        {
            var fW = width + bsW;
            var tCW = width + tCAW;
            var tTW = tCW + disTW;
            
            frame.style.width = fW + 'px';
            
            title_center.style.width = tCW + 'px';
            titleText.style.width = tTW + 'px';
            
            titleDiv.style.width =
            top_center.style.width =
            mid_center.style.width =
            bot_center.style.width = width + 'px';
        }
        if ( height != null )
        {
            var iH = height + sE.TitleHeight;
            var fH = iH + bsW;
            
            frame.style.height = fH + 'px';
            
            mid.style.height = mid_left.style.height = mid_center.style.height = mid_right.style.height = iH + 'px';
        }
    };
    

    this.SetResizable = function( bool )
    {
        _this.Resizable = resizer.Resizable = bool;
    };
    
    this.SetMovable = function( bool )
    {
        _this.Movable = bool;
        if ( _this.SizeMode != win.SizeMode.Maximized ) mover.Movable = bool;
    };

    this._OnMaximize = function()
    {
        mover.Movable = false;
        button_max.className = 'Window_RstBt';
    };
    
    this._OnRestore = function()
    {
        mover.Movable = _this.Movable;
        button_max.className = 'Window_MaxBt';
    };

    //设置是否为当前窗口
    this._OnCurrentChange = function( bool )
    {
        frame.className = bool ? 'Window_Normal_Current' : 'Window_Normal';
    };
    
    this._OnTitleChange = function( title )
    {
        _this.TitleBox.innerHTML = title;
    };
    
    this._OnIconChange = function( url )
    {
        _this.IconBox.src = url;
    };
    
    this._Initialize();
    
    this.SetResizable( this.Resizable );
    this.SetMovable( this.Movable );
};

System.Window.Option = function()
{
    var win= System.Window;
    this.Title = 'Prever Script Program';
    
    this.IconPath = My.FileSystem.GetIconPath( '#psp', true );
    this.CreateTaskCard = true;
    
    this.Order = win.Order.Normal;
    this.PositionMode = win.PositionMode.Center;
    this.SizeMode = win.SizeMode.Normal;
    this.Position = { X: 0, Y: 0 };
    this.Resizable = true;
    this.Movable = true;
    
    this.MinimizeButton = true;
    this.MaximizeButton = true;
    this.CloseButton = true;
    
    this.Width = 400;
    this.Height = 300;
}

System.Window.Orders = [];
System.Window.Current = null;

System.Window.Dispose = function( aim, force )
{
    var win = System.Window;
    var toDo = aim.OnDispose();
    
    if ( !force && toDo != null && !toDo ) return;
    
    if ( aim.IsMain ) aim.Host.Dispose();
    else
    {
        win.CancelCurrent( aim );
        if ( aim.TaskCard ) aim.TaskCard.Dispose();
        System.Element.Window.removeChild( aim.Frame );
        aim.Host.Windows.RemoveByValue( aim );
        
        var orders = win.Orders;
        var end = orders.length - 1;
        
        for ( var i = aim.ZIndex; i < end; i++ )
        {
            orders[ i ] = orders[ i + 1 ];
            orders[ i ].ZIndex = i;
        }
        
        orders.pop();
    }
};

System.Window.ChangeCurrent = function( aim )
{
    var win = System.Window;
    if ( win.Current != null )
    {
        if ( win.Current == aim ) return;
        win.Current._SetCurrent( false );
    }
    
    if ( !aim ) return;
    
    var order = aim.Order;
    
    var orders = win.Orders;
    var length = orders.length;
    
    if ( aim.ZIndex == null )
    {
        //创建顺序
        var zIndex = length;
        
        while ( zIndex > 0 )
        {
            var i = zIndex - 1;
            if ( orders[ i ].Order <= order )
            {
                aim.ZIndex = aim.Frame.style.zIndex = zIndex;
                orders[ zIndex ] = aim;
                break;
            }
            orders[ zIndex ] = orders[ i ];
            orders[ zIndex ].ZIndex = orders[ zIndex ].Frame.style.zIndex = zIndex;
            zIndex--;
        }
        
        if ( zIndex == 0 )
        {
            aim.ZIndex = aim.Frame.style.zIndex = zIndex;
            orders[ zIndex ] = aim;
        }
    }
    else
    {
        //更改顺序
        var zIndex = aim.ZIndex;
        var l = length - 1;
        while ( zIndex < l )
        {
            var i = zIndex + 1;
            if ( orders[ i ].Order > order )
            {
                aim.ZIndex = aim.Frame.style.zIndex = zIndex;
                orders[ zIndex ] = aim;
                break;
            }
            orders[ zIndex ] = orders[ i ];
            orders[ zIndex ].ZIndex = orders[ zIndex ].Frame.style.zIndex = zIndex;
            zIndex++;
        }
        if ( zIndex == l )
        {
            aim.ZIndex = aim.Frame.style.zIndex = zIndex;
            orders[ zIndex ] = aim;
        }
    }
    
    aim.CancelMinimized();
    aim._SetCurrent( true );
    
    if ( aim.FocusHijacks[ 0 ] ) System.Window.ChangeCurrent( aim.FocusHijacks[ 0 ] );
};

System.Window.CancelCurrent = function( aim, setNew )
{
    var win = System.Window;
    
    var c = win.Current;
    if ( aim == c && c != null )
    {
        if ( setNew == null || setNew )
        {
            var orders = win.Orders;
            var zIndex = c.ZIndex - 1;
            while ( zIndex > -1 && orders[ zIndex ].IsMinimized ){ zIndex--; }
            
            if ( zIndex > -1 )
            {
                win.ChangeCurrent( orders[ zIndex ] );
                return;
            }
        }
        
        c._SetCurrent( false );
        win.Current = null;
    }
};

System.Window.Order = //窗口顺序
{
    Desktop: 0,
    AlwaysBottom: 1,
    Normal: 2,
    AlwaysTop: 3,
    AbsoluteTop: 4
};

System.Window.PositionMode = //窗口位置
{
    Center: { X: 1, Y: 1 },
    
    Left: { X: 0, Y: 1 },
    Right: { X: 2, Y: 1 },
    Top: { X: 1, Y: 0 },
    Bottom: { X: 1, Y: 2 },
    
    LeftTop: { X: 0, Y: 0 },
    LeftBottom: { X: 0, Y: 2 },
    RightTop: { X: 2, Y: 0 },
    RightBottom: { X: 2, Y: 2 }
};

System.Window.SizeMode = 
{
    Normal: 0,
    Maximized: 1,
    FullScreen: 2
};
