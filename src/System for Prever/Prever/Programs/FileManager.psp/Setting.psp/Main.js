function $S( annex )
{
    /*
        annex
        
        HostWindow
        FileManager (psc)
    */

    var _this = this;

    var main, body;
    var hostWindow = annex.HostWindow;
    
    var config = new My.Config( My.Path.GetDirectoryName( _this.Path ) + 'Config.pcd' );
    var cValue;
    
    this.Start = function()
    {
        config.Read( init );
    };
    
    function init()
    {
        var win = System.Window;
        
        cValue = config.Value;
        checkConfig();
        
        option = new win.Option();
    
        option.Title = '文件浏览器设置';
        option.IconPath = '..\\Icons\\16.png';
        option.Width = 300;
        option.Height = 136;
        
        main = new win.Popup( _this, option );
        
        if ( hostWindow ) hostWindow.AddFocusHijack( main );
        
        body = main.Body;
        
        body.innerHTML =
        '<div class="Config">' +
            '<div>' +
                '<span>默认路径: </span>' +
                '<input type="text" />' +
                '<a href="javascript:;">默认</a>' +
            '</div>' +
            '<div>' +
                '<span>默认显示: </span>' +
                '<select>' +
                    '<option value="Thumbnail">缩略图</option>' +
                    '<option value="Normal">图标</option>' +
                    '<option value="List">列表</option>' +
                '</select>' +
            '</div>' +
            '<div><span>显示隐藏文件和文件夹:　</span><span></span><a href="javascript:;">更改</a></div>' +
        '</div>' +
        '<div class="ConfigBtBox"><button>保存</button><button>取消</button></div>';
        
        var cMainChs = body.childNodes[ 0 ].childNodes;
        var dPathBoxChs = cMainChs[ 0 ].childNodes;
        var pathInput = dPathBoxChs[ 1 ];
        var setDBt = dPathBoxChs[ 2 ];
        
        pathInput.value = cValue.DefaultPath;
        setDBt.onclick = function(){ pathInput.value = 'Disk:\\'; };
        
        var selectBox = cMainChs[ 1 ].childNodes[ 1 ];
        selectBox.value = cValue.DefaultViewMode;
        
        var showHideBoxChs = cMainChs[ 2 ].childNodes;
        var showHideSpan = showHideBoxChs[ 1 ];
        var showHideBt = showHideBoxChs[ 2 ];
        
        var sH = cValue.ShowHidden;
        showHideSpan.innerHTML = sH ? '显示' : '隐藏';
        showHideBt.onclick = changeSH;
        
        var btBoxChs = body.childNodes[ 1 ].childNodes;
        var saveBt = btBoxChs[ 0 ];
        var cancelBt = btBoxChs[ 1 ];
        
        saveBt.onclick = save;
        cancelBt.onclick = main.Dispose;
        
        function changeSH()
        {
            sH = !sH;
            showHideSpan.innerHTML = sH ? '显示' : '隐藏';
        }
        
        if ( hostWindow ) 
            main.OnDispose = function()
            {
                hostWindow.RemoveFocusHijack( main );
            };
        
        main.AddCSS( 'Main.css', main.Initialize );
        
        function save()
        {
            cValue.DefaultPath = My.Path.Normalize( pathInput.value, true );
            cValue.DefaultViewMode = selectBox.value;
            
            if ( cValue.ShowHidden != sH )
            {
                cValue.ShowHidden = sH;
                if ( annex.FileManager ) annex.FileManager.SetShowHidden( sH );
            }
            
            config.Save();
            
            main.Dispose();
        }
        
        function checkConfig()
        {
            var v = My.Variable;
            cValue.DefaultPath = v( cValue.DefaultPath, 'Disk:\\' );
            cValue.DefaultViewMode = v( cValue.DefaultViewMode, 'normal' );
            cValue.ShowHidden = v( cValue.ShowHidden, false );
        }
    }
}