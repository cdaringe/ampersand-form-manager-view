'use strict';
var FMView = require('./ampersand-form-manager-view');
var forms = require('./demo-forms.js');
var isArray = require('lodash.isarray');
var template = [
    '<div data-hook="demo-container">',
        '<div data-hook="demo-log">',
            '<span data-hook=log></span>',
        '</div>',
        '<div id=main data-hook=main>',
            '<div class=main-nav class=main-nav data-hook="demo-nav-left">',
                '<button type=button data-hook=nav-back><<</button>',
            '</div>',
            '<div class=main-content data-hook="form-container"></div>',
            '<div class=main-nav data-hook="demo-nav-right">',
                '<button type=button data-hook=nav-forward>>></button>',
            '</div>',
        '</div>',
        '<div data-hook="stats>',
            '<dl class="dl-horizontal">',
                '<dt>remaining: </dt>',
                '<dd data-hook=remaining>.</dd>',
                '<dt>current: </dt>',
                '<dd data-hook=current-cid></dd>',
                '<dt>complete: </dt>',
                '<dd data-hook=complete></dd>',
            '</dl>',
        '</div>',
    '</div>'
].join('\n');

var logInterval;

var DemoFMView = FMView.extend({
    bindings: {
        complete: {
            type: 'text',
            hook: 'complete'
        },
        'currentCid': {
            type: 'text',
            hook: 'current-cid'
        },
        log: {
            type: function(el, value, prevValue) { // jshint ignore:line
                if (!isArray(value)) {
                    debugger;
                    return;
                    // throw new TypeError('log must be appended to (it\'s an array!)');
                }
                // cycle thru log messages
                if (!logInterval) {
                    setInterval(function setLogContent() {
                        if (!value[0]) {
                            clearInterval(logInterval);
                            return;
                        }
                        el.textContent = value[0];
                        value.shift();
                    }, 5000);
                }
            },
            hook: 'log'
        },
        remaining: {
            type: 'text',
            hook: 'remaining'
        }
    },
    events: {
        'click [data-hook=nav-back]': 'prev',
        'click [data-hook=nav-forward]': 'next'
    },
    template: template
});
var demo = window.demo = new DemoFMView({
    completeCallback: function() {
        this.log.push('All forms valid!');
    },
    cycle: true,
    el: document.querySelector('[data-hook=demo]'),
    eagerLoad: true,
    forms: [new forms.First(), new forms.Second(), new forms.Third()] // TODO MUST ADD FORMSSSSZZZ
});
demo.render();
