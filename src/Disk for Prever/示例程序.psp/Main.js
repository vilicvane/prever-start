function $T()
{
    var _this = this;
    
    this.Start = function()
    {
        var option = new System.Window.Option();
        option.Title = 'Hello World';
        
        var main = new System.Window.Normal( _this, option );
        
        main.Initialize();
        
        main.Body.innerHTML = 'Hello World!';
    };
}
