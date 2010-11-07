var HNewsKeys = {
    getMainPageObj: function() {
        if (!window.content.HNewsKeys) {
            window.content.HNewsKeys = new HNewsMainPage();
        } 
        return window.content.HNewsKeys;
    },

    getCommentsObj: function() {
        if (!window.content.HNewsKeysComments) {
            window.content.HNewsKeysComments = new HNewsComments();
        } 
        return window.content.HNewsKeysComments;
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
        } else {
            var obj = HNewsKeys.getCommentsObj();
            obj.onKeypress(e);
        }
    }
};

var HNewsComments = function() {

    var comments = [];
    var current  = 0;

    function move(num) {
        var oldPosition = current;
        var newPosition = oldPosition + num;
        if (newPosition < 0 || newPosition >= comments.length) {
            return;
        }
        embolden(newPosition);
        current = newPosition;

        if (!(oldPosition < 0 || oldPosition >= comments.length)) {
            unembolden(oldPosition);
        }
        fixPosition();
    }

    function unembolden(index) {
        comments[index].setAttribute('style', '');
    }

    function embolden(index) {
        comments[index].setAttribute('style', 'font-size:24');
    }

    function fixPosition() {
        var body = window.content.document.getElementsByTagName('body')[0];
        var currentOffset = body.scrollTop;
        var viewHeight = window.content.innerHeight;
        var commentHeight = comments[current].offsetHeight;
        var offset = 0;
        var currentNode = comments[current];
        while (currentNode !== body) {
            offset += currentNode.offsetTop;
            currentNode = currentNode.offsetParent;
        }

        // TODO: Align to elements, not pixels.
        // TODO: Remove TODO
        if (offset + commentHeight > body.scrollTop + viewHeight) {
            body.scrollTop = offset - viewHeight + commentHeight + 35;
        } else if (offset < body.scrollTop) {
            body.scrollTop = offset - 35;
        }
    }

    var spans = window.content.document.getElementsByTagName('span');
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].className === 'comment') {
            comments.push(spans[i]);
        }
    }
    alert('Finished also!');

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
        }
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

