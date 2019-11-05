var gifCount = 1;
var delta = 500;
var Timer;
var stopped = true;

function stopGif() {
    clearTimeout(Timer);
    stopped = true;
}

function faster() {
    delta = delta / 1.3;
}

function slower() {
    delta = delta * 1.3;
}

function start() {
    if (stopped == true) {
        stopped = false;
        Timer = setTimeout("anime()", delta);
    }

}

function anime() {
    var element = document.getElementById('field');
    element.setAttribute('src', '/static/img/s' + gifCount.toString() + '.gif');
    if (gifCount != 12) {
        gifCount = gifCount + 1;
    } else {
        gifCount = 1;
    }
    Timer = setTimeout("anime()", delta);
}