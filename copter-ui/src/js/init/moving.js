define(['jquery', 'socket'], function($, socket) {
    var $wrap = $('#moving-output');
    var getIcon = function(action) {
        if (action === "forward") {
            return "angle-up";
        }
        if (action === "backward") {
            return "angle-down";
        }
        if (action === "turnRight") {
            return "angle-right";
        }
        if (action === "turnLeft") {
            return "angle-left";
        }
        if (action === "higher") {
            return "angle-double-up";
        }
        if (action === "lower") {
            return "angle-double-down";
        }
    };
    var newMove = function(action) {
        var $newMove = $('<action />');
        $newMove.addClass('fa fa-'+getIcon(action));
        // $newMove.text(action);
        $wrap.prepend($newMove);
    };
    socket.on('moving', newMove);
});
