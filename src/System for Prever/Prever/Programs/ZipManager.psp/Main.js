/*
    Prever Zip Manager
    版本 1.0.0
    作者 Vilic Vane
    ©2009 ViCRiLoR v.O Studio
*/

function $Z( annex )
{
    var _this = this;
    
    var win = System.Window;
    
    var openType = annex.OpenType;
    var aimFile = annex.AimFile;
    var fileManager = annex.FileManager;
    
    var main, body;
    
    this.Start = function()
    {
        if ( aimFile == null )
        {
            _this.Dispose();
            return;
        }
        
        var option = new win.Option();
        option.Title = 'ZIP文件管理器';
        option.IconPath = 'Icons\\16.png';
        option.Width = 200;
        option.Height = 50;
        
        main = new win.Elementary( _this, option );
        body = main.Body;
        body.innerHTML = '<div class="Main">正在解压文件,请稍等...</div>';
        
        main.AddCSS( 'Main.css', init );
    };
    
    function init()
    {
        var dest = My.Path.GetDirectoryName( aimFile ) + My.Path.GetFileName( aimFile, true );
        
        if ( openType ) unzip();
        else main.Input( { Title: '解压到', Text: '请输入目标目录', Value: dest, Width: 300 }, input );
        
        function input( text )
        {
            if ( text )
            {
                dest = My.Path.Normalize( text );
                unzip();
            }
            else _this.Dispose();
        }
        
        function unzip()
        {
            main.Initialize();
            My.FileSystem.Unzip( aimFile, dest, handle );
        }
        
        function handle( done, vDest )
        {
            if ( fileManager ) fileManager.Refresh();
            if ( done )
            {
                dest = vDest;
                
                var str =
                '<div style="text-indent: 0px;">文件已被成功解压到目录:<br />' +
                dest +
                '<br />是否立即打开?</div>';
                
                main.Message( { Text: str, Type: 'Confirm', Yes: '打开所在文件夹' }, confirm );
            }
            else main.Message( { Text: '解压过程中出现问题,解压文件失败.', Type: 'Error' }, _this.Dispose );
        }
        
        function confirm( bool )
        {
            if ( bool ) System.FileSystem.Open( dest, '#' );
            _this.Dispose();
        }
    }
}