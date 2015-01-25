/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.Control = {};

My.Control.MenuBar = function()
{
    
};


//菜单类
/*********************************************************************/

/*
    BUG
    当有选项,但因为Condition返回null而隐藏时,如果上下分隔符内没有其他选项,分隔符会连在一起,变粗.
*/

//Class
My.Control.ContextMenu = function( positionType, posElement, closeWhenMouseOut, x, y )
{
    var _this = this;
    var pT = My.Control.ContextMenu.PositionType;
    
    this.PositionType = ( positionType != null ) ? positionType : pT.Mouse;
    this.PosElement = posElement;
    this.X = x || 0;
    this.Y = y || 0;
    
    this.Annex = null; //附加信息
    
    var div = document.createElement( 'DIV' );
    
    this.Element = div;
    
    div.className = 'My_Control_ContextMenu';
    div.style.zIndex = 1;
    
    System.Element.ControlArea.appendChild( div );
    
    div.onclick = function( e )
    {
        var upperMenu = _this;
        var nowMenu;
        do
        {
            nowMenu = upperMenu;
            upperMenu = upperMenu.UpperMenu;
        }
        while ( upperMenu );
        nowMenu.Close();
        
        My.Event.CancelBubble( e || event );
    };
    
    if ( closeWhenMouseOut )
        div.onmouseout = function( ev )
        {
            if ( My.Element.IsMouseOut( div, ev || event ) )
                _this.Close();
        };
    
    this.Items = [];
    this.Opened = false;
    this.ZIndex = 1;
    
    this.AddItems = function( items ) //My.Control.ContextMenu.Item
    {
        if ( typeof items != typeof [] || items.length == null ) items = [ items ];
        _this.Items = _this.Items.concat( items );
        
        for ( var i = 0; i < items.length; i++ )
        {
            items[ i ].SetParentMenu( _this );
            div.appendChild( items[ i ].Element );
        }
    };
    
    this.AddSeparator = function()
    {
        var s = document.createElement( 'DIV' );        
        s.className = 'My_Control_ContextMenu_Separator';
        div.appendChild( s );
    };
    
    this.SetZIndex = function( zIndex )
    {
        div.style.zIndex = _this.ZIndex = zIndex;
        
        var items = _this.Items;
        for ( var i = 0; i < items.length; i++ )
            if ( items[ i ].ChildMenu ) items[ i ].ChildMenu.SetZIndex( zIndex + 1 );
    };
    
    this.Open = function( e, anx )
    {
        _this.Annex = anx;
        if ( _this.Opened ) _this.Close();
        
        var items = _this.Items;
        
        for ( var i = 0; i < items.length; i++ )
            items[ i ].Refresh();
        
        div.style.display = 'block';
        var left, top;
        var dW = div.offsetWidth;
        var dH = div.offsetHeight;
        var bW = document.body.offsetWidth;
        var bH = document.body.offsetHeight;
        var pW, pH;
        
        if ( _this.PositionType == pT.Mouse )
        {
            left = e.clientX;
            top = e.clientY;
            
            var mr = left + dW;
            if ( mr > bW ) left = bW - dW;
            
            var mb = top + dH;
            if ( mb > bH ) top -= dH;
        }
        else
        {
            function getPos( p )
            {
                switch ( p )
                {
                    case pT.ElementLeft:
                        left -= dW;
                        break;
                    case pT.ElementRight:
                        left += pW;
                        break;
                    case pT.ElementTop:
                        top -= dH;
                        break;
                    case pT.ElementBottom:
                        top += pH;
                        break;
                    default: break;
                }
            }
            
            var pE = _this.PosElement;
            var rect = pE.getBoundingClientRect();
            left = rect.left + _this.X;
            top = rect.top + _this.Y;
            
            var thisPT  = _this.PositionType;
            
            pW = pE.offsetWidth;
            pH = pE.offsetHeight;
            
            if ( thisPT == pT.ElementRightOrLeft )
            {
                getPos( pT.ElementRight );
                
                var mr = left + dW;
                if ( mr > bW ) left -= dW + pW;
            }
            else if ( thisPT == pT.ElementLeftOrRight )
            {
                getPos( pT.ElementLeft );
                
                if ( left < 0 ) left += dW + pW;
            }
            else getPos( thisPT );
            
            if ( thisPT != pT.ElementTop && thisPT != pT.ElementBottom )
            {
                var mb = top + dH;
                if ( mb > bH ) top = bH - dH;
            }
            
        }
        
        div.style.left = left + 'px';
        div.style.top = top + 'px';
        
        _this.Opened = true;
    };
    
    this.Close = function()
    {
        var items = _this.Items;
        for ( var i = 0; i < items.length; i++ )
            if ( items[ i ].ChildMenu && items[ i ].ChildMenu.Opened )
                items[ i ].ChildMenu.Close();
        
        div.style.display = 'none';
        
        if ( _this.CurrentItem )
            _this.CurrentItem.Clear();
        
        _this.Opened = false;
    };
    
    this.Dispose = function()
    {
        
    };
};

//Object
//菜单定位方式
My.Control.ContextMenu.PositionType =
{
    Mouse: 0,
    ElementLeft: 1,
    ElementRight: 2,
    ElementTop: 3,
    ElementBottom: 4,
    ElementRightOrLeft: 5,
    ElementLeftOrRight: 6
};

//Class
My.Control.ContextMenu.Item = function( text, workcondition, func, iconPath )
{
    var _this = this;
    
    var html =
        '<div class="My_Control_ContextMenu_Item">' +
            '<div class="My_Control_ContextMenu_Icon"></div>' +
            '<div class="My_Control_ContextMenu_Text"></div>' +
        '</div>';
    
    var element = My.Element.CreateByHTML( html );
    var iconDiv = element.childNodes[ 0 ];
    var textDiv = element.childNodes[ 1 ];
    
    var condition;
    
    function click( e )
    {
        if ( condition )
            _this.Function( _this.ParentMenu.Annex ); 
        else My.Event.CancelBubble( e || event );
    }
    
    function mouseOver()
    {
        var cI = _this.ParentMenu.CurrentItem;
        if ( cI && cI !== _this &&  cI.ChildMenu )
        {
            cI.Element.className = 'My_Control_ContextMenu_Item';
            cI.ChildMenu.Close();
        }
        _this.ParentMenu.CurrentItem = null;
        
        if ( !condition ) return;
        
        element.className = 'My_Control_ContextMenu_ItemHover';
        _this.ParentMenu.CurrentItem = _this;
    }
    
    function mouseOverWithChild()
    {
        if ( !_this.ParentMenu.Opened ) return;
        mouseOver();
        if ( condition )
            _this.ChildMenu.Open( null, _this.ParentMenu.Annex );
    }
    
    function mouseOut()
    {
        if ( !condition ) return;
        element.className = 'My_Control_ContextMenu_Item';
        _this.ParentMenu.CurrentItem = null;
    }
    
    function mouseOutWithChild(){}
    
    function clickWithChild( e )
    {
        My.Event.CancelBubble( e || event );
    }
    
    element.onclick = click;
    
    element.onmouseover = mouseOver;
    element.onmouseout = mouseOut;
    
    this.Element = element;
    this.Condition = ( typeof workcondition == typeof function(){} ) ? workcondition : function(){ return workcondition; };
    
    this.ChildMenu = null;
    this.ParentMenu = null;
    this.Function = func || function(){};
    
    this.AddChildMenu = function( contextMenu ) //My.Control.ContextMenu
    {
        textDiv.className = 'My_Control_ContextMenu_TextWithArrow';
        contextMenu.PosElement = element;
        contextMenu.PositionType = My.Control.ContextMenu.PositionType.ElementRightOrLeft;
        contextMenu.UpperMenu = _this.ParentMenu;
        
        element.onclick = clickWithChild;
        element.onmouseover = mouseOverWithChild;
        element.onmouseout = mouseOutWithChild;
        
        _this.ChildMenu = contextMenu;
    };
    
    this.SetParentMenu = function( parent )
    {
        _this.ParentMenu = parent;
        if ( _this.ChildMenu )
        {
            _this.ChildMenu.UpperMenu = parent;
            _this.ChildMenu.SetZIndex( parent.ZIndex + 1 );
        }
    };
    
    this.Refresh = function()
    {
        element.style.display = ( ( condition = _this.Condition() ) != null ) ? 'block' : 'none';
        element.className = condition ? 'My_Control_ContextMenu_Item' : 'My_Control_ContextMenu_Item My_Control_ContextMenu_ItemUnable';
    };
    
    this.Clear = function()
    {
        mouseOut();
    };
    
    this.SetIcon = function( path )
    {
        iconDiv.style.backgroundImage = 'url(' + My.Path.GetURL( path ) + ')';
    };
    
    this.SetText = function( str )
    {
        if ( str.StartsWith( '!' ) )
        {
            str = str.substr( 1 );
            textDiv.style.fontWeight = 'bold';
        }
        else if ( textDiv.style.fontWeight == 'bold' )
            textDiv.style.fontWeight = '';
        
        textDiv.innerHTML = str;
    };
    
    if ( iconPath ) this.SetIcon( iconPath );
    this.SetText( text );
    
};

//Function
My.Control.ContextMenu.CreateItems = function( texts, conditions, functions, iconPaths )
{
    var items = [];
    if ( typeof iconPaths != typeof [] ) iconPaths = [];
    for ( var i = 0; i < texts.length; i++ )
    {
        var item = new My.Control.ContextMenu.Item( texts[ i ], conditions[ i ], functions[ i ], iconPaths[ i ] );
        items.push( item );
    }
    return items;
};

//创建在系统中注册了的菜单项,但包括其子菜单的全部.
My.Control.ContextMenu.GetItemsFor = function( type, handle )
{
    var items = [];
    
    var ContextMenu = My.Control.ContextMenu;
    
    var root = System.ContextMenu.Items;
    
    if ( type.length > 1  )
    {
        function search( n1, n2 )
        {
            for ( var i = 0; i < n1.length; i++ )
            {
                var n1i = n1[ i ];
                if ( n1i.Children )
                {
                    for ( var j = 0; j < n2.length; j++ )
                    {
                        var n2j = n2[ j ];
                        if ( n2j.Children )
                        {
                            if ( n1i.Text == n2j.Text )
                            {
                                search( n1i.Children, n2j.Children );
                                n1i.Children = n1i.Children.concat( n2j.Children );
                                if ( !n1i.Icon && n2j.Icon ) n1i.Icon = n2j.Icon;
                                n2.splice( j--, 1 );
                            }
                        }
                    }
                }
            }
        }
        
        var node = root[ type ] || [];
        var node2 = root[ type.substr( 0, 1 ) ] || [];
        
        node = node.Clone();
        node2 = node2.Clone();
        
        search( node, node2 );
        node = node.concat( node2 );
        
        startSearch( node );
    }
    else startSearch( root[ type ] );
    
    return items;
    
    function startSearch( node )
    {
        if ( !node ) return;
        for ( var i = 0; i < node.length; i++ )
            items.push( createItem( node[ i ] ) );
    }
    
    function createItem( item )
    {
        var menuItem = new ContextMenu.Item( item.Text, true, function( annex ){ handle( item, annex ); }, item.Icon );
        if ( item.Children )
            menuItem.AddChildMenu( createMenu( item.Children ) );
        return menuItem;
    }
    
    function createMenu( node )
    {
        var mis = [];
        for ( var i = 0; i < node.length; i++ )
            mis.push( createItem( node[ i ] ) );
        var menu = new ContextMenu();
        menu.AddItems( mis );
        return menu;
    }
    
};

/*********************************************************************/

My.Control.MenuBar = function()
{
    
};


/****************************************************************/
//Icon
My.Control.Icon = function( info )
{
    var _this = this;
    My.Object.CopyPrototype( info, this );
};

My.Control.Icon.Base = function( icon )
{
    var _this = this;
    My.Object.CopyPrototype( icon, this );
    
    /*******************************/
    //事件
    this.OnAppend = function(){};
    this.OnClick = function(){};
    this.OnContextMenu = function(){};
    this.OnOpen = function(){};
    
    //方法
    this.SetCut = function(){};
    /*******************************/
    var ele = My.Element.CreateDiv( 'position: absolute;' );
    var img, text, isSmall;
    
    this.Element = ele;
    
    this.Selected = false;
    
    ele.title = ' 名称: ' + this.Name +
                ' \n 类型: ' + this.Type.substr( 1 ).toUpperCase() + ( this.IsFolder ? '文件夹' : '文件' ) +
                ( this.IsFolder ? '' : ' \n 大小: ' + My.FileSystem.ConvertSize( this.Size ) ) +
                ' \n 修改: ' + this.LastWriteTime + ' ';
    
    ele.onclick = function( ev )
    {
        var e = ev || event;
        My.Event.CancelBubble( e );
        _this.OnClick( _this, e );
    };
    
    ele.oncontextmenu = function( ev )
    {
        var e = ev || event;
        My.Event.CancelBubble( e );
        _this.OnContextMenu( _this, e );
        return false;
    };
    
    ele.ondblclick = this.Open = function()
    {
        _this.OnOpen( _this.Path, _this.IsFolder );
    };
    
    this.AppendTo = function( parent )
    {
        parent.appendChild( ele );
        var name = _this.Name;
        if ( _this.Type == '.lnk' ) name = name.Left( name.length - 4 );
        My.Element.FillText( text, name );
    };
    
    this.SetSelected = function( bool )
    {
        _this.Selected = bool;
        this.OnSelectedChange();
    };
    
    this.SetIconURL = function( url, handle )
    {
        var image = new Image();
        image.src = url;
        if ( image.complete ) done();
        else image.onload = done;
        
        function done()
        {
            img.style.backgroundImage = 'url(' + url + ')';
            if ( handle ) handle();
        }
    };
    
    this.Initialize = function( textEle, imgEle, isSmallBool )
    {
        My.Element.SetSelectable( ele, false );
        text = textEle;
        img = imgEle;
        isSmall = isSmallBool;
        
        _this.SetIconURL( My.Path.GetURL( My.FileSystem.GetIconPath( _this.Type, isSmall ) ), checkIcon );
        if ( _this.Hidden ) My.Element.SetOpacity( text, 50 );
    };
    
    function checkIcon()
    {
        var type = _this.Type;
        var path = _this.Path;
        
        if ( type == '.lnk' )
            My.FileSystem.LinkFile.GetIconPath( path, handle, isSmall );
        else if ( type == '#psp' )
            My.FileSystem.PSPFolder.GetIconPath( path, handle, isSmall );
        
        function handle( path )
        {
            if ( path )
            {
                var url = My.Path.GetURL( path );
                _this.SetIconURL( url );
            }
        }
    }
};

My.Control.Icon.Normal = function( icon )
{
    var _this = this;
    
    My.Control.Icon.Base.call( this, icon );
    
    var ele = this.Element;
    ele.className = 'My_Control_Icon_Normal';
    ele.innerHTML =
        '<div class="My_Control_Icon_Normal_Bg"></div>' +
        '<div class="My_Control_Icon_Normal_Image"></div>' +
        '<div class="My_Control_Icon_Normal_Text"></div>';
    
    var children = ele.childNodes;
    var bg = children[ 0 ];
    var img = children[ 1 ];
    var text = children[ 2 ];
    
    ele.onmouseover = function()
    {
        if ( !_this.Selected ) bg.className = 'My_Control_Icon_Normal_Bg My_Control_Icon_Normal_MouseOverBg';
    };
    
    ele.onmouseout = function()
    {
        if ( !_this.Selected ) bg.className = 'My_Control_Icon_Normal_Bg';
    };
    
    this.SetCut = function( bool )
    {
        var opacity = ( bool || _this.Hidden ) ? 50 : 100;
        My.Element.SetOpacity( text, opacity );
    };
    
    this.OnSelectedChange = function()
    {
        bg.className = 'My_Control_Icon_Normal_Bg' + ( _this.Selected ? ' My_Control_Icon_Normal_SelectedBg' : '' );
        text.className = ' My_Control_Icon_Normal_Text' + ( _this.Selected ? ' My_Control_Icon_Normal_SelectedText' : '' );
    };
    
    this.Initialize( text, img );
};

My.Control.Icon.Normal.Width = 70;
My.Control.Icon.Normal.Height = 70;
My.Control.Icon.Normal.Margin = 2;

My.Control.Icon.Thumbnail = function( icon )
{
    var _this = this;
    
    My.Control.Icon.Base.call( this, icon );
    
    var ele = this.Element;
    ele.className = 'My_Control_Icon_Thumbnail';
    ele.innerHTML =
        '<div class="My_Control_Icon_Thumbnail_Bg"></div>' +
        '<div class="My_Control_Icon_Thumbnail_Image"></div>' +
        '<div class="My_Control_Icon_Thumbnail_Text"></div>';
    
    var children = ele.childNodes;
    var bg = children[ 0 ];
    var img = children[ 1 ];
    var text = children[ 2 ];
    
    ele.onmouseover = function()
    {
        if ( !_this.Selected ) bg.className = 'My_Control_Icon_Thumbnail_Bg My_Control_Icon_Thumbnail_MouseOverBg';
    };
    
    ele.onmouseout = function()
    {
        if ( !_this.Selected ) bg.className = 'My_Control_Icon_Thumbnail_Bg';
    };

    this.SetCut = function( bool )
    {
        var opacity = ( bool || _this.Hidden ) ? 50 : 100;
        My.Element.SetOpacity( text, opacity );
    };
    
    this.OnAppend = function()
    {
        My.Element.FillText( text, _this.Name );
    };
    
    this.OnSelectedChange = function()
    {
        bg.className = 'My_Control_Icon_Thumbnail_Bg' + ( _this.Selected ? ' My_Control_Icon_Thumbnail_SelectedBg' : '' );
        text.className = ' My_Control_Icon_Thumbnail_Text' + ( _this.Selected ? ' My_Control_Icon_Thumbnail_SelectedText' : '' );
    };
    
    this.Initialize( text, img );
    
    //初始化
    if ( !this.IsFolder )
    {
        var ext = My.Path.GetExtension( this.Name );
    
        if ( /\.(jpg|jpeg|png|bmp|gif)$/i.test( ext ) )
            this.SetIconURL( My.Path.GetThumbnailURL( _this.Path, 64, 64, true ) );
    }
};

My.Control.Icon.Thumbnail.Width = 90;
My.Control.Icon.Thumbnail.Height = 90;
My.Control.Icon.Thumbnail.Margin = 2;

My.Control.Icon.List = function( icon )
{
    var _this = this;
    
    My.Control.Icon.Base.call( this, icon );
    
    var ele = this.Element;
    ele.className = 'My_Control_Icon_List';
    ele.innerHTML =
        '<div class="My_Control_Icon_List_Bg"></div>' +
        '<div class="My_Control_Icon_List_Image"></div>' +
        '<div class="My_Control_Icon_List_Text"></div>';
    
    var children = ele.childNodes;
    var bg = children[ 0 ];
    var img = children[ 1 ];
    var text = children[ 2 ];
    
    ele.onmouseover = function()
    {
        if ( !_this.Selected ) bg.className = 'My_Control_Icon_List_Bg My_Control_Icon_List_MouseOverBg';
    };
    
    ele.onmouseout = function()
    {
        if ( !_this.Selected ) bg.className = 'My_Control_Icon_List_Bg';
    };
    
    this.SetCut = function( bool )
    {
        var opacity = ( bool || _this.Hidden ) ? 50 : 100;
        My.Element.SetOpacity( text, opacity );
    };
    
    this.OnAppend = function()
    {
        My.Element.FillText( text, _this.Name );
    };
    
    this.OnSelectedChange = function()
    {
        bg.className = 'My_Control_Icon_List_Bg' + ( _this.Selected ? ' My_Control_Icon_List_SelectedBg' : '' );
        text.className = ' My_Control_Icon_List_Text' + ( _this.Selected ? ' My_Control_Icon_List_SelectedText' : '' );
    };
    
    this.Initialize( text, img, true );
};

My.Control.Icon.List.Width = 200;
My.Control.Icon.List.Height = 20;
My.Control.Icon.List.Margin = 0;
My.Control.Icon.List.XFirst = false;

//注,从右到左和从下到上时,相应边栏不支持滚动条
My.Control.Icon.Container = function( iconClass, handle, option )
{
    /*
    
    option
    
    GetMenuArray 获取菜单的函数
    EleMenu 右键菜单添加项
    XFirst 是否横向优先
    AutoAdjust 是否自动调节间距
    LeftToRight 是否为从左到右排列
    TopToBottom 是否为从上到下排列
    
    */
    var _this = this;
    
    //事件
    this.OnSelectedChange = function(){};
    
    var v = My.Variable;
    
    var xF = option.XFirst;
    var autoAdjust = v( option.AutoAdjust, false );
    var lTR = v( option.LeftToRight, true );
    var tTB = v( option.TopToBottom, true );
    var multiSelect = v( option.MultiSelect, true ); //是否可多选
    
    var getMenuArr = option.GetMenuArray;
    var eleMenu = option.EleMenu;
    
    var ele = My.Element.CreateDiv( 'position: relative; overflow: auto;' );
    
    ele.oncontextmenu = eleContextMenu;
    
    My.Element.AddEvent( ele, 'click', eleClick );
    
    var list = [];
    var eList = [];
    var selectedItems = [];
    
    var ender = My.Element.CreateDiv( 'position: absolute;' );
    
    var eM;
    
    var cW, cH, eW, eH;
    var cX, aX, cY, aY;
    
    var xFirst, adjust;
    
    var lToR, tToB;
    
    var iClass;
    
    var cMenus = [];
    
    var cM = new currentMenu();
    
    this.CurrentItem = null;
    this.Element = ele;
    this.List = list;
    this.SelectedItems = selectedItems; //被选中的图标
    
    this.SetIconHandle = function( newHandle )
    {
        handle = newHandle;
    };
    
    this.SetIconClass = function( iC )
    {
        _this.IconClass = iClass = iC;
        eM = iClass.Margin;
        
        ender.style.width = ender.style.height = eM + 'px';
        
        var ms = eM * 2;
        
        eW = ( iClass.Width != null ) ? iClass.Width + ms : null;
        eH = ( iClass.Height != null ) ? iClass.Height + ms : null;
        clearIcons();
        appendIcons( list );
        selectedItems.Clear();
        
        if ( xF == null )
        {
            xFirst = iClass.XFirst;
            if ( xFirst == null ) xFirst = true;
        }
        else xFirst = xF;
        
        changeXFirst();
        
        arrange();
    };
    
    this.SetXFirst = function( bool )
    {
        xF = xFirst = bool;
        changeXFirst();
        arrange();
    };
    
    this.SetAutoAdjust = function( bool )
    {
        adjust = bool;
        arrange();
    };
    
    this.SetLeftToRight = function( bool )
    {
        lToR = bool;
        if ( bool != null )
        {
            if ( bool )
            {
                cX = 'left';
                aX = 'right';
            }
            else
            {
                cX = 'right';
                aX = 'left';
            }
            
            var children = ele.childNodes;
            for ( var i = 0; i < children.length; i++ )
                children[ i ].style[ aX ] = '';
        }
        else
            for ( var i = 0; i < children.length; i++ )
            {
                var style = children[ i ].style;
                style.left = style.right = '';
            }
        arrange();
    };
    
    this.SetTopToBottom = function( bool )
    {
        tToB = bool;
        if ( bool != null )
        {
            if ( bool )
            {
                cY = 'top';
                aY = 'bottom';
            }
            else
            {
                cY = 'bottom';
                aY = 'top';
            }
            
            var children = ele.childNodes;
            for ( var i = 0; i < children.length; i++ )
                children[ i ].style[ aY ] = '';
        }
        else
            for ( var i = 0; i < children.length; i++ )
            {
                var style = children[ i ].style;
                style.top = style.bottom = '';
            }
        arrange();
    };
    
    this.SetSize = function( width, height )
    {
        ele.style.width = ( cW = width ) + 'px';
        ele.style.height = ( cH = height ) + 'px';
        
        arrange();
    };
    
    this.Add = function( nIcons )
    {
        if ( nIcons.length == null ) nIcons = [ nIcons ];
        var n = [];
        for ( var i = 0; i < nIcons.length; i++ )
        {
            n.push( nIcons[ i ] );
            list.push( nIcons[ i ] );
        }
        appendIcons( n );
        arrange();
    };
    
    this.Remove = function( aIcons )
    {
        if ( aIcons.length == null ) aIcons = [ aIcons ];
        
        var idxs = [];
        
        for ( var i = 0; i < aIcons.length; i++ )
        {
            var icnPath = aIcons[ i ].Path;
            for ( var j = 0; j < list.length; j++ )
                if ( list[ j ].Path == icnPath )
                {
                    ele.removeChild( eList[ j ].Element );
                    idxs.push( j );
                    break;
                }
        }
        
        list.RemoveByIndex( idxs );
        eList.RemoveByIndex( idxs );
        
        arrange();
    };
    
    this.ClearAll = function()
    {
        list.Clear(); //清除列表
        clearIcons(); //清除图标
    };
    
    this.FocusOut = cM.Close; //关闭菜单
    
    this.Arrange = _arrange;
    this.CancelSelected = cancelSelected;
    
    function arrange(){};
    
    function _arrange( reS )
    {
        var len = list.length;
        if ( !len ) return;
        
        var pos;
        var a, b, s, eS, eAS, max;
        var aP, bP, scroll;
        
        if ( xFirst )
        {
            s = reS || cW;
            eS = eW || s;
            eAS = eH;
            max = Math.floor( s / eS );
            aP = cY;
            bP = cX;
            scroll = 'Width';
        }
        else
        {
            s = reS || cH;
            eS = eH || s;
            eAS = eW;
            max = Math.floor( s / eS );
            aP = cX;
            bP = cY;
            scroll = 'Height';
        }
        if ( max == 0 ) max = 1;
        var single, rest;
        if ( adjust )
        {
            single = Math.floor( s / max );
            rest = ( single - eS ) / 2 + eM;
        }
        else
        {
            single = eS
            rest = eM;
        }
        
        for ( var i = 0; i < len; i++ )
        {
            b = i % max;
            a = ( i - b ) / max;
            
            a = a * eAS + eM;
            b = b * single + rest;
            
            var style = eList[ i ].Element.style;
            
            style[ aP ] = a + 'px';
            style[ bP ] = b + 'px';
        }
        
        ender.style[ aP ] = Math.ceil( len / max ) * eAS - eM + 'px';
        
        if ( !reS ) setTimeout( check, 0 );
        
        function check()
        {
            var osS = ele[ 'offset' + scroll ];
            var clS = ele[ 'client' + scroll ];
            if ( osS > clS ) _arrange( clS );
        }
    };
    
    function appendIcons( icons )
    {
        for ( var i = 0; i < icons.length; i++ )
        {
            var n = new iClass( icons[ i ] );
            
            n.OnClick = click;
            n.OnContextMenu = contextMenu;
            n.OnOpen = onOpen;
            
            eList.push( n );
            n.AppendTo( ele );
        }
        
        ele.appendChild( ender );
    }
    
    function clearIcons()
    {
        eList.Clear();
        My.Element.RemoveAllChildren( ele );
    }
    
    function onOpen( path, isFolder )
    {
        var annex = {};
        if ( isFolder ) annex.AimDirectory = path;
        else annex.AimFile = path;
        handle( annex );
        cancelSelected();
    }
    
    function cancelSelected()
    {
        _this.CurrentItem = null;
        var items = _this.SelectedItems;
        for ( var i = 0; i < items.length; i++ )
            items[ i ].SetSelected( false );
        items.Clear();
    }
    
    function click( obj, e, ct )
    {
        if ( !e.ctrlKey )
        {
            if ( !ct || !obj.Selected ) cancelSelected();
            
            if ( !obj.Selected )
            {
                selectedItems.push( obj );
                obj.SetSelected( true );
            }
            _this.CurrentItem = obj;
        }
        else
        {
            if ( !multiSelect ) cancelSelected();
            if ( obj.Selected )
            {
                if ( ct ) _this.CurrentItem = obj;
                else
                {
                    selectedItems.RemoveByValue( obj );
                    obj.SetSelected( false );
                }
            }
            else
            {
                selectedItems.push( obj );
                _this.CurrentItem = obj;
                obj.SetSelected( true );
            }
        }
        cM.Close();
        _this.OnSelectedChange();
    }
    
    function currentMenu()
    {
        var _this = this;
        this.Menu = null;
        this.Close = function()
        {
            if ( _this.Menu )
            {
                _this.Menu.Close();
                _this.Menu = null;
            }
        };
    }
    
    function contextMenu( obj, e )
    {
        click( obj, e, true );
        if ( !getMenuArr ) return;
        
        var CM = My.Control.ContextMenu;
        
        var type = obj.Type;
        if ( !cMenus[ type ] )
        {
            var cMenu = new CM();
            
            var mArr = getMenuArr( type );
            
            var first = true;
        
            for ( var i = 0; i < mArr.length; i++ )
            {
                if ( !mArr[ i ].length ) continue;
                if ( first ) first = false;
                else cMenu.AddSeparator();
                cMenu.AddItems( mArr[ i ] );
            }
            
            cMenus[ type ] = cMenu;
        }
        
        var aimFiles = [];
        var aimDirs = [];
        for ( var i = 0; i < selectedItems.length; i++ )
        {
            var item = selectedItems[ i ];
            if ( item.BaseType == '.' )
                aimFiles.push( item.Path );
            else aimDirs.push( item.Path );
        }
        
        var annex = { AimFiles: aimFiles, AimDirectories: aimDirs };
        var currentItem = _this.CurrentItem;
        
        var aimPath = currentItem.Path;
        
        if ( currentItem.IsFolder )
            annex.AimDirectory = aimPath;
        else annex.AimFile = aimPath;
        
        cMenus[ type ].Open( e, annex );
        
        cM.Menu = cMenus[ type ];
    }
    
    function eleContextMenu( ev )
    {
        var e = ev || event;
        cancelSelected();
        cM.Close();
        if ( eleMenu )
        {
            eleMenu.Open( e );
            cM.Menu = eleMenu;
        }
    }
    
    function eleClick()
    {
        cancelSelected();
        cM.Close()
        _this.OnSelectedChange();
    }
    
    function changeXFirst()
    {
        if ( xFirst )
        {
            ele.style.overflowX = 'hidden';
            ele.style.overflowY = 'auto';
        }
        else
        {
            ele.style.overflowX = 'auto';
            ele.style.overflowY = 'hidden';
        }
    }
    
    //初始化
    this.SetIconClass( iconClass );
    
    this.SetAutoAdjust( autoAdjust );
    this.SetLeftToRight( lTR );
    this.SetTopToBottom( tTB );
    arrange = _arrange;
    
    this.SetSize( 400, 300 );
    
};