var Form = require('ampersand-form-view');
var InputView =      require('ampersand-input-view');
var CheckboxView =   require('ampersand-checkbox-view');
var ArrayInputView = require('ampersand-array-input-view');
var FloatingInputView = require('ampersand-floatinglabel-input-view');

var checkTemplate = [
    '<div class="checkbox">',
        '<label>',
            '<input type="checkbox">',
            '<span data-hook="label"></span>',
        '</label>',
        '<div data-hook="message-container" class="message message-below message-error">',
            '<p data-hook="message-text"></p>',
        '</div>',
    '</div>'
].join('');

module.exports.First= Form.extend({
    fields: function () {
        return [
            new InputView({
                label: 'Favorite npm module: ',
                name: 'favorite',
                value: this.model && this.model.name,
                placeholder: 'ampersand-form-manager-view',
                required: true,
                parent: this
            }),
            new ArrayInputView({
                label: 'Notable mentions: ',
                name: 'colors',
                placeholder: 'ampersand-state',
                parent: this,
                numberRequired: 1,
                tests: [
                    function (val) {
                        if (val.trim() !== 'ampersand-state') {
                            return 'Sure, "' + val + '" is probably a good module, ' +
                                'but are you sure ampersand-state isn\'t your favorite?';
                        }
                    }
                ]
            })
        ];
    }
});

module.exports.Second = Form.extend({
    fields: function () {
        return [
            new FloatingInputView({
                type: 'email',
                name: 'email',
                label: 'Email',
                placeholder: 'Email',
                value: '',
                tests: [
                    function(val) {
                        if (val.length < 5) {
                            return 'Your email must be at least 5 characters';
                        }
                    }
                ]
            }),
            new FloatingInputView({
                type: 'password',
                name: 'password',
                label: 'Password',
                placeholder: 'Password',
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

module.exports.Third = Form.extend({
    fields: function () {
        return [
            new CheckboxView({
                label: 'Is this the final form\?',
                name: 'final',
                required: true,
                parent: this,
                template: checkTemplate
            }),
            new CheckboxView({
                label: 'Do you see the value\?',
                name: 'valueable',
                required: true,
                parent: this,
                template: checkTemplate
            }),
        ];
    }
});
