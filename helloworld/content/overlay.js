var state = {
    current: -1,
    titles: []
};

var HelloWorld = {
    onLoad: function(e) {
        if (getBrowser().currentURI.spec !== 'http://news.ycombinator.com/') {
            return;
        }

        var anchors = window.content.document.getElementsByTagName('a');
        for (var i = 0; i < anchors.length; i++) {
            if (anchors[i].parentNode.className === 'title') {
                state.titles.push(anchors[i]);
            }
        }    
    },

    onKeypress: function(e) {
        var letter = (e.charCode === 13) ? 'ENTER' : String.fromCharCode(e.charCode);
        switch(letter) {
        case 'j':
            HelloWorld.move(1);
            break;
        case 'k':
            HelloWorld.move(-1);
            break;
        case 'ENTER':
            HelloWorld.open();
            break;
        case 'o':
            HelloWorld.openComments();
            break;
        default:
            return;
        }
    },

    move: function(num) {
        var oldPosition = state.current;
        var newPosition = oldPosition + num;
        if (newPosition < 0 || newPosition >= state.titles.length) {
            return;
        }
        HelloWorld.embolden(newPosition);
        state.current = newPosition;

        if (oldPosition < 0 || oldPosition >= state.titles.length) {
            return;
        }
        HelloWorld.unembolden(oldPosition);
    },
    
    unembolden: function(index) {
        state.titles[index].setAttribute('style', '');
    },

    embolden: function(index) {
        state.titles[index].setAttribute('style', 'font-size:24');
    },

    onMenuItemCommand: function() {
        window.open("chrome://helloworld/content/hello.xul", "", "chrome");
    }
};

window.addEventListener("DOMContentLoaded", HelloWorld.onLoad, false); 
window.addEventListener("keypress", HelloWorld.onKeypress, false); 

