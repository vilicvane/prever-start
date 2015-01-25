/*(C)2007-2009 ViCRiLoR v.O Studio*/

var User = {};
var Skin = {};

System.WindowType = //窗口类型
{
    Desktop: 0,
    Normal: 1,
    Elementary: 2
};

System.WindowOrder = //窗口顺序
{
    Desktop: 0,
    AlwaysBottom: 1,
    Normal: 2,
    AlwaysTop: 3 
};

System.PositionMode = //窗口位置
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

System.WindowSize = //窗口大小
{
    Original: 0,
    Maximized: 1
};

System.Start = function()
{
    //清空加载界面
    System.Element.Window.innerHTML = '';
    System.Element.Window.className = 'Login';
    
    System.Start.Init();
};

System.Start.Init = function()
{
    System.LoadingStatus = My.Element.CreateDiv( 'position: absolute; top: 50%; height: 20px; margin-top: -10px; width: 100%; text-align: center;' );
    
    System.Element.Window.appendChild( System.LoadingStatus );
    System.LoadingStatus.innerHTML = '正在加载文件信息...';
    
    var objs = [ System.FileSystem, System.Program, System.ContextMenu, System.Control ];
    var len = objs.length;
    var i = 0;
    
    init();
    
    function init()
    {
        if ( i < len ) objs[ i++ ].InitRegInfo( init );
        else System.Start.Login();
    }
};

System.Start.Login = function()
{
    System.Start.LoadUserItems();
};

System.Start.LoadUserItems = function()
{
    User.ID = 'Vilic';
    User.Rate = 3;
    System.Drive = {};
    System.Drive.System = 'System:\\';
    System.Drive.Disk = 'Disk:\\';
    User.SkinPath = 'System:\\Prever\\Users\\All Users\\Default Skin\\';
    System.LoadingStatus.innerHTML = '正在加载用户配置...';
    
    var processArr = [ loadScript, loadImage, loadCSS, loadRun ];
    
    var loadIndex = 0;
    function loadNext()
    {
        if ( loadIndex == processArr.length )
            System.Start.Done();
        else processArr[ loadIndex++ ]();
    }
    
    My.Element.LoadScript( User.SkinPath + 'Main.js', loadScript );
    
    function loadScript()
    {
        if ( Skin.ScriptList && Skin.ScriptList.length > 0 )
        {
            var scripts = [];
            for ( var i = 0; i < Skin.ScriptList.length; i++ )
                scripts.push( User.SkinPath + Skin.ScriptList[ i ] );
                
            My.Element.LoadScript( scripts, loadNext, processHandle );
        }
        else loadNext();
        
        function processHandle( now, amount )
        {
            System.LoadingStatus.innerHTML = '正在加载皮肤脚本(' + now + '/' + amount + ')...';
        }
    }
    
    function loadImage()
    {
        if ( Skin.ImageList && Skin.ImageList.length > 0 )
        {
            var images = [];
            for ( var i = 0; i < Skin.ImageList.length; i++ )
                images.push( User.SkinPath + Skin.ImageList[ i ] );
            
            My.Element.LoadImage( images, loadNext, processHandle );
        }
        else loadNext();
        
        function processHandle( now, amount )
        {
            System.LoadingStatus.innerHTML = '正在加载图片(' + now + '/' + amount + ')...';
        }
    }
    
    function loadCSS()
    {
        if ( Skin.CSSList && Skin.CSSList.length > 0 )
        {
            var csss = [];
            for ( var i = 0; i < Skin.CSSList.length; i++ )
                csss.push( User.SkinPath + Skin.CSSList[ i ] );
            
            My.Element.LoadCSS( csss, true, loadNext, processHandle );
        }
        else loadNext();
        
        function processHandle( now, amount )
        {
            System.LoadingStatus.innerHTML = '正在加载样式文件(' + now + '/' + amount + ')...';
        }
    }
    
    function loadRun()
    {
        
        (function()
        {
            var win = System.Window;
            
            var host =
            {
                Settings: {},
                Windows: [],
                Path: ''
            };
            
            var op = new win.Option();
            op.Title = 'Prever Start';
            op.Width = 0;
            op.Height = 0;
            op.CreateTaskCard = false;
            System.Window._Instance = new win.Elementary( host, op );
        })();
    
        System.LoadingStatus.innerHTML = '正在加载启动列表...';
        var sysRun = 'System:\\Prever\\Registration\\System\\Run\\';
        var userRun = 'System:\\Prever\\Registration\\Users\\' + User.ID + '\\Run\\';
        
        var runPath = sysRun;
        var dir = new My.Directory( sysRun );
        dir.GetDirsAndFiles( handle );
        
        var iHandle = function()
        {
            dir.SetPath( runPath = userRun );
            dir.GetDirsAndFiles( handle );
            iHandle = loadNext;
        };
        
        function handle( done )
        {
            if ( done )
            {
                var files = dir.Files.Names;
                for ( var i = 0; i < files.length; i++ )
                {
                    var path = runPath + files[ i ];
                    var type = My.Path.GetExtension( path );
                    System.FileSystem.Open( path, type );
                }
                var dirs = dir.Directories.Names;
                for ( var i = 0; i< dirs.length; i++ )
                {
                    var path = runPath + dirs[ i ];
                    var type = My.Path.GetExtension( path, true );
                    System.FileSystem.Open( path, type );
                }
            }
            
            iHandle();
        }
    }
};

System.Start.Done = function()
{
    System.Element.Window.className = '';
    System.Element.Window.removeChild( System.LoadingStatus );
    System.Element.Taskbar.style.display = 'block';
    System.Browser.Resize();
    
};

System.Dispose = function()
{
    var running = System.Program.Running;
    var list = running.concat();
    for ( var i = 0; i < list.length; i++ )
    {
        var one = list[ i ];
        one.Dispose( true );
    }
    My.Element.RemoveAllChildren( document.body );
    window.close();
};

(function()
{
    var amt = 0;
    
    var style = System.Element.Window.style;
    
    System.AddProgress = function( timeout )
    {
        if ( !timeout ) timeout = 5000;
        amt++;
        style.cursor = 'progress';
        var tOut = setTimeout( cancel, timeout );
        
        function doCancel()
        {
            amt--;
            clearTimeout( tOut );
            check();
        }
        
        function cancel()
        {
            doCancel();
            doCancel = function(){};
        }
        
        return cancel;
    };
    
    function check()
    {
        if ( !amt ) style.cursor = 'default';
    }
})();