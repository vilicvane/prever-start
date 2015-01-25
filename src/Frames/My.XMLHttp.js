/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.XMLHttp = {};

My.XMLHttp.Create = function()
{
    var xml;

    if ( window.XMLHttpRequest )
        xml = new XMLHttpRequest();
    else
        xml = new ActiveXObject( 'MSXML2.XMLHTTP' );
    
    return xml;
};

My.XMLHttp.Get = function( path, handle, clearBuffer )
{
    var url = My.Path.GetURL( path, null, clearBuffer );
    var xml = My.XMLHttp.Create();
    
    var finish = System.AddProgress();
    
    xml.open( 'GET', url );
    xml.send( null );
    
    if ( already() )
        setTimeout
        (
            function()
            {
                if ( xml.status == 200 )
                {
                    var text = xml.responseText;
                    if ( !text ) text = '';
                    handle( true, text, xml.status );
                }
                else if ( xml.status > 200 ) handle( false, null, xml.status );
                
                finish();
            },
            0
        );
    else
        xml.onreadystatechange = function()
        {
            if ( xml.readyState == 4 && xml.status == 200 )
            {
                var text = xml.responseText;
                if ( !text ) text = '';
                
                handle( true, text, xml.status );
            }
            else if ( xml.readyState == 4 && xml.status > 200 ) handle( false, null, xml.status );
            
            finish();
        };
            
    function already()
    {
        try
        {
            var status = xml.status;
            return status != 0;
        }
        catch( e )
        {
            return false;
        }
    }
    
    return xml;
};

My.XMLHttp.Post = function( path, content, handle )
{
    var url = My.Path.GetURL( path );
    
    var xml = My.XMLHttp.Create();
    
    var finish = System.AddProgress();
    
    xml.open( 'POST', url );
    xml.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xml.send( content );
    
    xml.onreadystatechange = function()
    {
        if ( xml.readyState == 4 && xml.status == 200 )
        {
            var text = xml.responseText;
            if ( !text ) text = '';
            handle( true, text, xml.status );
        }
        else if ( xml.readyState == 4 && xml.status > 200 ) handle( false, null, xml.status );
        
        finish();
    };
    
    return xml;
};