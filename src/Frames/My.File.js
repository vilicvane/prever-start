/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.File = function( path )
{
    var _this = this;
    
    this.Name = '';
    this.Path = '';
    
    this.SetPath = function( path )
    {
        path = My.Path.Normalize( path );
        
        _this.Name = My.Path.GetFileName( path );
        _this.Path = path
    };
    
    this.GetDetails = function( handle )
    {
        My.JSON.Post( 'Apps/File/GetDetails.ashx', 'path=' + _this.Path.Escape(), jHandle );
        function jHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error )
                {
                    var ps = [ 'Length', 'FactualPath', 'CreationTime', 'LastWriteTime', 'LastAccessTime', 'Attributes' ];
                    
                    for ( var i = 0; i < ps.length; i++ )
                    {
                        var p = ps[ i ];
                        _this[ p ] = value[ p ];
                    }
                    handle( true );
                }
                else handle( false, value.Error );
            }
            else handle( false );
        }
    };
    
    if ( path ) this.SetPath( path );
};