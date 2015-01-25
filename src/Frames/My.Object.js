/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.Object = {};

Object.prototype.Clone = function()
{
    var n = {};
    
    var s = this.constructor;
    for ( var i in this )
        if ( !s[ i ] )
        {
            if ( this[ i ] != null && typeof this[ i ] == typeof {} )
                n[ i ] = this[ i ].Clone();
            else n[ i ] = this[ i ];
        }
    
    return n;
};

Object.prototype.DisposeVariable = function()
{
    var s = this.constructor || [];
    for ( var i in this )
        if ( !s[ i ] )
        {
            if ( this[ i ] != null && typeof this[ i ] == typeof {} ) this[ i ].DisposeVariable();
            else this[ i ] = null;
            
            delete this[ i ];
        }
};

Object.prototype.ToJSON = function()
{
    return JSON.stringify( this );
};

My.Object.CopyPrototype = function( from, to, overwrite )
{
    for ( var i in from )
        if ( overwrite || !to[ i ] )
            to[ i ] = from[ i ];
};