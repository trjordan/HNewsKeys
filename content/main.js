function LOG(msg) {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]  
            .getService(Components.interfaces.nsIConsoleService);  
    consoleService.logStringMessage(msg);  
}  

ShiftListener = {
    pressed: false,
    onKeydown: function(e) {
        if (e.keyCode == 16) {
            ShiftListener.pressed = true;
        }
    },

    onKeyup: function(e) {
        if (e.keyCode == 16) {
            ShiftListener.pressed = false;
        }
    }
};

HNewsKeys = {
    getMainPageObj: function() {
        if (!window.content.HNewsKeys) {
            HNewsKeys.createMainPageObj();
        } 
        return window.content.HNewsKeys;
    },

    createMainPageObj: function() {
        window.content.HNewsKeys = new HNewsMainPage();
    },

    getCommentsObj: function() {
        if (!window.content.HNewsKeysComments) {
            window.content.HNewsKeysComments = new HNewsComments();
        } 
        return window.content.HNewsKeysComments;
    },
    
    isTitlePage: function() {
        var location = getBrowser().currentURI.spec.split('?')[0];
        return location.match('http://news.ycombinator.com/(x|ask|jobs|newest|)$');
    },

    isCommentsPage: function() {
        var location = getBrowser().currentURI.spec.split('?')[0];
        return location.match('http://news.ycombinator.com/(item|threads|newcomments)');
    },

    onWindowLoad: function() {
        LOG('Window loaded');
        gBrowser.addEventListener('load', HNewsKeys.onBrowserLoad, true);
    },

    onBrowserLoad: function(event) {
        if (event.originalTarget.nodeName == '#document' &&
            event.originalTarget.defaultView.location.href == gBrowser.currentURI.spec &&
            HNewsKeys.isTitlePage() || HNewsKeys.isCommentsPage()) {
            var style = window.content.document.createElement("link");
            style.type = "text/css";
            style.rel = "stylesheet";
            style.href = "chrome://hnewskeys/content/hnewskeys.css";
            content.document.getElementsByTagName("head")[0].appendChild(style);
            LOG('Attached CSS');
        }
    },

    onKeypress: function(e) {
        try {
            if (HNewsKeys.isTitlePage()) {
                HNewsKeys.getMainPageObj().onKeypress(e);
            } 
            if (HNewsKeys.isCommentsPage()) {
                HNewsKeys.getCommentsObj().onKeypress(e);
            }
        } catch (e) {
            var msg = 'Error: ' + e.message + "\n\n" +
                    e.stack;
            alert(msg);
        }
    }

};

PageTools = Ext.extend(Object, {
    constructor: function(current) {
        this.items = [];
        this.current = (typeof current !== 'undefined') ? current : -1;
        this.init();
        for (i = 0; i < this.items.length; i++) {
            this.unembolden(i);
        }
    },

    move: function(num) {
        var oldPosition = this.current;
        var newPosition = oldPosition + num;
        if (newPosition < 0 || newPosition >= this.items.length) {
            return;
        }
        this.embolden(newPosition);
        this.current = newPosition;

        if (!(oldPosition < 0 || oldPosition >= this.items.length)) {
            this.unembolden(oldPosition);
        }
        this.fixPosition();
    },

    unembolden: function(index) {
        this.items[index].text.className = '';
    },

    embolden: function(index) {
        this.items[index].text.className = 'current-title';
    },

    fixPosition: function() {
        var body = window.content.document.getElementsByTagName('body')[0];
        var currentOffset = body.scrollTop;
        var viewHeight = window.content.innerHeight;
        var commentHeight = this.getCurrentTextItem().offsetHeight;
        var offset = 0;
        var currentNode = this.getCurrentTextItem();
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
    },

    getCurrentItem: function() {
        return this.items[this.current];
    },

    getCurrentTextItem: function() {
        return this.getCurrentItem().text;
    },

    derelativize: function(anchor) {
        var href = anchor.getAttribute('href');
        var prefix = 'http://news.ycombinator.com';
        if (href.slice(0, 4) !== 'http') {
            if (href.slice(0, 1) !== '/') {
                prefix += '/';
            } 
            anchor.setAttribute('href', prefix + href);
        }
    }

});

HNewsComments = Ext.extend(PageTools, {

    init: function() {
        var spans = window.content.document.getElementsByTagName('span');
        for (var i = 0; i < spans.length; i++) {
            if (spans[i].className === 'comment') {
                this.items.push({
                    text : spans[i]
                });
            }
        }
    },

    onKeypress: function(e) {
        var letter = (e.keyCode == 13) ? 'ENTER' : String.fromCharCode(e.charCode);
        switch(letter) {
        case 'j':
            this.move(1);
            break;
        case 'k':
            this.move(-1);
            break;
        default:
            return;
        }
    }
});

HNewsMainPage = Ext.extend(PageTools, {

    init: function() {
        var comments = [];
        var titles   = [];

        var anchors = window.content.document.getElementsByTagName('a');
        for (var i = 0; i < anchors.length; i++) {
            if (anchors[i].parentNode.className === 'title') {
                this.derelativize(anchors[i]);
                titles.push(anchors[i]);
            }
            if (anchors[i].parentNode.className === 'subtext' && 
                anchors[i].getAttribute('href').match('item')) {
                this.derelativize(anchors[i]);
                comments.push(anchors[i]);
            }
        }
        for (i = 0; i < titles.length; i++) {
            this.items.push({
                text    : titles[i],
                comment : comments[i]
            });
        }
    },

    open: function(newPage) {
        var url = this.getCurrentItem().text.getAttribute('href');
        if (newPage) {
            window.content.open(url);
        } else {
            window.content.location = url;
        }
    },

    openComments: function(newPage) {
        var url = this.getCurrentItem().comment.getAttribute('href');
        if (newPage) {
            window.content.open(url);
        } else {
            window.content.location = url;
        }
    },
 
    onKeypress: function(e) {
        var letter = (e.keyCode == 13) ? 'ENTER' : String.fromCharCode(e.charCode);
        switch(letter) {
        case 'j':
            this.move(1);
            break;
        case 'k':
            this.move(-1);
            break;
        case 'ENTER':
            this.open(ShiftListener.pressed);
            break;
        case 'o':
        case 'O':
            this.openComments(ShiftListener.pressed);
            break;
        default:
            return;
        }
    },

    onKeydown: function(e) {
    }

});

window.addEventListener("keypress", HNewsKeys.onKeypress, false); 
window.addEventListener("load", HNewsKeys.onWindowLoad, false); 
window.addEventListener("keydown", ShiftListener.onKeydown, false); 
window.addEventListener("keyup", ShiftListener.onKeyup, false); 
