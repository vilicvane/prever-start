/*(C)2007-2009 ViCRiLoR v.O Studio*/

System.ContextMenu = new function()
{
    var _this = this;

    this.Items = [];

    this.InitRegInfo = function( handle )
    {
        My.XMLHttp.Get( 'System:\\Prever\\Registration\\System\\ContextMenu.prd', menuHandle );
        
        function menuHandle( done, text )
        {
            if ( done )
            {
                menuInit( text );
                handle();
            }
        }
        
        function menuInit( str )
        {
            var items = [];
            
            function fillItems( s, s1 )
            {
                var infos = s1.split( '|' );
                var types = infos[ 1 ].split( ',' );
                
                for ( var i = 0; i < types.length; i++ )
                    addItem( types[ i ], infos[ 0 ], infos[ 2 ], infos[ 3 ], infos[ 4 ] );
                
            }
            
            str.replace( /\[(.*?)\]/g, fillItems );
            
            function addItem( ext, uid, text, annex, icon )
            {
                if ( !ext.StartsWith( '.' ) && !ext.StartsWith( '#' ) ) ext = '.' + ext;
                
                var root = _this.Items;
                if ( !root[ ext ] ) root[ ext ] = [];
                var aim = root[ ext ];
                
                var texts = text.split( '>' );
                var loop = texts.length - 1;
                
                var iText = texts[ loop ];
                
                //构建数组结构
                for ( var i = 0; i < loop; i++ )
                {
                    var t = texts[ i ];
                    var j;
                    var len = aim.length;
                    for ( j = 0; j < len; j++ )
                        if ( aim[ j ].Text == t && aim[ j ].Children )
                        {
                            aim = aim[ j ].Children;
                            break;
                        }
                    if ( j == len )
                    {
                        var children = [];
                        
                        var iconPath;
                        if ( icon ) eval( 'iconPath=' + icon + ';' );
                        
                        aim.push
                        (
                            {
                                Text: t,
                                Children: children,
                                Icon: iText ? null : iconPath
                            }
                        );
                        aim = children;
                    }
                }
                
                if ( iText )
                {
                    var iconPath = null;
                    if ( icon ) eval( 'iconPath=' + icon + ';' );
                    
                    var annexInfo = null;
                    if ( annex ) eval( 'annexInfo={' + annex + '};' );
                    
                    aim.push
                    (
                        {
                            Text: iText,
                            ProgramUID: uid,
                            Annex: annexInfo,
                            Icon: iconPath
                        }
                    );
                }
            }
        }
    };
}();

