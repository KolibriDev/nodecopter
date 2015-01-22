define(['jquery', 'socket'], function($, socket) {
    var $subs = $('#subtitles');
    var newText = function(data) {
        if ($subs.find('text:not(.leaving)').length > 0) {
            $subs.find('text:not(.leaving)').each(function(i,item) {
                removeText({index: $(item).attr('data-index')});
            });
        }
        var $newText = $('<text />');
        $newText.attr('data-index',data.index);
        $newText.text(data.text);
        $subs.prepend($newText);
    };
    var removeText = function(data) {
        var $item = $subs.find('text').filter('[data-index="' + data.index + '"]');
        $item.addClass('leaving');
        setTimeout(function() {
            $item.addClass('go-away');
        },2000);
    };
    socket.on('say', newText);
    socket.on('saydone', removeText);
});
