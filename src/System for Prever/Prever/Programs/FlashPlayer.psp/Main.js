/*
    Prever Flash Player
    版本 1.0.0
    嵌入 Vilic Vane
    ©2010 Micriod Studio
*/

function $F( annex )
{
    var _this = this;
    
    var main, body, embed, fObj;
    
    var filePath = annex.AimFile;
    var tFile;
    var status = true;
    
    var fS;
    
    var text, bt_save, bt_create, bts;

    this.Start = function() {

        if (!filePath) {
            _this.Dispose();
            return;
        }

        //创建窗口选项
        var option = new System.Window.Option();
        option.Title = 'Flash 播放器';
        option.IconPath = 'Icons\\16.png';

        option.Width = 401;
        option.Height = 300;

        //创建窗口

        main = new System.Window.Normal(_this, option);
        main.Resizer.MinWidth = 200;
        main.Resizer.MinHeight = 150;

        body = main.Body;

        var url = My.Path.GetURL(filePath);

        //body.innerHTML = //'<embed style="margin-top: 1px;" quality="high" align="middle" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" vmode="transparent"></embed>';
        
        
        fObj = My.Element.CreateByHTML(
        '<object style="margin-top: 1px;" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0">' +
            '<param name="movie" value="' + url + '" />' +
            '<param name="quality" value="high" />' +
            '<param name="vmode" value="opaque" />' +
            '<embed style="margin-top: 1px;" src="' + url + '" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" vmode="opaque"></embed>' +
        '</object>');
        
        body.appendChild(fObj);

        embed = fObj.lastChild;

        embed.height = fObj.height = option.Height - 1;
        embed.width = fObj.width = option.Width;

        embed.vmode = 'opaque';

        main.OnResize = setSize;

        main.Initialize();

    };
    
    function setSize()
    {
        embed.width = fObj.width = body.clientWidth;
        embed.height = fObj.height = body.clientHeight + 1;
    }
}