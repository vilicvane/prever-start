/*(C)2007-2009 ViCRiLoR v.O Studio*/

System.Browser = new function()
{
    this.Resize = function()
    {
        var wh = document.body.offsetHeight - System.Element.Taskbar.offsetHeight;
        var ww = document.body.offsetWidth;
        
        if ( wh < 300 ) wh = 300;
        if ( ww < 400 ) ww = 400;
        
        System.Element.Window.style.height = wh + 'px';
        System.Element.Window.style.width = ww + 'px';
        System.Element.TaskBox.style.width = ww - System.Element.PreverButton.offsetWidth - System.Element.TaskLeftButton.offsetWidth - System.Element.TaskRightButton.offsetWidth - System.Element.QuickMenuButton.offsetWidth - System.Element.InformationBox.offsetWidth + 'px';
        
        System.Window.TaskCard.CheckWidth();
    }

    window.onresize = this.Resize;
}();
