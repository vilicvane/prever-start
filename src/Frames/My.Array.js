/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.Array = {};

Array.prototype.RemoveByIndex = function( indexs )
{
    var idxs;
    if ( typeof indexs != typeof [] ) idxs = [ indexs ];
    else
    {
        idxs = [];
        for ( var i = 0; i < indexs.length; i++ )
            idxs[ i ] = indexs[ i ];
        idxs.sort( compare );
    };
    
    
    for ( var i = 0; i < idxs.length; i++ )
    {
        idxs[ i ] -= i;
        this.splice( idxs[ i ], 1 );
    }
    
    return this;
    
    function compare( a, b ){ return a - b; }
}

Array.prototype.RemoveByValue = function( value, onlyOne )
{
    this;
    var index = [];
    if ( onlyOne )
        for ( var i = 0; i < this.length; i++ )
        {
            if ( this[ i ] === value ) index.push( i );
            break;
        }
    else
        for ( var i = 0; i < this.length; i++ )
            if ( this[ i ] === value ) index.push( i );
    
    this.RemoveByIndex( index );
    
    return this;
}

Array.prototype.RemoveEmpty = function()
{
    var index = [];
    for ( var i = 0; i < this.length; i++ )
        if ( this[ i ] == undifined ) index.push( i );
        
    this.RemoveByIndex( index );
    
    return this;
}

Array.prototype.Clone = function()
{
    var n = [];
    
    var s = this.constructor;
    for ( var i in this )
        if ( !s[ i ] )
        {
            if ( this[ i ] != null && typeof this[ i ] == typeof [] )
                n[ i ] = this[ i ].Clone();
            else n[ i ] = this[ i ];
        }
    
    return n;
};

Array.prototype.DisposeVariable = function()
{
    var s = this.constructor;
    for ( var i in this )
        if ( !s[ i ] )
        {
            if ( this[ i ] != null && typeof this[ i ] == typeof [] ) this[ i ].DisposeVariable();
            else this[ i ] = null;
            
            delete this[ i ];
        }
};

Array.prototype.Clear = function()
{
    this.splice( 0, this.length );
};

Array.prototype.Append = function( arr )
{
    for ( var i = 0; i < arr.length; i++ )
        this.push( arr[ i ] );
};

Array.prototype.Fill = function( value, len )
{
    for ( var i = 0; i < len; i++ )
        this[ i ] = value;
    return this;
};

Array.prototype.Contains = function( value )
{
    for ( var i = 0; i < this.length; i++ )
        if ( this[ i ] === value ) return true;
    
    return false;
};