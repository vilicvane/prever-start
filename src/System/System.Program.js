/*(C)2007-2009 ViCRiLoR v.O Studio*/

System.Program = new function()
{
    var _this = this;
    
    this.Running = []; //正在运行的程序(对象)
    this.Loaded = []; //已加载的程序(路径)

    this.RegistedPrograms = [];
    this.Paths = [];
    this.UIDs = [];

    this.InitRegInfo = function( handle )
    {
        My.XMLHttp.Get( 'System:\\Prever\\Registration\\System\\Programs.prd', proHandle );
        
        function proHandle( done, text )
        {
            if ( done )
            {
                function fillItems( s, s1 )
                {
                    var reg;
                    eval( 'reg={' + s1 + '};' );
                    
                    reg.Path = reg.Path.toLowerCase();
                    
                    _this.RegistedPrograms.push( reg );
                    _this.Paths[ reg.UID ] = reg.Path;
                    _this.UIDs[ reg.Path ] = reg.UID;
                }
            
                text.replace( /\[([\S\s]+?)\]/gi, fillItems );
                
                handle();
            }
        }
    }

    this.Launch = function( path, handle, annex, relaunch )
    {
        var programObject;
        var settings;
        var queue;
        
        path = My.Path.Normalize( path );
        
        var pathLC = path.toLowerCase();
        var loadedInfo = _this.Loaded[ pathLC ];
        
        if ( !annex ) annex = {};
        
        if ( relaunch || !loadedInfo )
        {
            
            var className = 'P' + My.String.GetRandomString( 6 );
            
            loadedInfo = _this.Loaded[ pathLC ] = { Queue: [] };
            
            var url = My.Path.GetURL( path + '\\Main.pcd' ) + '&class=' + className;
            
            
            var settings;
            
            function xmlHandle( done, value )
            {
                if ( done )
                {
                    settings = value;
                    settings.ClassName = className;
                    loadScript();
                }
            }
            
            My.JSON.Get( url, xmlHandle );
            
            function loadScript()
            {
                var sList = settings.ScriptList;
                if ( sList.length == 0 )
                {
                    finishLoad( false );
                    return;
                }
                
                var scripts = [];
                for ( var i = 0; i < sList.length; i++ )
                    scripts.push( My.Path.GetAbsolutePath( sList[ i ], path ) );
                
                My.Element.LoadScript( scripts, finishLoad, null, settings.ClassLabel, className );
            }
            
            function finishLoad( done )
            {
                if ( done )
                {
                    queue = loadedInfo.Queue;
                    _this.Loaded[ pathLC ] = settings;
                    
                    create();
                }
            }        
        }
        else if ( loadedInfo.Queue )
        {
            loadedInfo.Queue.push( { p: path, h: handle, a: annex } );
        }
        else
        {
            settings = loadedInfo;
            create();
        }
        
        function create()
        {
            _this.Loaded[ pathLC ] = settings;
            var temp = settings.ClassName.ToObject();
            
            var program = {};
            
            _this.Running.push( program );
            
            program.Settings = settings;
            program.Path = path;
            program.UID = _this.UIDs[ pathLC ];
            program.Windows = [];
            program.Controls = [];
            
            program.IsRelaunch = relaunch ? true : false;
            
            program.OnDispose = function(){ return true; };
            program.Dispose = function( force ){ return _this.Dispose( program, force ); };
            program.AddControl = function( nm, hd, anx, rl ){ System.Control.Create( program, nm, hd, anx, rl ); };
            
            temp.call( program, annex );
            
            program.Start();
            
            if ( handle ) handle( true, program );
            
            if ( queue )
                for ( var i = 0; i < queue.length; i++ )
                    _this.Launch( queue[ i ].p, queue[ i ].h, queue[ i ].a );
        }
    };

    this.Dispose = function( program, force )
    {
        if ( !program.OnDispose() && !force ) return false;
        var ws = program.Windows;
        
        while ( ws.length )
        {
            ws[ 0 ].IsMain = false;
            ws[ 0 ].Dispose();
        }
        
        var cs = program.Controls;
        for ( var i = 0; i < cs.length; i++ )
            cs[ i ].Dispose( true );
        
        _this.Running.RemoveByValue( program );
        
        delete program;
        return true;
    };
    
}();
