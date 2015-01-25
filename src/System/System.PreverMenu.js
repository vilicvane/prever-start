/*(C)2007-2009 ViCRiLoR v.O Studio*/

System.PreverMenu = new function()
{
    var _this = this;

    this.Object = null;

    System.Element.PreverButton.onclick = function()
    {
        if ( _this.Object )
        {
            if ( _this.Object.Opened )
                _this.Object.Close();
            else _this.Object.Open();
        }
        else _this.Load();
    };

    this.Load = function()
    {
        System.Program.Launch( 'System:\\Prever\\Programs\\MyPrever.psp\\PreverMenu.psp', handle );
        function handle( done, obj )
        {
            if ( done ) _this.Object = obj;
        }
    };
}();