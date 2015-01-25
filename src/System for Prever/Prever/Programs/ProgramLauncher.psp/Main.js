/*
    Prever Program Launcher
    版本 1.0.0
    作者 Vilic Vane
    ©2009 ViCRiLoR v.O Studio
*/

function $L( annex )
{
    var _this = this;

    this.Start = function()
    {
        if ( annex.AimDirectory ) System.Program.Launch( annex.AimDirectory, null, null, annex.Relaunch );
        _this.Dispose();
    };
}
