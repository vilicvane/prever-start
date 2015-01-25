/*(C)2007-2009 ViCRiLoR v.O Studio*/

System.Clipboard = new function()
{
    var cType = '';
    var cData = null;
    this.SetData = function( data, type )
    {
        cData = data;
        cType = type || typeof data;
    };
    this.GetData = function( type )
    {
        if ( cType == type ) return cData;
        else return null;
    };
}();