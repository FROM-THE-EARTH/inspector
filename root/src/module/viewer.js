window.$ = window.jQuery = require('jquery');

var Viewer = {
    rotateDeg(angle){
        $('#rocketimg').css('transform', 'rotate(' + angle + 'deg)');
    }
}

module.exports = Viewer;