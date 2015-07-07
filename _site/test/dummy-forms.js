var Form = require('ampersand-form-view');
var InputView =      require('ampersand-input-view');
var CheckboxView =   require('ampersand-checkbox-view');
var ArrayInputView = require('ampersand-array-input-view');

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

var BasicForm = Form.extend({
    fields: function () {
        return [
            new InputView({
                label: 'Name',
                name: 'name',
                value: this.model && this.model.name,
                placeholder: 'Name',
                parent: this
            }),
            new CheckboxView({
                label: 'Is Awesome?',
                name: 'awesome',
                value: this.model && this.model.isAwesome,
                parent: this,
                template: checkTemplate
            }),
            new InputView({
                label: 'Coolness Factor',
                name: 'coolnessFactor',
                value: this.model && this.model.coolnessFactor,
                placeholder: '8',
                parent: this,
                type: 'number',
                tests: [
                    function (val) {
                        if (val < 0 || val > 11) { return 'Must be between 0 and 11'; }
                    },
                    function (val) {
                        if (!/^[0-9]+$/.test(val)) { return 'Must be a number'; }
                    }
                ]
            }),
            new ArrayInputView({
                label: 'Favorite Colors',
                name: 'colors',
                placeholder: 'blue',
                parent: this,
                numberRequired: 2,
                tests: [
                    function (val) {
                        if (['red', 'blue', 'green'].indexOf(val) === -1) {
                            return 'Can only be red, blue, or green. Sorry.';
                        }
                    }
                ]
            })
        ];
    }
});

var SingleCheckForm = Form.extend({
    fields: function () {
        return [
            new CheckboxView({
                label: 'Is Awesome?',
                name: 'awesome2',
                value: true,
                required: false,
                parent: this,
                template: checkTemplate
            })
        ];
    }
});

var SingleCheckFormRequired = Form.extend({
    fields: function () {
        return [
            new CheckboxView({
                label: 'Is Required\?',
                name: 'required-checkbox',
                required: true,
                parent: this,
                template: checkTemplate
            })
        ];
    }
});

var DoubleCheckForm = Form.extend({
    fields: function () {
        return [
            new CheckboxView({
                label: 'Check UNO - required\?',
                name: 'required-checkbox',
                required: true,
                parent: this,
                template: checkTemplate
            }),
            new CheckboxView({
                label: 'Check DOS - not required\?',
                name: 'required-checkbox',
                parent: this,
                template: checkTemplate
            })
        ];
    }
});

module.exports = {
    newBasic: function() { return new BasicForm(); },
    newSingleCheck: function() { return new SingleCheckForm(); },
    newDoubleCheck: function() { return new DoubleCheckForm(); },
    newSingleCheckRequired: function() { return new SingleCheckFormRequired(); }
};
