/*jshint expr: true*/

/*
 * Form construction is **verbose**.  Ugh!  That's why I've offloaded the form generation pertient
 * to each test to a series of form generator functions.  These are found in the complimentary
 * test-seeds.js file.  test-seeds functions build questionnaire-views from **collections** of form views.
 * form views are found in dummy-forms.js, and consist of various form-control views.
 * Having these 3 files open may assist in writing tests.  No, it's not *that* complicated :)
 *
 * seed functions expect an el to render in.  `el` is re-prepped in each setup.
 */

// Patch PhantomJS
if (!Function.prototype.bind) { Function.prototype.bind = require('function-bind'); }
var suite = require('tape-suite'); // jshint ignore:line
var viewConventions = require('ampersand-view-conventions');
var seeds = require('./test-seeds.js');

var el, view;

viewConventions.view(
    suite.tape,
    require('../ampersand-form-manager-view'),
    {
        el: document.createElement('div'),
        title: 'testConventions'
    }
);

var beforeEach = function () { // jshint ignore:line
    el = document.createElement('div'); // jshint ignore:line
    el.id = 'qView';
};

suite('basic initialization [ex1], no forms', function (t) {
    t.beforeEach(beforeEach);
    view = seeds.ex1(el);
    t.test('should render div el', function (t) {
        t.equal(view.el.tagName, 'DIV', 'renders default into div');
        t.end();
    });

});

suite('basic init, autoload form [ex2]', function (t) {
    t.beforeEach(beforeEach);
    t.test('should render a view, rendering default form', function (t) {
        view = seeds.ex2(el);
        t.ok(view.formContainer.innerHTML, 'should have rendered HTML');
        t.ok(view.forms.models[0].rendered, 'should be rendered');
        t.ok(!view.forms.models[1].rendered, 'should not be rendered');
        t.end();
    });
});

suite('basic init, disable autoload form [ex3]', function (t) {
    t.beforeEach(beforeEach);
    t.test('should render a view, not autoloading any', function (t) {
        view = seeds.ex3(el);
        t.equal(view.formContainer, undefined, 'should have no formContainer');
        view.render();
        t.equal(!!view.forms.models[0].rendered, false, 'should not autoRender');
        view.forms.models[0].render();
        t.ok(!!view.forms.models[0].rendered, 'should render after render call');
        t.end();
    });
});

suite('form set validity', function (t) {
    t.beforeEach(beforeEach);
    t.test('should be complete when there are no forms [ex4]', function (t) {
        view = seeds.ex4(el);
        t.ok(view.complete, 'should be completed');
        t.end();
    });

    t.test('should be complete when there are forms, and forms are valid [ex5]', function (t) {
        view = seeds.ex5(el);
        t.ok(view.complete, 'view complete');
        view.forms.forEach(function(form, ndx) {
            t.ok(form.valid, 'form ' + ndx +' valid');
        });
        t.end();
    });

    t.test('should not be complete when there are forms, and some are invalid [ex6]', function (t) {
        view = seeds.ex6(el);
        t.ok(!view.complete);
        var rslt = view.forms.some(function(form) {
            return form.valid;
        });
        t.ok(rslt, 'should have some valid forms');
        t.end();
    });

    t.test('should maintain remaining and completed form ref arrays [ex6]', function (t) {
        view = seeds.ex6(el);
        t.ok(!view.complete);
        t.ok(view.completed.length);
        t.ok(view.remaining.length);
        t.end();
    });

    t.test('should support next form && current features [ex6]', function (t) {
        view = seeds.ex6(el);
        var curr = view.current;
        var next;

        // compare next form to current form
        view.next();
        next = view.current;
        t.notEqual(curr, next, 'first form !== second');

        // circle back to first form in two-form set
        view.next();
        next = view.current;
        t.equal(curr, next, 'forms aligned');

        t.end();
    });


    t.test('should exec callback if defined and forms already completed', function (t) {
        t.plan(1);
        view = seeds.ex7(el, function() { t.ok(true, 'callback executed when forms complete'); });
        t.end();
    });

    t.test('should support custom eagerLoad functionality (true, "all", function)', function (t) {
        var passedView, formCount = 0;

        // eagerLoad: true
        view = seeds.ex10(el);

        t.ok(view.forms.length > 1, 'eagerLoad(true): test eager load on formSet with > 1 form');
        t.ok(view.forms.models[0].rendered, 'eagerLoad(true): first form rendered');
        t.notOk(view.forms.models[1].rendered, 'eagerLoad(true): second form not rendered');

        // eagerLoad: all
        // formCount = 0;
        // beforeEach();
        // view = seeds.ex9(el);

        // t.ok(view.forms.length > 1, 'test eager load on formSet with > 1 form');
        // view.forms.forEach(function(frm) {
        //     if (frm.rendered) {
        //         ++formCount;
        //     }
        // });
        // t.equal(formCount, view.forms.length, 'all forms rendered');

        // eagerLoad: function
        formCount = 0;
        beforeEach();
        view = seeds.ex8(el, function(forms, vw) {
            forms.forEach(function() { ++formCount; });
            passedView = vw;
        });

        t.ok(view.forms.length > 1, 'eagerLoad(function): formSet with > 1 form');
        t.equal(formCount, view.forms.length, 'eagerLoad(function): formsCollection arg match');
        t.equal(view, passedView, 'eagerLoad(function): passed view arg match');
        view.forms.forEach(function(frm, i) {
            t.notOk(frm.rendered, 'eagerLoad(function): form ' + i + ' not rendered');
        });
    });

});

