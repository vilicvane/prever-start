/*(C)2007-2009 ViCRiLoR v.O Studio*/

System.FileSystem = new function()
{
    var _this = this;
    
    this.RelatedPrograms = [];
    this.Icons = [];
    this.IconRootPath = 'System:\\Prever\\Registration\\Icons\\48\\';
    this.SmallIconRootPath = 'System:\\Prever\\Registration\\Icons\\16\\';

    this.InitRegInfo = function( handle )
    {
        My.XMLHttp.Get( 'System:\\Prever\\Registration\\System\\OpenWithDefaultList.prd', opwDftDeal );
        
        //初始化文件对应的默认程序
        function opwDftDeal( done, text )
        {
            if ( done )
            {
                function fillItems( s, ext, uid )
                {
                    if ( !ext.StartsWith( '.' ) && !ext.StartsWith( '#' ) ) ext = '.' + ext;
                    
                    _this.RelatedPrograms[ ext ] = [];
                    _this.RelatedPrograms[ ext ].push( uid );
                }
                
                text.replace( /\[([\w\.,#]+)\|([0-9a-z]{8})\]/gi, fillItems );
                
                My.XMLHttp.Get( 'System:\\Prever\\Registration\\System\\OpenWithList.prd', openWithDeal );
            }
        }
        
        //初始化文件对应的全部程序
        function openWithDeal( done, text )
        {
            if ( done )
            {
                function fillItems( s, uid, extStr )
                {
                    var exts = extStr.split( ',' );
                    
                    for ( var i = 0; i < exts.length; i++ )
                    {
                        var ext = exts[ i ];
                        if ( !ext.StartsWith( '.' ) && !ext.StartsWith( '#' ) ) ext = '.' + ext;
                        
                        if ( !_this.RelatedPrograms[ ext ] )
                            _this.RelatedPrograms[ ext ] = [];
                        _this.RelatedPrograms[ ext ].push( uid );
                    }
                }
                
                text.replace( /\[([0-9a-z]{8})\|([\w\.,#]+)\]/gi, fillItems );
                
                My.XMLHttp.Get( 'System:\\Prever\\Registration\\System\\Icons.prd', iconDeal );
            }
        }
        
        //初始化文件图标
        function iconDeal( done, text )
        {
            if ( done )
            {
                function fillItems( s, extStr, path )
                {
                    var exts = extStr.split( ',' );
                    for ( var i = 0; i < exts.length; i++ )
                    {
                        var ext = exts[ i ];
                        if ( !ext.StartsWith( '.' ) && !ext.StartsWith( '#' ) ) ext = '.' + ext;
                        
                        _this.Icons[ ext ] = path;
                    }
                }
                
                text.replace( /\[([\w,\.#]+)\|(.+)\]/g, fillItems );
                
                handle();
            }
        }
    };

    this.Open = function( path, type, /**/uid, /**/annex, /**/handle )
    {
        if ( !uid )
        {
            if ( !type ) type = My.Path.GetExtension( path );
            var uids = _this.RelatedPrograms[ type ];
            if ( !uids && type.charAt( 0 ) == '#' )
                uids = _this.RelatedPrograms[ '#' ];
            
            if ( uids )
                uid = uids[ 0 ];
            else
            {
                System.Window._Instance.Message( { Text: 'Prever 无法打开此类文件.', Type: 'Error' } );
                return;
            }
        }
        
        if ( !/^[\.#]/.test( type ) ) //如果type不以.或#开头
            type = My.Path.GetExtension( path );
        
        var programPath = System.Program.Paths[ uid ];
        
        if ( !annex ) annex = {};
        
        var baseType = type.Left( 1 );
        if ( baseType == '.' )
            annex.AimFile = path;
        else if ( baseType == '#' )
            annex.AimDirectory = path;
        
        System.Program.Launch( programPath, handle, annex );
    };
}();