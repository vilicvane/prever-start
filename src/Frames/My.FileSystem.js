/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.FileSystem = new function()
{
    var _this = this;


    this.GetIconPath = function( type, small )
    {
        var fS = System.FileSystem;
        var path = small ? fS.SmallIconRootPath : fS.IconRootPath;
        if ( fS.Icons[ type ] )
            path += fS.Icons[ type ];
        else path += fS.Icons[ type.Left( 1 ) ];
        return path;
    };

    this.Delete = function( files, dirs, handle )
    {
        var info = { Files: files || [], Directories: dirs || [] };
        My.JSON.PostObject( 'Apps/FileSystem/Delete.ashx', 'info', info, dHandle );
        function dHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error )
                    handle( true );
                else handle( false, value.Error );
            }
            else handle( false );
        }
    };
    
    this.Copy = function( src, dest, cover, handle )
    {
        var c = 0;
        if ( cover ) c = 1;
        else if ( cover == false ) c = -1;
        
        var info = { SrcPath: src, DestPath: dest, Cover: c };
        My.JSON.PostObject( 'Apps/FileSystem/Copy.ashx', 'info', info, cHandle );
        function cHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error )
                    handle( true );
                else handle( false, value.Error );
            }
            else handle( false );
        }
    };
    
    this.LotSizeCopy = function( files, dirs, to, cover, handle )
    {
        var c = 0;
        if ( cover ) c = 1;
        else if ( cover == false ) c = -1;
        
        var info = { Files: files || [], Directories: dirs || [], To: to, Cover: c };
        My.JSON.PostObject( 'Apps/FileSystem/LotSizeCopy.ashx', 'info', info, cHandle );
        function cHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error )
                    handle( true );
                else handle( false, value.Error );
            }
            else handle( false );
        }
    };
    
    this.LotSizeMove = function( files, dirs, to, cover, handle )
    {
        var c = 0;
        if ( cover ) c = 1;
        else if ( cover == false ) c = -1;
        
        var info = { Files: files || [], Directories: dirs || [], To: to, Cover: c };
        My.JSON.PostObject( 'Apps/FileSystem/LotSizeMove.ashx', 'info', info, cHandle );
        function cHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error )
                    handle( true );
                else handle( false, value.Error );
            }
            else handle( false );
        }
    };
    
    this.Move = function( srcPath, destPath, isFolder, handle )
    {
        var info = { SrcPath: srcPath, DestPath: destPath, IsFolder: isFolder };
        My.JSON.PostObject( 'Apps/FileSystem/Move.ashx', 'info', info, cHandle );
        function cHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error )
                    handle( true );
                else handle( false, value.Error );
            }
            else handle( false );
        }
    };
    
    this.CreateDirectory = function( dir, handle )
    {
        dir = My.Path.Normalize( dir );
        var info = { Directory: dir };
        My.JSON.PostObject( 'Apps/FileSystem/CreateDirectory.ashx', 'info', info, jHandle );
        function jHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error )
                    handle( true );
                else handle( false, value.Error );
            }
            else handle( false );
        }
    };
    
    this.GetAvailableName = function( dir, name, handle )
    {
        dir = My.Path.Normalize( dir, true );
        var info = { Directory: dir, Name: name };
        My.JSON.PostObject( 'Apps/FileSystem/GetAvailableName.ashx', 'info', info, jHandle );
        function jHandle( done, value )
        {
            if ( done && !value.Error ) handle( value.Name );
            else handle( null );
        }
    };
    
    this.ConvertSize = function( size )
    {
        var sizeMark = [ 'Byte', 'KB', 'MB', 'GB' ];

        var now = 0;
        while ( size > 1024 && now < 3 )
        {
            size = Math.floor( size * 10 / 1024 ) / 10;
            now++;
        }
        return size + sizeMark[ now ];
    };
    
    this.Upload = function( inputs, destDir, handle, startHandle, finishHandle, max )
    {
        //构建环境
        var area = System.Element.ControlArea;
        
        var iframeArea = document.createElement( 'DIV' );
        var formArea = document.createElement( 'FORM' );
        
        area.appendChild( formArea );
        area.appendChild( iframeArea );
        
        //关键代码
        var amount = inputs.length; //文件总数
        var started = 0; //已开始的文件数量
        var finished = 0; //已完成的文件数量
        
        if ( !max ) max = 1;
        max -= 1;
        
        if ( !handle ) handle = function(){};
        if ( !startHandle ) startHandle = function(){};
        if ( !finishHandle ) finishHandle = function(){};
        
        while( uploadNext() );
        
        function uploadNext()
        {
            if ( started - finished > max || started >= amount ) return false;
            
            var nStarted = started++;
            
            var target = 'FileSystem_Upload_' + My.String.GetRandomString();
            
            var form = document.createElement( 'FORM' );
            form.target = target;
            form.method = 'post';
            form.action = 'Apps/FileSystem/Upload.ashx';
            form.encoding = 'multipart/form-data';
            
            var dirInput = document.createElement( 'INPUT' );
            dirInput.name = 'destDir';
            dirInput.value = destDir;
            
            form.appendChild( inputs[ nStarted ] ); //添加文件
            form.appendChild( dirInput ); //添加目标目录
            
            formArea.appendChild( form );
        
            var iframe = My.Element.CreateByHTML( '<iframe name="' + target + '"></iframe>' );
            var ready = false;
            
            iframeArea.appendChild( iframe );
            
            iframe.onreadystatechange = function()
            {
                if ( iframe.readyState == 'complete' )
                {
                    if ( ready ) finishOne();
                    else ready = true;
                }
            };
            
            iframe.onload = finishOne;
            
            startHandle( nStarted );
            
            setTimeout( upload, 0 );
            
            return true;
            
            function upload()
            {
                form.submit();
            }
            
            function finishOne()
            {
                //移除上传用的元素
                setTimeout( remove, 0 );
                
                finished++;
                uploadNext();
                
                finishHandle( nStarted );
                if ( finished == amount )
                {
                    handle();
                    setTimeout( dispose, 0 );
                }
                
                function remove()
                {
                    iframeArea.removeChild( iframe );
                    formArea.removeChild( form );
                }
            }
        }
        
        function dispose()
        {
            area.removeChild( formArea );
            area.removeChild( iframeArea );
        }
    
    };
    
    this.CreateLinkFile = function( src, dest, isFolder, handle )
    {
        var type = My.Path.GetExtension( src, isFolder );
        
        if ( type == '.lnk' )
        {
            _this.Copy( src, dest, null, handle );
            return;
        }
        
        var info =
        {
            Path: src,
            IsFolder: isFolder
        };
        
        if ( type == '#psp' ) My.JSON.Get( src + '\\Icon.pcd', iconDeal, true );
        else create();
        
        function iconDeal( done, value )
        {
            if ( done )
            {
                info.Icon = My.Path.GetAbsolutePath( value.Icon, src );
                info.SmallIcon = My.Path.GetAbsolutePath( value.SmallIcon, src );
            }
            create();
        }
        
        function create()
        {
            var dir = My.Path.GetDirectoryName( dest );
            var name = My.Path.GetFileName( dest, true ) + '.lnk';
            
            _this.GetAvailableName( dir, name, next );
            
            function next( aName )
            {
                var config = new My.Config( dir + aName );
                config.Value = info;
                config.Save( handle );
            }
        }
        
    };
    
    this.Unzip = function( path, dest, handle )
    {
        var info =
        {
            SrcPath: path,
            DestPath: dest
        };
        
        My.JSON.PostObject( 'Apps/FileSystem/Unzip.ashx', 'info', info, jHandle );
        
        function jHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error )
                    handle( true, value.DestPath );
                else handle( false, value.Error );
            }
            else handle( false );
        }
    };
}();

My.FileSystem.LinkFile = new function()
{
    this.GetIconPath = function( path, handle, isSmall )
    {
        var config = new My.Config( path );
        config.Read( cHandle );
        
        function cHandle( done )
        {
            if ( done ) finish();
            else handle( null );
        }
        
        function finish()
        {
            var value = config.Value;
            var dir = My.Path.GetDirectoryName( path );
            if ( !isSmall )
            {
                if ( value.Icon )
                {
                    handle( My.Path.GetAbsolutePath( value.Icon, dir ) );
                    return;
                }
            }
            if ( value.SmallIcon )
            {
                handle( My.Path.GetAbsolutePath( value.SmallIcon, dir ) );
                return;
            }
            if ( value.Path )
            {
                var p = value.Path;
                var type = My.Path.GetExtension( p, value.IsFolder );
                handle( My.FileSystem.GetIconPath( type, isSmall ) );
                return;
            }
            
            handle( null );
        }
    };
}();

My.FileSystem.PSPFolder = new function()
{
    this.GetIconPath = function( path, handle, isSmall )
    {
        path = My.Path.Normalize( path );
        My.FileSystem.LinkFile.GetIconPath( path + '\\Icon.pcd', handle, isSmall );
    };
}();

My.FileSystem.File = function( name, dir, size, hidden, lastWrite )
{
    var p = My.Path;
    var path;
    
    if ( dir )
    {
        dir = p.Normalize( dir, true );
        path = dir + name;
    }
    else path = name;
    
    this.Path = path;
    this.Name = p.GetFileName( path );
    this.Directory = p.GetDirectoryName( path );
    this.Type = p.GetExtension( path, false );
    
    this.Size = size;
    this.Hidden = hidden;
    this.LastWriteTime = lastWrite;
    
    this.IsFolder = false;
    this.BaseType = '.';
};

My.FileSystem.Folder = function( name, dir, hidden, lastWrite )
{
    var p = My.Path;
    var path;
    
    if ( dir )
    {
        dir = p.Normalize( dir, true );
        path = dir + name;
    }
    else path = name;
    
    this.Path = path;
    this.Name = p.GetFolderName( path );
    this.Directory = p.GetDirectoryName( path );
    this.Type = p.GetExtension( path, true );
    
    this.Hidden = hidden;
    this.LastWriteTime = lastWrite;
    
    this.IsFolder = true;
    this.BaseType = '#';
};
