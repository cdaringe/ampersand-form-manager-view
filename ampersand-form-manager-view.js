/*$AMPERSAND_VERSION*/
var Collection = require('ampersand-collection');
var View = require('ampersand-view');
var result = require('lodash.result');
var assign = require('lodash.assign');
var flatten = require('lodash.flatten');
var isString = require('lodash.isstring');
var ViewSwitcher = require('ampersand-view-switcher');
var bindings = require('ampersand-dom-bindings');
var noop = function(){};

module.exports = View.extend({
    template: [
        '<div data-hook="form-container"></div>'
    ].join(''),
    props: {
        'current': 'state'
    },
    session: {
        fieldUpdate: 'any'
    },
    collections: {
        forms: Collection,
        formData: Collection
    },
    derived: {
        complete: {
            deps: ['fieldUpdate'],
            fn: function () {
                var allComplete = this.forms.every(function(form) {
                    return form.valid;
                });
                if (allComplete && this.completeCallback) {
                    this.completeCallback();
                }
                return allComplete;
            },
            cache: false
        },
        completed: {
            deps: ['fieldUpdate'],
            fn: function () {
                return this.forms.filter(function(form) {
                    return form.valid;
                });
            },
            cache: false
        },
        remaining: {
            deps: ['fieldUpdate'],
            fn: function () {
                return this.forms.filter(function(form) {
                    return !form.valid;
                });
            },
            cache: false
        },
        data: {
            deps: ['fieldUpdate'],
            fn: function() {
                // console.dir(Date()); // TODO bug1 - this doesn't get hit reliably
                // when `fieldUpdate` changed.  see the other ref to `bug1`.  the event
                // fieldUpdate event is consistently hit, but the derived is not repeatably
                // updated
                if (this.singleObject) {
                    return this.forms.reduce(function (prev, form) {
                        return assign(prev, form.data);
                    }, {});
                }
                return this.forms.map(function(form) {
                    return form.data;
                });
            },
            cache: false
        }
    },
    initialize: function (opts) {
        this.el = opts.el;
        this.autoAppend = opts.autoAppend || true;
        this.completeCallback = opts.completeCallback || this.completeCallback || noop;
        this.cycle = opts.cycle || false;
        this.eagerLoad = opts.eagerLoad !== undefined ? opts.eagerLoad : true;
        this.formContainer = opts.formContainer;
        this.forms = new Collection();
        (opts.forms || result(this, 'forms') || []).forEach(function (form) { this.addForm(form); }.bind(this));
        this.freezeState = opts.freezeState !== undefined ? opts.freezeState : true;
        this.singleObject = !!opts.singleObject;
        this.validOnly = !!opts.validOnly;

        // storage for our forms
        this.formData = new Collection();

        // set listeners to update the comprehensive `.data` member on every field update
        // assuming that the field is the current form (only works when rendering one form)
        // at a time.
        this.setFieldUpdate = function() {
            this.fieldUpdate = Date();
        }.bind(this);
        this.on('change:current', function bindFormUpdateListeners() {
            // console.dir(Date()); // TODO bug1 - this DOES get hit reliably
            // when `fieldUpdate` changed.
            this.current.off('all', this.setFieldUpdate, this);
            this.current.on('all', this.setFieldUpdate, this);
        }.bind(this));

        // set current form
        if (opts.value) { this.setForm(opts.value); }
        else if (this.forms.length) { this.setForm(this.forms.models[0]); }

        this.checkComplete();
    },
    render: function () {
        this.renderWithTemplate();
        if (isString(this.formContainer)) {
            this.queryByHook(this.formContainer);
        } else {
            this.formContainer = this.formContainer || this.queryByHook('form-container');
        }
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
    },
    draw: function () {
        // because we keep &-View instances in memory, on removal, some traits are removed.
        // Thus we must reinitialize those features manually
        flatten([this.current, this.current._fieldViewsArray]).forEach(function restoreBindings(view) {
            view._parsedBindings = bindings(view.bindings, view);
            view._initializeBindings();
            view._initializeSubviews();
        });
        /* end &-View re-init */

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
        if (this.validOnly && !this.current.valid) { return this; }
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
