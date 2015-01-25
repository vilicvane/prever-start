/*
    Image Viewer
    版本 1.0.1
    作者 Vilic Vane
    ©2009-2010 Micriod Studio
    
    1.0.1 + 修正了窗口最小宽度
*/

function $I( annex )
{
    var _this = this;
    var main, frame, body;
    
    var fS; //FileSelector
    
    var imageArea, buttonArea, buttonDiv, textDiv, img;
    
    var bt_previous, bt_play, bt_next, bt_zoomin, bt_zoomout, bt_open; 
    
    var mW, mH, oW, oH;
    var margin = 4;
    
    var mainHTML =
        '<div class="ImageArea">' +
            '<div>Prever 图片浏览器</div>' +
            '<img />' +
        '</div>' +
        '<div class="ButtonArea">' +
            '<div class="ButtonDiv">' +
                '<div class="Button1" title="上一张"></div>' +
                '<div class="Button2" title="播放"></div>' +
                '<div class="Button3" title="下一张"></div>' +
                '<div class="Button4" title="放大"></div>' +
                '<div class="Button5" title="缩小"></div>' +
                '<div class="Button6" title="打开"></div>' +
            '</div>' +
        '</div>';
    
    var imageList = [];
    var nowPos = 0;
    var timer;
    
    var zoom;
    var moveStart = {};
    
    this.Start = function()
    {
        var option = new System.Window.Option();
        
        option.Title = 'Prever 图片浏览器';
        option.IconPath = 'Icons\\16.png';
        option.Width = 450;
        option.Height = 300;
        
        main = new System.Window.Normal( _this, option );
        
        frame = main.Frame;
        body = main.Body;
        
        main.AddCSS( 'Main.css', init );
        
        body.innerHTML = mainHTML;
        
        imageArea = body.childNodes[ 0 ];
        
        textDiv = imageArea.childNodes[ 0 ];
        img = imageArea.childNodes[ 1 ];
        
        buttonArea = body.childNodes[ 1 ];
        buttonDiv = buttonArea.childNodes[ 0 ];
        
        var bts = buttonDiv.childNodes;
        
        bt_previous = bts[ 0 ];
        bt_play = bts[ 1 ];
        bt_next = bts[ 2 ];
        bt_zoomin = bts[ 3 ];
        bt_zoomout = bts[ 4 ];
        bt_open = bts[ 5 ];
        
        bt_open.onclick = openFile;
        
        main.Resizer.MinHeight = 100;
        main.Resizer.MinWidth = 250;
        
    };
    
    function init()
    {
        main.OnResize = resize;
        main.Initialize();
        
        if ( annex.AimFile ) openImage( annex.AimFile );
        
        img.unselectable = 'on';
        img.onmousedown = move_mousedown;
    }
    
    function move_mousedown( ev )
    {
        if ( img.width > mW || img.height > mH )
        {
            var e = ev || event;
            
            moveStart.X = e.clientX;
            moveStart.Y = e.clientY;
            moveStart.Width = img.offsetWidth;
            moveStart.Height = img.offsetHeight;
            moveStart.Left = img.offsetLeft;
            moveStart.Top = img.offsetTop;
            
            img.onmousemove = move_mousemove;
            img.onmouseup = img.onmouseout = move_mouseup;
        }
        return false;
    }
    
    function move_mousemove( ev )
    {
        var e = ev || event;
        
        var w = moveStart.Width;
        var h = moveStart.Height;
        
        if ( w > mW )
        {
            var x = e.clientX - moveStart.X;
            var l = moveStart.Left + x;
            
            if ( l > 0 ) l = 0;
            else if ( w + l < mW ) l = mW - w;
            img.style.left = l + 'px';
        }
        
        if ( h > mH )
        {
            var y = e.clientY - moveStart.Y;
            var t = moveStart.Top + y;
            if ( t > 0 ) t = 0;
            else if ( h + t < mH ) t = mH - h;
            img.style.top = t + 'px';
        }
    }
    
    function move_mouseup()
    {
        img.onmousemove = img.onmouseup = img.onmouseout = function(){};
    }
    
    function previous()
    {
        if ( nowPos == 0 ) nowPos = imageList.length;
        nowPos--;
        
        loadImage( imageList[ nowPos ] );
        
        var nP = nowPos;
        if ( nP == 0 ) nP = imageList.length;
        nP--;
        
        preLoad( imageList[ nP ] );
    }
    
    function next()
    {
        nowPos++;
        if ( nowPos == imageList.length ) nowPos = 0;
        
        loadImage( imageList[ nowPos ] );
        
        var nP = nowPos + 1;
        if ( nP == imageList.length ) nP = 0;
        
        preLoad( imageList[ nP ] );
    }
    
    function play()
    {
        bt_play.className = 'Button22';
        bt_play.title = '停止';
        bt_play.onclick = stopPlay;
        
        var nP = nowPos + 1;
        if ( nP == imageList.length ) nP = 0;
        
        preLoad( imageList[ nP ] );
        
        timer = setInterval( next, 3000 );
    }
    
    function stopPlay()
    {
        bt_play.className = 'Button2';
        bt_play.title = '播放';
        bt_play.onclick = play;
        clearInterval( timer );
    }
    
    function preLoad( path )
    {
        var nImg = new Image();
        nImg.src = My.Path.GetURL( path, 'image' );
    }
    
    function zoomIn()
    {
        zoom *= 2;
        doZoom();
    }
    
    function zoomOut()
    {
        zoom /= 2;
        doZoom();
        
        var w = img.offsetWidth;
        var h = img.offsetHeight;
        
        var l = img.offsetLeft;
        var r = mW - l - w;
        
        var t = img.offsetTop;
        var b = mH - t - h;
        
        if ( l * r < 0 )
        {
            if ( l > 0 ) img.style.left = '0px';
            else img.style.left = w - mW + 'px';
        }
        
        if ( t * b < 0 )
        {
            if ( t > 0 ) img.style.top = '0px';
            else img.style.top = h - mH + 'px';
        }
    }
    
    function doZoom()
    {
        var w = oW * zoom;
        var h = oH * zoom;
        
        var l, t;
        
        if ( w + 2 > mW )
            l = img.offsetLeft + ( img.offsetWidth - w ) / 2 - 1;
        else l = ( mW - w ) / 2 - 1;
        
        if ( h + 2 > mH )
            t = img.offsetTop + ( img.offsetHeight - h ) / 2 - 1;
        else t = ( mH - h ) / 2 - 1;
        
        img.style.width = w + 'px';
        img.style.height = h + 'px';
        
        img.style.left = l + 'px';
        img.style.top = t + 'px';
    }
    
    function openImage( path )
    {
        loadImage( path );
        
        var dir = My.Path.GetDirectoryName( path );
        
        var myDir = new My.Directory( dir );
        myDir.GetFiles( handle, true, '\.(jpg|jpeg|gif|png|bmp)$' );
        
        function handle()
        {
            var fs = myDir.Files.Names;
            imageList = [];
            nowPos = 0;
            for ( var i = 0; i < fs.length; i++ )
            {
                var p = dir + fs[ i ];
                if ( path == p ) nowPos = i;
                imageList[ i ] = p;
            }
            bt_previous.onclick = previous;
            bt_play.onclick = play;
            bt_next.onclick = next;
            
            bt_zoomin.onclick = zoomIn;
            bt_zoomout.onclick = zoomOut;
        }
        
    }
    
    function loadImage( path )
    {
        main.SetTitle( My.Path.GetFileName( path ) + ' - Prever 图片浏览器' );
        textDiv.innerHTML = '图像加载中...';
        
        img.style.display = 'none';
        textDiv.style.display = 'block';
        
        var nImg = new Image();
        
        var src = My.Path.GetURL( path );
        
        nImg.src = src;
        nImg.onload = onload;
        
        if ( nImg.complete ) onload();
        
        function onload()
        {
            textDiv.style.display = 'none';
            img.style.display = 'block';
            
            oW = nImg.width;
            oH = nImg.height;
            
            imageResize();
            
            img.src = src;
        };
    }
    
    function resize()
    {
        var ms = margin * 2;
        mW = body.offsetWidth - ms;
        mH = body.offsetHeight - buttonArea.offsetHeight - ms;
        imageArea.style.height = textDiv.style.lineHeight = mH + 'px';
        
        if ( img.complete ) imageResize();
    }
    
    function imageResize()
    {
        var w = oW;
        var h = oH;
        
        var iW = mW - 2;
        var iH = mH - 2;
        
        if ( w > iW || h > iH )
        {
            var times = w / h;
            if ( times > iW / iH )
            {
                w = iW;
                h = iW / times;
            }
            else
            {
                w = iH * times;
                h = iH;
            }
        }
        
        zoom = w / oW;
        
        img.style.width = w + 'px';
        img.style.height = h + 'px';
        
        img.style.left = ( iW - w ) / 2 + 'px';
        img.style.top  = ( iH - h ) / 2 + 'px';
        
    }
    
    function openFile()
    {
        if ( !fS )
        {
            var fOp =
            {
                HostWindow: main,
                Handle: handle,
                MultiSelect: false,
                FileExtensions: { Text: '图象文件', Exts: 'jpg,jpeg,gif,bmp,png' }
            };
            
            _this.AddControl( 'Prever.FileSelector', createControl, fOp );
            
        }
        else fS.Open();
        
        function handle( bool, files )
        {
            if ( bool ) openImage( files[ 0 ] );
        }
        
        function createControl( done, control )
        {
            if ( done )
            {
                fS = control;
                fS.Open();
            }
        }
    }
    
};