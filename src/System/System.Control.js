/*(C)2007-2009 ViCRiLoR v.O Studio*/

System.Control = new function()
{
    var _this = this;
    this.Paths = [];

    this.Create = function( host, name, handle, annex, relaunch )
    {
        var path = _this.Paths[ name ];
        System.Program.Launch( path, cHandle, annex, relaunch );
        function cHandle( bool, program )
        {
            if ( bool ) host.Controls.push( program );
            handle( bool, program );
        }
    };

    this.InitRegInfo = function( handle )
    {
        My.XMLHttp.Get( 'System:\\Prever\\Registration\\System\\Controls.prd', dHandle );
        
        function dHandle( done, text )
        {
            if ( done )
            {
                var items = System.Control.Paths;
                
                text.replace( /\[(.+)\|(.+)\]/gi, fillItems );
                handle();
            }
            
            function fillItems( s, name, path )
            {
                items[ name ] = eval( path );
            }
        }
    }
}();

