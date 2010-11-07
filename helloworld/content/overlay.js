var HNewsKeys = {
    getMainPageObj: function() {
        if (!window.content.HNewsKeys) {
            window.content.HNewsKeys = new HNewsMainPage();
        } 
        return window.content.HNewsKeys;
    },

    onLoad: function(e) {
        if (getBrowser().currentURI.spec === 'http://news.ycombinator.com/') {
            // No!
        }
    },

    onKeypress: function(e) {
        if (getBrowser().currentURI.spec === 'http://news.ycombinator.com/') {
            var obj = HNewsKeys.getMainPageObj();
            obj.onKeypress(e);
        }
    }
};

var HNewsComments = {
    onLoad: function() {

    }
};

var HNewsMainPage = function() {

    var current  = -1;
    var titles   = [];
    var comments = [];

    function open() {
        var url = titles[current].getAttribute('href');
        window.content.location = url;
    }

    function openComments() {
        var url = 'http://news.ycombinator.com/' + comments[current].getAttribute('href');
        window.content.location = url;
    }

    function move(num) {
        var oldPosition = current;
        var newPosition = oldPosition + num;
        if (newPosition < 0 || newPosition >= titles.length) {
            return;
        }
        embolden(newPosition);
        current = newPosition;

        if (oldPosition < 0 || oldPosition >= titles.length) {
            return;
        }
        unembolden(oldPosition);
    }
    
    function unembolden(index) {
        titles[index].setAttribute('style', '');
    }

    function embolden(index) {
        titles[index].setAttribute('style', 'font-size:24');
    }

    var anchors = window.content.document.getElementsByTagName('a');
    for (var i = 0; i < anchors.length; i++) {
        if (anchors[i].parentNode.className === 'title') {
            titles.push(anchors[i]);
        }
        if (anchors[i].parentNode.className === 'subtext' && 
            anchors[i].getAttribute('href').slice(0, 4) === 'item') {
            comments.push(anchors[i]);
        }
    }
    for (i = 0; i < titles.length; i++) {
        unembolden(i);
    }
    if (current >= 0) {
        embolden(current);
    }
    alert('Finished');
 
    return {
        onKeypress: function(e) {
            var letter = (e.keyCode == 13) ? 'ENTER' : String.fromCharCode(e.charCode);
            switch(letter) {
            case 'j':
                move(1);
                break;
            case 'k':
                move(-1);
                break;
            case 'ENTER':
                open();
                break;
            case 'o':
                openComments();
                break;
            default:
                return;
            }
        },

    };
};

window.addEventListener("DOMContentLoaded", HNewsKeys.onLoad, false); 
window.addEventListener("keypress", HNewsKeys.onKeypress, false); 

