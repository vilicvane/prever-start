/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.JSON = {};

My.JSON.Get = function( path, handle, clearBuffer )
{
     My.XMLHttp.Get( path, jHandle, clearBuffer );
     
     function jHandle( done, text, status )
     {
        if ( done )
        {
            var value;
            try
            {
                value = eval( '(' + text + ')' );
                handle( true, value ); 
            }
            catch( e ){ handle( false ); };
        }
        else handle( false, status );
     }
};

My.JSON.Post = function( path, content, handle )
{
     My.XMLHttp.Post( path, content, jHandle );
     
     function jHandle( done, text, status )
     {
        if ( done )
        {
            var value;
            try
            {
                value = eval( '(' + text + ')' );
            }
            catch( e ){ handle( false ); return; };
            handle( true, value );
        }
        else handle( false, status );
     }
};

My.JSON.PostObject = function( path, name, object, handle )
{
    var content = name + '=' + object.toJSONString().Escape();
    My.JSON.Post( path, content, handle );
};