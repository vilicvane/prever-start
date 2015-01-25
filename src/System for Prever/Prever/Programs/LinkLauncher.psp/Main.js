/*
    Prever Link Launcher
    版本 1.0.0
    作者 Vilic Vane
    ©2009 ViCRiLoR v.O Studio
*/

function $L( annex )
{
    var _this = this;

    this.Start = function()
    {
        if ( !annex.AimFile )
        {
            _this.Dispose();
            return;
        }
        
        My.JSON.Get( annex.AimFile, handle );
        
        function handle( done, value )
        {
            if ( done )
            {
                var path = value.Path;
                var type = My.Path.GetExtension( path, value.IsFolder );
                System.FileSystem.Open( path, type, null, value.Annex );
            }
            _this.Dispose();
        }
    };
}
