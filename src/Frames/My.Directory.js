/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.Directory = function( path )
{
    var _this = this;
    
    this.Name = '';
    this.Path = '';
    
    this.Files = [];
    this.Directories = [];
    
    this.SetPath = function( path )
    {
        path = My.Path.Normalize( path );
        
        _this.Name = My.Path.GetFileName( path );
        _this.Path = path
        _this.Files = [];
        _this.Directories = [];
    };
    
    this.GetDirectories = function( handle, showHidden )
    {
        My.JSON.Post( 'Apps/Directory/GetInfo.ashx', 'dir=' + _this.Path.Escape() + '&type=0&showhidden=' + ( showHidden ? 'true': 'false' ), xmlHandle );
        function xmlHandle( done, value )
        {
            if ( done )
            {
                if ( value.Error )
                {
                    _this.Directories = [];
                    handle( false, value.Error );
                }
                else
                {
                    _this.Directories = value.Directories;
                    handle( true );
                }
            }
            else handle( false );
        }
    };
    
    this.GetFiles = function( handle, showHidden, regExp )
    {
        My.JSON.Post( 'Apps/Directory/GetInfo.ashx', 'dir=' + _this.Path.Escape() + ( regExp ? '&re=' + regExp.Escape() : '' ) + '&type=1&showhidden=' + ( showHidden ? 'true': 'false' ), xmlHandle );
        function xmlHandle( done, value )
        {
            if ( done )
            {
                if ( value.Error )
                {
                    _this.Files = [];
                    handle( false, value.Error );
                }
                else
                {
                    _this.Files = value.Files;
                    handle( true );
                }
            }
            else handle( false, value );
        }
    };
    
    this.GetDirsAndFiles = function( handle, showHidden, regExp )
    {
        My.JSON.Post( 'Apps/Directory/GetInfo.ashx', 'dir=' + _this.Path.Escape() + ( regExp ? '&re=' + regExp.Escape() : '' ) + '&type=2&showhidden=' + ( showHidden ? 'true': 'false' ), xmlHandle );
        function xmlHandle( done, value )
        {
            if ( done )
            {
                if ( value.Error )
                {
                    _this.Directories = [];
                    _this.Files = [];
                    handle( false, value.Error );
                }
                else
                {
                    _this.Directories = value.Directories;
                    _this.Files = value.Files;
                    handle( true );
                }
            }
            else handle( false, value );
        }
    };
    
    this.GetDetails = function( handle )
    {
        My.JSON.Post( 'Apps/Directory/GetDetails.ashx', 'path=' + _this.Path.Escape(), jHandle );
        function jHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error )
                {
                    var ps = [ 'InnerFilesAmount', 'InnerDirsAmount', 'FactualPath', 'CreationTime', 'LastWriteTime', 'LastAccessTime', 'Attributes' ];
                    
                    for ( var i = 0; i < ps.length; i++ )
                    {
                        var p = ps[ i ];
                        _this[ p ] = value[ p ];
                    }
                    handle( true );
                }
                else handle( false, value.Error );
            }
            else handle( false );
        }
    };
    
    if ( path ) this.SetPath( path );
};