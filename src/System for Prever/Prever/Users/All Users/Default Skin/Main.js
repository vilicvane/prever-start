/*Skin*/

Skin.ImageList = [  ];
Skin.CSSList = [ 'Main.css', 'Taskbar\\Main.css', 'Window\\Main.css', 'Window\\Frame.css', 'PreverMenu\\Main.css', 'Control\\Main.css' ];

Skin.Element = {};

Skin.Element.Taskbar =
{
    BarHeight: 29,
    CardWidth: 159
};

Skin.Element.TaskCard =
{
    MaxWidth: 160, //px, 包括边框边距等.
    ExtraWidth: 4,
    TitleTextAvailableWidth: -30
};

Skin.Element.Window =
{
    BorderWidth: 4,
    TitleCenterAvailableWidth: -4,
    TitleTextAvailableWidth: -20,
    TitleHeight: 20,
    MessageTextAvailableWidth: -70,
    InputTextAvailableWidth: -12
};