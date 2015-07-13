'use strict';
var FMView = require('./ampersand-form-manager-view');
var forms = require('./demo-forms.js');
var template = [
    '<div data-hook="demo-container">',
        '<div class="alert alert-success" data-hook=log>All forms complete</div>',
        '<div id=main data-hook=main>',
            '<div class="well fixed-panel" data-hook="form-container"></div>',
        '</div>',
        '<div class="clearfix" data-hook="nav-container">',
            '<button type=button class="btn btn-default pull-left" data-hook=nav-previous>&larr; Previous</button>',
            '<button type=button class="btn btn-default pull-right" data-hook=nav-next>Next &rarr;</button>',
        '</div>',
        '<hr>',
        '<h3>Report</h3>',
        '<div data-hook="stats>',
            '<dl class="dl-horizontal">',
                '<dt>remaining (#-invalid):</dt>',
                '<dd>',
                    '<span data-hook=remaining>?</span>',
                    '<span>/</span>',
                    '<span data-hook=form-count>?</span>',
                '</dd>',
                '<dt>current:</dt>',
                '<dd data-hook=current-cid></dd>',
                '<dt>complete:</dt>',
                '<dd data-hook=complete></dd>',
                '<dt>output data preview (singleObject mode enabled):</dt>',
                '<dd><pre data-hook=output-preview></pre></dd>',
            '</dl>',
        '</div>',
    '</div>'
].join('\n');

var DemoFMView = FMView.extend({
    bindings: {
        complete: [
            {
                type: function(el, value, previousValue) { // jshint ignore:line
                    el.innerHTML = value ? 'Yep, all done!' : 'Not yet, keep fillin\' out forms!';
                },
                hook: 'complete'
            }, {
                type: 'toggle',
                hook: 'log'
            }
        ],
        'current.cid': {
            type: 'text',
            hook: 'current-cid'
        },
        'current.valid': {
            type: 'booleanClass',
            hook: 'nav-container',
            no: 'invalid-nav'
        },
        data: {
            type: function(el, value, previousValue) { // jshint ignore:line
                el.textContent = JSON.stringify(value, null, 2);
            },
            hook: 'output-preview'
        },
        forms: {
            type: function(el, value, previousValue) { // jshint ignore:line
                el.innerHTML = value.length;
            },
            hook: 'form-count'
        },
        remaining: {
            type: function(el, value, previousValue) { // jshint ignore:line
                el.innerHTML = value.length;
            },
            hook: 'remaining'
        }
    },
    events: {
        'click [data-hook=nav-previous]': 'prev',
        'click [data-hook=nav-next]': 'next'
    },
    template: template
});
var formz = window.formz = [new forms.First(), new forms.Second(), new forms.Third()];
var demo = window.demo = new DemoFMView({
    cycle: true,
    dataObject: true,
    el: document.querySelector('[data-hook=demo]'),
    eagerLoad: true,
    forms: formz,
    validOnly: true
});
demo.render();
