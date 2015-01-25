document.oncontextmenu = function( ev )
{
    var e = ev || event;
    e.returnValue = false;
    return false;
};

var System = {};
var My = {};

System.Element =
{
    LoadingBar: document.getElementById( 'LoadingBar' ),
    Window: document.getElementById( 'Window' ),
    Taskbar: document.getElementById( 'Taskbar' ),

    PreverButton: document.getElementById( 'PreverButton' ),
    TaskLeftButton: document.getElementById( 'TaskLeftButton' ),
    TaskRightButton: document.getElementById( 'TaskRightButton' ),
    QuickMenuButton: document.getElementById( 'QuickMenuButton' ),
    InformationBox: document.getElementById( 'InformationBox' ),

    TaskBox: document.getElementById( 'TaskBox' ),
    TaskCardBox: document.getElementById( 'TaskCardBox' ),
    ControlArea: document.getElementById( 'ControlArea' ),
    ScriptArea: document.getElementById( 'ScriptArea' ),
    CSSArea: document.getElementById( 'CSSArea' )
};

System.LoadDNA = Math.floor( Math.random() * 99999999 ).toString();
System.Script = {};
System.Script.Add = function( url, handle, processHandle )
{
    var scriptIndex = 0;
    var scriptAmount = url.length;
    var scripts = [];
    
    var myXml = XMLResponse( url[ scriptIndex++ ] );
    
    function XMLResponse( url )
    {
        var xml;
        if ( window.XMLHttpRequest )
            xml = new XMLHttpRequest();
        else
            xml = new ActiveXObject( 'MSXML2.XMLHTTP' );
        
        xml.open( 'GET', url, true );
        xml.send( null );
        
        xml.onreadystatechange = function()
        {
            if ( xml.readyState == 4 && xml.status == 200 ) loadNext( true, xml.status );
            else if ( xml.readyState == 4 && xml.status > 200 ) loadNext( false, xml.status );
        };
        
        return xml;
    };

    
    function loadNext( done )
    {
        if ( done )
        {
            scripts.push( myXml.responseText );
            if ( processHandle ) processHandle( scriptIndex, scriptAmount );
            if (  scriptIndex == scriptAmount )
            {
                finishLoad(); //如果加载错误或者加载完毕则调用FinishLoad结束加载.
                handle( true );
                return;
            }
            myXml = XMLResponse( url[ scriptIndex++ ] );
        }
        else
        {
            handle( false );
            return;
        }
    }
    
    function finishLoad()
    {
        var scriptBox = [];
        for ( i in scripts )
        {
            scriptBox[ i ] = document.createElement( 'SCRIPT' );
            scriptBox[ i ].type = 'text/javascript';
            scriptBox[ i ].defer = true;
            scriptBox[ i ].text = scripts[ i ];
            System.Element.ScriptArea.appendChild( scriptBox[ i ] );
        }
    }
};

System.ScriptList =
[
    'Frames/JSON.js',
    'Frames/My.Array.js',
    'Frames/My.Config.js',
    'Frames/My.Control.js',
    'Frames/My.Directory.js',
    'Frames/My.Element.js',
    'Frames/My.Encoding.js',
    'Frames/My.Event.js',
    'Frames/My.File.js',
    'Frames/My.FileSystem.js',
    'Frames/My.JSON.js',
    'Frames/My.Object.js',
    'Frames/My.Path.js',
    'Frames/My.RegExp.js',
    'Frames/My.String.js',
    'Frames/My.TextFile.js',
    'Frames/My.Other.js',
    'Frames/My.XMLHttp.js',
    'System/System.Browser.js',
    'System/System.Clipboard.js',
    'System/System.ContextMenu.js',
    'System/System.Control.js',
    'System/System.FileSystem.js',
    'System/System.PreverMenu.js',
    'System/System.Program.js',
    'System/System.Window.js',
    'System/System.Window.TaskCard.js',
    'System/System.Start.js'
];

for ( var i = 0; i < System.ScriptList.length; i++ )
    System.ScriptList[ i ] += '?dna=' + System.LoadDNA;

System.ScriptLoading = function( now, amount )
{
    System.Element.LoadingBar.style.width = ( now + 1 ) / amount * 100 + '%';
}

System.ScriptLoaded = function( done )
{
    if ( done ) System.Start();
}

System.Script.Add( System.ScriptList, System.ScriptLoaded, System.ScriptLoading );
