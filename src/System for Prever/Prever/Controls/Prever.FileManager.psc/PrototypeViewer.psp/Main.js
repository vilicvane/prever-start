function $P( annex )
{
    var _this = this;
    var win = System.Window;
    var main, body;
    
    var mainHTML =
    '<div class="ItemBox">' +
        '<div class="Icon"></div>' +
        '<div class="BasicInfo">' +
            '<input type="text" readonly />' +
            '<div></div>' +
        '</div>' +
        '<div class="OpenBox"><button>打开方式</button></div>' +
    '</div>' +
    '<div class="DetailBox"></div>' +
    '<div class="ButtonBox"><button>关闭</button></div>';
    
    var itemBox;
    var icon, basicInfo, openBt;
    var nameBox, typeBox;
    
    var detailBox;
    
    var aimPath, isFolder;
    
    this.Start = function()
    {
        var option = new win.Option();
    
        option.CreateTaskCard = false;
        option.Title = '属性';
        option.IconPath = 'Icons\\16.png';
        option.Width = 300;
        option.Height = 300;
        option.Order = win.Order.AlwaysTop;
        
        main = new win.Popup( _this, option );
        body = main.Body;
        main.AddCSS( 'Main.css', init );
        
        body.innerHTML = mainHTML;
        
        var bChs = body.childNodes;
        
        itemBox = bChs[ 0 ];
        detailBox = bChs[ 1 ];
        
        var iChs = itemBox.childNodes;
        icon = iChs[ 0 ];
        basicInfo = iChs[ 1 ];
        
        nameBox = basicInfo.childNodes[ 0 ];
        typeBox = basicInfo.childNodes[ 1 ];
        
        openBt = iChs[ 2 ].childNodes[ 0 ];
        openBt.disabled = true;
        
        var clsBt = bChs[ 2 ].childNodes[ 0 ];
        clsBt.onclick = function()
        {
            _this.Dispose();
        }
    };
    
    function init()
    {
        main.Initialize();
        
        if ( annex.AimFile )
        {
            aimPath = annex.AimFile;
            isFolder = false;
        } 
        else if ( annex.AimDirectory )
        {
            aimPath = annex.AimDirectory;
            isFolder = true;
        }
        else
        {
            _this.Dispose();
            return;
        }
        
        aimPath = My.Path.Normalize( aimPath );
        
        var type = My.Path.GetExtension( aimPath, isFolder );
        var name = My.Path.GetFileName( aimPath );
        
        icon.style.backgroundImage = 'url(' + My.Path.GetURL( My.FileSystem.GetIconPath( type ) ) + ')';
        nameBox.value = name;
        typeBox.innerHTML = '类型: ' + type.substr( 1 ).toUpperCase() + ( isFolder ? '文件夹' : '文件' );
        
        load();
    }
    
    function load()
    {
        detailBox.innerHTML =
        '<div class="Group">' +
            '<div><span>虚拟目录: </span><input type="text" readonly /></div>' +
            '<div><span>实际目录: </span><input type="text" readonly /></div>' +
            '<div></div>' +
        '</div>' +
        '<div class="Group"></div>' +
        '<div class="Group"></div>';
        
        var chs = detailBox.childNodes;
        
        var g1 = chs[ 0 ];
        var g2 = chs[ 1 ];
        var g3 = chs[ 2 ];
        
        var vDir = g1.childNodes[ 0 ].childNodes[ 1 ];
        var fDir = g1.childNodes[ 1 ].childNodes[ 1 ];
        var inner = g1.childNodes[ 2 ];
        
        var cl;
        if ( isFolder ) cl = My.Directory;
        else cl = My.File;
        
        var obj = new cl( aimPath );
        obj.GetDetails( handle );
        function handle( done )
        {
            if ( done )
            {
                detailBox.style.display = 'block';
                
                vDir.value = My.Path.GetDirectoryName( aimPath );
                fDir.value = My.Path.GetDirectoryName( obj.FactualPath );
                
                if ( isFolder ) inner.innerHTML = '包含 ' + obj.InnerFilesAmount + ' 个文件和 ' + obj.InnerDirsAmount + ' 个文件夹.';
                else
                {
                    var length = obj.Length;
                    var lStr = My.FileSystem.ConvertSize( length );
                    var aStr = length + 'Byte';
                    if ( aStr != lStr )
                        lStr += '(' + aStr + ')';
                    inner.innerHTML = '文件大小: ' + lStr;
                }
                g2.innerHTML =
                '创建时间: ' + obj.CreationTime +
                '<br />修改时间: ' + obj.LastWriteTime +
                '<br />访问时间: ' + obj.LastAccessTime;
                
                var attr = [];
                var attrStr = obj.Attributes.toLowerCase();
                
                if ( attrStr.Contains( 'hidden' ) ) attr.push( '隐藏' );
                if ( attrStr.Contains( 'readonly' ) ) attr.push( '只读' );
                
                if ( !attr.length ) attr[ 0 ] = '无';
                
                g3.innerHTML = '　　属性: ' + attr.join( ' ' );
            }
        }
    }
}