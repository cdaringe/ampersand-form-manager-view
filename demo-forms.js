var Form = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var CheckboxView = require('ampersand-checkbox-view');
var uniqueId = require('lodash.uniqueid');
var assign = require('lodash.assign');

var cbvTemplate = [
    '<div class="checkbox">',
        '<label>',
            '<input type="checkbox" >',
            '<span data-hook=label></span>',
        '</label>',
        '<div data-hook="message-container" class="message message-below message-error help-block">',
            '<p data-hook="message-text"></p>',
        '</div>',
    '</div>',
].join('');

var DemoFormView = Form.extend({
    template: [
        '<div data-hook=forms-with-meta-wrapper>',
            '<form data-hook=field-container>',
            '</form>',
            '<span class="form-validator alert" data-hook="form-valid">',
            '</span>',
        '</div>'
    ].join(''),
    initialize: function() {
        Form.prototype.initialize.apply(this, arguments);
        var updateValidityBox = function() {
            var el = this.queryByHook('form-valid');
            // TODO `valid` binding doesn't work? wtf
            el.textContent = 'Form is ' + (this.valid ? 'valid!' : 'invalid');
            el.classList[this.valid ? 'add' : 'remove']('alert-success');
            el.classList[!this.valid ? 'add' : 'remove']('alert-warning');
        }.bind(this);
        this.on('change:valid', updateValidityBox);
        this.on('render', updateValidityBox);
    }
});

var DemoCheckboxView = CheckboxView.extend({
    template: cbvTemplate,
    bindings: assign(InputView.prototype.bindings, {
        uid: [
            {
                type: 'attribute',
                name: 'id',
                hook: 'input'
            }, {
                type: 'attribute',
                name: 'for',
                hook: 'label'
            }
        ]
    }),
    props: {
        uid: 'string'
    },
    initialize: function() {
        CheckboxView.prototype.initialize.apply(this, arguments);
        this.uid = uniqueId('demo_checkbox_');
    }
});

var DemoInputView = InputView.extend({
    template: [
        '<div class="form-group" data-hook=form-group>',
            '<label for="?" data-hook="label"></label>',
            '<input id="??" class="form-control" data-hook="input">',
            '<div data-hook="message-container" class="message message-below message-error help-block">',
                '<p data-hook="message-text"></p>',
            '</div>',
        '</div>'
    ].join(''),
    bindings: assign(InputView.prototype.bindings, {
        uid: [
            {
                type: 'attribute',
                name: 'id',
                hook: 'input'
            }, {
                type: 'attribute',
                name: 'for',
                hook: 'label'
            }
        ],
        'showMessage': [
            {
                type: 'toggle',
                hook: 'message-container'
            }, {
                type: 'booleanClass',
                yes: 'has-error',
                hook: 'form-group'
            }
        ]
    }),
    props: {
        uid: 'string'
    },
    initialize: function() {
        InputView.prototype.initialize.apply(this, arguments);
        this.uid = uniqueId('demo_input_');
    }
});

module.exports.First = DemoFormView.extend({
    fields: function () {
        return [
            new DemoInputView({
                label: 'Favorite npm module: ',
                name: 'favorite',
                value: this.model && this.model.name,
                placeholder: 'ampersand-form-manager-view',
                required: true,
                parent: this
            }),
            new DemoCheckboxView({
                label: 'NPM >> Bower\?',
                name: 'npmVsBower',
                parent: this,
                template: cbvTemplate
            }),
        ];
    }
});

module.exports.Second = DemoFormView.extend({
    fields: function () {
        return [
            new DemoInputView({
                type: 'email',
                name: 'email',
                label: 'Email',
                placeholder: 'Email',
                value: '',
                required: true,
                tests: [
                    function(val) {
                        if (val.length < 5) {
                            return 'Your email must be at least 5 characters';
                        }
                    }
                ]
            }),
            new DemoInputView({
                type: 'password',
                name: 'password',
                label: 'Password',
                placeholder: 'Password',
                required: true,
                value: '',
                tests: [
                    function( val ) {
                        if ( val.length < 8 ) {
                            return 'Your (fake) password must be at least 8 characters';
                        }
                    }
                ]
            })
        ];
    }
});

module.exports.Third = DemoFormView.extend({
    fields: function () {
        return [
            new DemoCheckboxView({
                label: 'Is this the final form\?',
                name: 'final',
                required: true,
                parent: this,
                template: cbvTemplate
            }),
            new DemoCheckboxView({
                label: 'Do you see the value populated, from last visit\?',
                name: 'valueable',
                required: true,
                parent: this,
                template: cbvTemplate
            }),
        ];
    }
});
