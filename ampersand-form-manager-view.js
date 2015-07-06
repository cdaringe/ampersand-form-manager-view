/*$AMPERSAND_VERSION*/
var Collection = require('ampersand-collection');
var View = require('ampersand-view');
var result = require('lodash.result');
var ViewSwitcher = require('ampersand-view-switcher');
var noop = function () {};

module.exports = View.extend({
    template: [
        '<div data-hook="form-container"></div>'
    ].join(''),
    props: {
        'formsChanged': 'any'
    },
    collections: {
        forms: Collection,
        formData: Collection
    },
    derived: {
        complete: {
            deps: ['formsChanged'],
            fn: function () {
                var allComplete = this.forms.every(function(form) {
                    return form.valid;
                });
                if (allComplete && this.completeCallback) {
                    this.completeCallback();
                }
                return allComplete;
            }
        },
        completed: {
            deps: ['formsChanged'],
            fn: function () {
                return  this.forms.filter(function(form) {
                    return !form.valid;
                });
            }
        },
        remaining: {
            deps: ['formsChanged'],
            fn: function () {
                return  this.forms.filter(function(form) {
                    return !form.valid;
                });
            }
        },
        data: {
            fn: function() {
                return  this.forms.map(function(form) {
                    return form.data;
                });
            },
            cache: false
        }
    },
    initialize: function (opts) {
        opts = opts || {};
        this.el = opts.el;
        this.title = opts.title || '';
        this.autoAppend = opts.autoAppend || true;
        this.eagerLoad = opts.eagerLoad !== undefined ? opts.eagerLoad : true;
        this.cycle = opts.cycle || false;
        this.freezeState = opts.freezeState !== undefined ? opts.freezeState : true;

        // storage for our forms
        this.forms = new Collection();
        this.formData = new Collection();

        this.completeCallback = opts.completeCallback || this.completeCallback || noop;

        // add all forms
        (opts.forms || result(this, 'forms') || []).forEach(function (form) { this.addForm(form); }.bind(this));

        // set current form
        if (opts.value) { this.setForm(opts.value); }
        else if (this.forms.length) { this.setForm(this.forms.models[0]); }

        this.checkComplete();
    },
    render: function () {
        this.renderWithTemplate();
        this.formContainer = this.queryByHook('form-container');
        this.switcher = new ViewSwitcher(this.formContainer);
        if (this.formContainer && this.eagerLoad) {
            this._eagerLoad();
        }
    },
    addForm: function (formView, formData) {
        this.forms.add(formView);
        if (formData) { this.formData.add(formData); }
    },
    checkComplete: function () {
        this.formsChanged = Date();
    },
    draw: function () {
        this.switcher.set(this.current);
        return this;
    },
    _autoAppend: function (form) {
        if (!this.autoAppend) { return this; }
        form.parent = this;
        if (!form.el) { form.render(); }
        this.formContainer.appendChild(form.el);
        return this;
    },
    _eagerLoad: function () {
        if (this.eagerLoad === true) {
            this._eagerLoadSingle(this.forms.models[0]);
        // } else if (this.eagerLoad === 'all') {
        //     this._eagerLoadAll();
        } else if (typeof this.eagerLoad === 'function') {
            this.eagerLoad(this.forms, this);
        }
        return this;
    },
    // _eagerLoadAll: function() {
    //     var allFormContainer = document.createElement('div');
    //     allFormContainer.id = 'form_container_all';
    //     var SubForm = View.extend({
    //         initialize: function() {
    //             this.form = this.model;
    //             this.el = document.createElement('div');
    //             this.el.className = 'member-form';
    //         },
    //         render: function() {
    //             this.registerSubview(this.form);
    //         }
    //     });
    //     this.current = new CollectionView({
    //         collection: this.forms,
    //         el: allFormContainer,
    //         view: SubForm
    //     });
    //     return this.draw();
    // },
    _eagerLoadSingle: function (form) {
        if (!form) { return this; }
        this.current = form;
        return this.draw();
    },
    /**
     * Moves the `current` form to the next form in the set.
     * Cycles back to first form if end of form set reached
     * Does not render the form, unless `draw` is passed
     * @param {boolean} draw draws the form post-selection
     * @return {View} this
     */
    next: function (draw) {
        return this._cycle(1, draw);
    },
    prev: function (draw) {
        return this._cycle(-1, draw);
    },
    _cycle: function(dir, draw) {
        var i;
        if (!this.forms.length) { return this; }
        draw = draw === undefined ? true : draw;
        i = this.current ? this.forms.indexOf(this.current) : 0;
        if (i < 0) { throw new Error('current form not found in forms collection'); }
        if (dir === 1) {
            ++i; // next!
            if (this.forms.models[i]) {
                this.current = this.forms.models[i];
            } else if (this.cycle) {
                this.current = this.forms.models[0];
            }
        } else if (dir === -1) {
            --i; // prev!
            if (this.forms.models[i]) {
                this.current = this.forms.models[i];
            } else if (this.cycle) {
                this.current = this.forms.models[this.forms.length - 1];
            }
        } else {
            throw new Error('invalid direction provided: ' + dir);
        }
        if (!this.freezeState && this.current.reset) {
            // TODO only reset on dirty
            // needs FormView pristine/dirty feature
            this.current.reset();
        }
        if (draw && this.rendered) { this.draw(); }
        console.log('ending: ' + this.current ? this.current.cid : 'none');
        return this;
    },
    /**
     * Sets the `current` form to the direct form reference passed, so long
     * as the requested form is in the form set.
     * @param {FormView} form
     * @param {boolean} draw draws the form post-selection
     */
    setForm: function (form, draw) {
        if (!form) { return this; }
        for (var i = 0; i < this.forms.length; ++i) {
            if (this.forms.models[i] === form) {
                this.current = this.forms.models[i];
                if (draw && this.rendered) { this.draw(); }
                return this;
            }
        }
        throw new Error('unable to set form.  specified form not in form collection');
    }
});
