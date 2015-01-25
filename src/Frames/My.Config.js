/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.Config = function( path )
{
    var _this = this;

    this.Value = {};
    
    this.Read = function( handle )
    {
        My.JSON.Get( path, jHandle, true );
        function jHandle( done, value )
        {
            if ( done )
            {
                _this.Value = value;
                handle( true );
            }
            else handle( false, value );
        }
    };
    
    this.Save = function( /**/handle )
    {
        handle = handle || function(){};
        var info = { Path: path, JSON: JSON.stringify( _this.Value ) }
        My.JSON.PostObject( 'Apps/Config/Save.ashx', 'info', info, jHandle );
        function jHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error ) handle( true );
                else handle( false, value.Error );
            }
            else handle( false );
        }
    };
}