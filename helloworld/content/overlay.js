var HelloWorld = {
    onLoad: function() {
        if (getBrowser().currentURI.spec !== 'http://news.ycombinator.com/') {
            return;
        }

        var style = 'font-size:70';

        // var doc = window.content.document;
        // var css = doc.createElement('link');
        // css.setAttribute('rel',"stylesheet");
        // css.setAttribute('href', "resource://helloworld/content/overlay.css");
        // css.setAttribute('type', "text/css2");
        // doc.getElementsByTagName('head')[0].appendChild(css);

        var titles = [];
        var anchors = window.content.document.getElementsByTagName('a');
        for (var i = 0; i < anchors.length; i++) {
            if (anchors[i].parentNode.className === 'title') {
                titles.push(anchors[i]);
            }
        }    
        for (var i = 0; i < titles.length; i++) {
            //titles[i].className = 'mooo';
            titles[i].setAttribute('style',style);
        }
        alert('Finished!');
    },

    onMenuItemCommand: function() {
        window.open("chrome://helloworld/content/hello.xul", "", "chrome");
    }
};

window.addEventListener("DOMContentLoaded", function(e) { HelloWorld.onLoad(e); }, false); 
