/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.Variable = function( v, defaultValue )
{
    if ( v == null ) return defaultValue;
    else return v;
};

My.Program = 
{
    GetRunningByPath: function( path )
    {
        path = path.toLowerCase();
        var rst = [];
        var running = System.Program.Running;
        
        for ( var i = 0; i < running.length; i++ )
        {
            var one = running[ i ];
            if ( one.Path.toLowerCase() == path ) rst.push( one );
        }
        return rst;
    }
};