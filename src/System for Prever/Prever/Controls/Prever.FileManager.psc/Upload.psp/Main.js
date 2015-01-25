function $U( annex )
{
    var _this = this;
    
    //事件
    this.OnFinishUpload = function(){};
    
    var destDir = annex.AimDirectory || 'Disk:\\';
    
    var win = System.Window;
    var main, body;
    
    var mainHTML =
    '<div class="ButtonBox">' +
        '<div class="AddButton">添加文件</div>' +
        '<div class="UploadButton">开始上传</div>' +
    '</div>' +
    '<div class="FileList">' +
        '<div class="Title">文件列表</div>' +
        '<ul class="Items"></ul>' +
    '</div>' +
    '<div class="StatusBox"></div>';
    
    var files, paths, current;
    
    var fileItems, addBt, uploadBt, statusBox;
    
    this.Start = function()
    {
        var option = new win.Option();
    
        option.CreateTaskCard = true;
        option.Title = '文件上传';
        option.IconPath = 'Icons\\16.png';
        option.Width = 300;
        option.Height = 200;
        
        main = new win.Normal( _this, option );
        
        main.OnResize = resize;
        
        main.Resizer.MinWidth = 179;
        main.Resizer.MinHeight = 100;
        
        body = main.Body;
        
        body.innerHTML = mainHTML;
        
        var btBox = body.childNodes[ 0 ];
        fileItems = body.childNodes[ 1 ].childNodes[ 1 ];
        
        addBt = btBox.childNodes[ 0 ];
        uploadBt = btBox.childNodes[ 1 ];
        
        statusBox = body.childNodes[ 2 ];
        
        main.AddCSS( 'Main.css', init );
    };
    
    function init()
    {
        main.Initialize();
        reset();
    }
    
    function reset()
    {
        statusBox.innerHTML = '等待选择文件.';
        
        files = [];
        paths = [];
        
        if ( current )
        {
            if ( current.parentNode == addBt ) addBt.removeChild( current );
            current = null;
        }
        
        My.Element.RemoveAllChildren( fileItems );
        
        uploadBt.onclick = upload;
        
        createNew();
    }
    
    function upload()
    {
        if ( !files.length )
        {
            main.Message( '您尚未选择任何文件!' );
            return;
        }
        
        addBt.removeChild( current );
        uploadBt.onclick = function(){};
        
        var items = fileItems.childNodes;
        
        for ( var i = 0; i < items.length; i++ )
            items[ i ].childNodes[ 1 ].style.display = 'none';
        
        var amount = files.length;
        var finished = 0;
        resetStatus();
        
        My.FileSystem.Upload( files, destDir, handle, startHandle, finishHandle );
        
        function startHandle( i, bool )
        {
            items[ i ].className = 'Uploading';
        }
        
        function finishHandle( i, bool )
        {
            items[ i ].className = 'Finished';
            finished++;
            resetStatus();
        }
        
        function handle()
        {
            _this.OnFinishUpload();
            main.Message( '文件上传完毕!' );
            if ( annex.AutoDispose ) _this.Dispose();
            else reset();
        }
        
        function resetStatus()
        {
            statusBox.innerHTML = '正在上传文件,已完成 ' + finished + '/' + amount + '.';
        }
    }
    
    function createNew()
    {
        if ( current )
        {
            var path = current.value;
            var file = current;
            
            if ( !path ) return;
            
            addBt.removeChild( file );
            
            if ( paths.Contains( path ) )
            {
                main.Message( { Text: '该文件已经被添加到列表中,请勿重复添加!', Type: 'Error' } );
                current = null;
                createNew();
                return;
            }
            
            var index = paths.length;
            
            paths.push( path );
            files.push( file );
            
            //创建列表项
            
            var li = document.createElement( 'LI' );
            li.className = 'Waiting';
            
            var textDiv = document.createElement( 'DIV' );
            textDiv.className = 'FileName';
            
            var delBt = document.createElement( 'DIV' );
            delBt.innerHTML = '删除';
            delBt.className = 'Delete';
            
            delBt.onclick = function()
            {
                paths.RemoveByValue( path );
                files.RemoveByValue( file );
                fileItems.removeChild( li );
                resetStatus();
            };
            
            li.appendChild( textDiv );
            li.appendChild( delBt );
            li.title = path;
            
            fileItems.appendChild( li );
            
            textDiv.innerHTML = My.Path.GetFileName( path );
            resetStatus();
            
        }
        
        var nFile = createFile();
        nFile.onchange = createNew;
        current = nFile;
        addBt.appendChild( nFile );
        
        function resetStatus()
        {
            var amount = files.length
            statusBox.innerHTML = amount ? '已选择了 ' + amount + ' 个文件.' : '等待选择文件.';
        }
    }
    
    function createFile()
    {
        var file = document.createElement( 'INPUT' );
        file.type = 'file';
        file.name = 'File';
        return file;
    }
    
    function resize()
    {
        fileItems.style.height = body.clientHeight - 80 + 'px';
    }
}