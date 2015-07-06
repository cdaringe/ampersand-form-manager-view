'use strict';
var View = require('ampersand-form-view');
var IV = require('ampersand-input-view');
var CV = require('ampersand-checkbox-view');

var VS = require('ampersand-view-switcher');
var domready = require('domready');

domready(function() {
    var v1 = new View({
        fields: function() { return [
                new IV({name: '1i', value: 'bananas'}),
                new CV({name: '1c', value: true})
            ];
        }
        // , el: document.body
    });
    var v2 = new View({
        fields: function() { return [ new IV({name: '2', value: 'apples'}) ]; }
        // , el: document.body
    });


    var vs = new VS(document.body, {
        hide: function (oldView, cb) {
            console.log(oldView.name);
            cb();
        },
        show: function (newView) {
            console.log(newView.name);
        }
    });

debugger;
    vs.set(v1);
    vs.set(v2);
    vs.set(v1);


});
