/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.String = {};

String.prototype.Escape = function()
{
    return encodeURIComponent( this );
};

String.prototype.Exist = function( str )
{
    return this.indexOf( str ) > -1;
};

String.prototype.Trim = function( aimStr )
{
    var str = this;
    var re = My.RegExp.InvolvedCharsRegExp;
    var reStart, reEnd;
    if ( aimStr )
    {
        aimStr = aimStr.replace( re, '\\$1' );
        reStart = new RegExp( '^(' + aimStr + ')+' );
        reEnd = new RegExp( '(' + aimStr + ')+$' );
    }
    else
    { 
        reStart = /^\s+/;
        reEnd = /\s+$/;
    }
    str = str.replace( reStart, '' ).replace( reEnd, '' );
    return str;
};

String.prototype.TrimEnd = function( aimStr )
{
    var str = this;
    var re = My.RegExp.InvolvedCharsRegExp;
    var reEnd;
    if ( aimStr )
    {
        aimStr = aimStr.replace( re, '\\$1' );
        reEnd = new RegExp( '(' + aimStr + ')+$' );
    }
    else reEnd = /\s+$/;
    str = str.replace( reEnd, '' );
    return str;
};

String.prototype.TrimStart = function( aimStr )
{
    var str = this;
    var re = My.RegExp.InvolvedCharsRegExp;
    var reStart;
    if ( aimStr )
    {
        aimStr = aimStr.replace( re, '\\$1' );
        reStart = new RegExp( '^(' + aimStr + ')+' );
    }
    else reStart = /^\s+/;
    str = str.replace( reStart, '' );
    return str;
};

String.prototype.Replace = function( find, replace, option )
{
    var re = My.RegExp.InvolvedCharsRegExp;
    find = find.replace( re, '\\$1' );
    var findRe = new RegExp( find, option );
    return this.replace( findRe, replace );
};

String.prototype.StartsWith = function( str )
{
    return this.indexOf( str ) == 0;
};

String.prototype.EndsWith = function( str )
{
    return this.lastIndexOf( str ) == this.length - str.length;
};

String.prototype.Left = function( l )
{
    return this.substr( 0, l );
};

String.prototype.Right = function( l )
{
    return this.substr( this.length - l, l );
};

String.prototype.ToObject = function()
{
    return eval( '(' + this + ')' );
};

String.prototype.Contains = function( str )
{
    return this.indexOf( str ) > -1;
};

My.String.GetRandomString = function( length )
{
    length = length || 8;
    var str = '';
    var strSource = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split( '' );
    for ( var i = 0; i < length; i++ )
        str += strSource[ Math.floor( Math.random() * 62 ) ];
    return str;
};