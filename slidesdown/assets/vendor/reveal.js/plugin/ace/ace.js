/*
 * ace.js
 * Copyright (C) 2015 tox <tox@rootkit>
 *
 * Distributed under terms of the MIT license.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.RevealAce = factory());
}(this, (function () { 'use strict';
    function extend(o) {
        for(var i = 1; i < arguments.length; i++)
            for(var key in arguments[i])
                o[key] = arguments[i][key];
        return o;
    };

	var Plugin = function Plugin() {
        function mkEditor(reveal, options, iframe) {
            var w = iframe.contentWindow, d = w.document;
            var mode = iframe.dataset.mode;
            d.write("<!DOCTYPE html><html>"+
                "<head>"+
                "<script src='/assets/vendor/ace/js/ace.js' type='text/javascript' charset='utf-8'></script>")
            if (mode) {
                d.write("<script src='/assets/vendor/ace/js/mode-" + mode + ".js' type='text/javascript' charset='utf-8'></script>");
            }
            d.write("</head>"+
                "<body>"+
                "<div id='editor' style='position:absolute; left:0; top:0; bottom:0; right:0;'>" +
                iframe.innerHTML+ // innerHTML is already escaped
                "</div>"+
                "</body>"+
                "</html>");
            iframe.onload = function() {
                function slidechanged(event) {
                    var e = iframe;
                    for(var e = iframe; e && e != event.currentSlide; e = e.parentNode);
                    if(!e)
                        return;
                    iframe.focus();
                    editor.focus();
                }
                var editor = w.ace.edit(d.getElementById('editor'));
                var aceConf = extend({}, options, iframe.dataset);
                editor.setOptions({
                    fontSize: aceConf.fontsize || "16pt"
                });
    
                if (mode) {
                    var fetched_mode = w.ace.require("ace/mode/" + mode).Mode;
                    editor.session.setMode(new fetched_mode());
                }
    
                // Configuration
                if(aceConf.theme)
                    editor.setTheme(aceConf.theme);
                if(aceConf.mode)
                    editor.getSession().setMode(aceConf.mode);
                if(aceConf.autoFocus) {
                    reveal.addEventListener('slidechanged', slidechanged);
                    slidechanged({ currentSlide: reveal.getCurrentSlide() })
                }
    
                // Events
                if(options.oninit)
                    options.oninit.call(editor, editor);
                if(iframe.dataset.oninit)
                    (new Function("editor", iframe.dataset.oninit)).call(editor, editor);
                if(options.onchange)
                    editor.getSession().on('change', options.onchange);
                if(iframe.dataset.onchange) {
                    var onchange = new Function("value", "editor", iframe.dataset.onchange);
                    editor.getSession().on('change', function() {
                        var value = editor.getValue();
                        return onchange.call(editor, value, editor);
                    });
                }
                if(iframe.id) {
                    reveal.ace[iframe.id] = editor;
                }
            };
            d.close();
        }

        function mkStaticEditor(reveal, options, iframe) {
            let $pre = document.createElement("pre");
            let $code = document.createElement("code");
            let $div = document.createElement("div");
            $div.innerHTML = iframe.innerHTML;
            $code.textContent = `${$div.innerText}`;
            $code.classList.add(`language-${iframe.dataset.mode}`);
            $pre.appendChild($code)
            iframe.parentElement.appendChild($pre);

            return $code;
        }

        function isPrintingPDF(){
            return ( /print-pdf/gi ).test( window.location.search );
        }

        var init = function init(reveal) {

        var config = reveal.getConfig();
        var options = extend({
            className: "ace",
            autoFocus: false,
            onchange: null,
            oninit: null
        }, config.ace || {});

        var aces = document.getElementsByClassName(options.className);
        for(var i = 0; i < aces.length; i++) {
            if(!aces[i].contentWindow) {
                console.warn("ACE Editors must be embedded in an IFrame");
                continue;
            }
            if (isPrintingPDF()) {
                // Se agrega un highlighter estatico
                const highlight = reveal.getPlugin( 'highlight' );
                let $el = mkStaticEditor(reveal, options, aces[i]);
                aces[i].remove();
                highlight.highlightBlock($el);
            }
            else {
                mkEditor(reveal, options, aces[i]);
            }
        }
	  };

	  return {
	    id: 'ace',
	    init: init
	  };
	};

	return Plugin;

})));