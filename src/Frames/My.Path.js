/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.Path = {};

My.Path.Normalize = function( path, endWithDiagonal )
{
    path = path.Trim().Replace( '/', '\\', 'g' ).Replace( '\\\\', '\\', 'g' );
    if ( !endWithDiagonal )
        path = path.TrimEnd( '\\' );
    else if ( !path.EndsWith( '\\') )
        path += '\\';
    return path;
};

My.Path.IsFileName = function( name )
{
    var re = /^[^<>\/\\\|:"\*\?]{1,255}$/;
    return re.test( name );
};

My.Path.GetFileName = function( path, withoutExt )
{
    var fileName = path.substr( My.Path.Normalize( path ).lastIndexOf( '\\' ) + 1 );
    if ( withoutExt && fileName.Contains( '.' ) ) fileName = fileName.Left( fileName.indexOf( '.' ) );
    return fileName;
};

My.Path.GetFolderName = function( path )
{
    path = My.Path.Normalize( path );
    if ( path.EndsWith( '\\' ) ) path = path.Left( path.length - 1 );
    return My.Path.GetFileName( path );
};

My.Path.GetDirectoryName = function( path )
{
    var dir = My.Path.Normalize( path );
    if ( dir.EndsWith( '\\' ) )
        dir = dir.Left( dir.length - 1 );
    var index = dir.lastIndexOf( '\\' ) + 1;
    dir = dir.Left( index );
    return dir;
};

My.Path.IsAbsolute = function( path )
{
    path = My.Path.Normalize( path );
    var re = /^\w+:/i;
    return re.test( path );
};

My.Path.GetAbsolutePath = function( path, parent )
{
    if ( My.Path.IsAbsolute( path ) ) return path;
    
    parent = My.Path.Normalize( parent );
    path = My.Path.Normalize( path );
    
    if ( !parent.EndsWith( '\\' ) ) parent += '\\';
    
    return parent + path;
};

My.Path.GetURL = function( path, contentType, clearBuffer )
{
    if ( !My.Path.IsAbsolute( path ) ) return path;
        
    var url = 'Apps/FileTrasmit.ashx?path=' + My.Path.Normalize( path ).Escape();
    
    if ( contentType )
        url += '&contenttype=' + contentType.Escape();
    
    if ( clearBuffer )
        url += '&rnd=' + My.String.GetRandomString();
    
    url += '&dna=' + System.LoadDNA;
    
    return url;
};

My.Path.GetThumbnailURL = function( path, width, height, save )
{
    return 'Apps/' + ( save ? 'Control' : 'Path' ) + '/Thumbnail.ashx?path=' + path.Escape() + '&width=' + width + '&height=' + height;
}

My.Path.GetDownloadURL = function( path )
{
    if ( !My.Path.IsAbsolute( path ) ) return path;
    
    var url = 'Apps/FileTrasmit.ashx?path=' + My.Path.Normalize( path ).Escape() + '&download=true';
    return url;
};

My.Path.GetExtension = function( path, isFolder )
{
    var name = My.Path.GetFileName( path );
    var index = name.lastIndexOf( '.' ) + 1;
    
    var ext;
    
    if ( index <= 0 ) ext = '';
    else ext = name.substr( index ).toLowerCase();
    
    ext = ( isFolder ? '#' : '.' ) + ext;
    return ext;
};

My.Path.GetRoot = function( path )
{
    path = My.Path.Normalize( path, true );
    return path.Left( path.indexOf( '\\' ) + 1 );
};

My.Path.GetDesktopPath = function()
{
    return 'System:\\Prever\\Users\\' + User.ID + '\\Desktop\\';
};