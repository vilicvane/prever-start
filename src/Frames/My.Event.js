/*(C)2007-2009 ViCRiLoR v.O Studio*/

My.Event = {};

My.Event.CancelBubble = function( e )
{
    if ( e.stopPropagation ) e.stopPropagation();
    else e.cancelBubble = true;
};
