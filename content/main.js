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

    onKeypress: function(e) {
        var obj;
        if (getBrowser().currentURI.spec.match('http://news.ycombinator.com/x?')) {
            obj = HNewsKeys.getMainPageObj();
            obj.onKeypress(e);
        } 
        if (getBrowser().currentURI.spec.match('http://news.ycombinator.com/item')) {
            obj = HNewsKeys.getCommentsObj();
            obj.onKeypress(e);
        }
    }
};

PageTools = Ext.extend(Object, {
    constructor: function() {
        this.items = [];
        this.current = -1;
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
        this.items[index].text.setAttribute('style', '');
    },

    embolden: function(index) {
        this.items[index].text.setAttribute('style', 'font-size:24');
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
        alert('Finished also!');
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
                anchors[i].getAttribute('href').slice(0, 4) === 'item') {
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
        alert('Finished');
    },

    open: function() {
        var url = this.getCurrentItem().text.getAttribute('href');
        window.content.location = url;
    },

    openComments: function() {
        var url = this.getCurrentItem().comment.getAttribute('href');
        window.content.location = url;
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
            this.open();
            break;
        case 'o':
            this.openComments();
            break;
        default:
            return;
        }
    }
});

window.addEventListener("keypress", HNewsKeys.onKeypress, false); 
