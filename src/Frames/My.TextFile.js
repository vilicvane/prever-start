/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.TextFile = function( filePath, encoding )
{
    var _this = this;
    this.FileName = My.Path.GetFileName( filePath );
    this.Path = filePath;
    this.Encoding = encoding || {};
    this.Text = '';
    this.Read = function( handle )
    {
        var info =
        {
            Path: _this.Path,
            Encoding: _this.Encoding.Name
        };
        
        My.JSON.PostObject( 'Apps/TextFile/Read.ashx', 'info', info, jHandle );
        
        function jHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error )
                {
                    _this.Text = value.Text;
                    _this.Encoding = new My.Encoding( value.Encoding );
                    handle( true );
                }
                else handle( false, value.Error );
            }
            else handle( done );
        }
    };
    
    this.Save = function( handle )
    {
        handle = handle || function(){};
        
        var info =
        {
            Path: _this.Path,
            Encoding: _this.Encoding.Name,
            Text: _this.Text
        };
        
        My.JSON.PostObject( 'Apps/TextFile/Save.ashx', 'info', info, jHandle );
        
        function jHandle( done, value )
        {
            if ( done )
            {
                if ( !value.Error ) handle( true );
                else handle( false, value.Error );
            }
            else handle( done );
        }
    };
    
};