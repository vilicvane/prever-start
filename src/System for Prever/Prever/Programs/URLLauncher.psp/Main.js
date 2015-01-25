/*
    Prever URL Launcher
    版本 1.0.1
    作者 Vilic Vane
    ©2010 ViCRiLoR v.O Studio
    
    1.0.1 + 弹窗失败提供超链
*/

function $L( annex )
{
    var _this = this;

    var win = System.Window;
    var main, body;

    this.Start = function() {
        if (!annex.AimFile) {
            _this.Dispose();
            return;
        }

        My.JSON.Get(annex.AimFile, handle);

        function handle(done, value) {
            if (done) {
                var url = value.URL;
                if (window.open(url)) _this.Dispose();
                else cD(url);
            }
        }
    };

    function cD(url) {
        var option = new win.Option();
        option.Title = 'URL Launcher';
        option.Width = 200;
        option.Height = 50;

        main = new win.Elementary(_this, option);
        body = main.Body;
        body.innerHTML = '<div class="Main"><a href="' + url + '" target="_blank">点击这里打开链接</a></div>';
        body.onclick = _this.Dispose;

        main.AddCSS('Main.css', main.Initialize);
    }
    
}
