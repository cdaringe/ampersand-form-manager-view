var FMView = require('../ampersand-form-manager-view');
var dummyForms = require('./dummy-forms.js');
var domify = require('domify');
var addNav = function(el, view) {
    var prevEl, nextEl, navDom;
    navDom = domify([
        '<hr>',
        '<button class="prev" role="button" class="btn btn-primary">&lt; prev</button>',
        '<button class="next" role="button" class="btn btn-info">next &gt;</button>'
    ].join(''));

    el.appendChild(navDom);
    prevEl = el.querySelector('.prev');
    nextEl = el.querySelector('.next');

    prevEl.onclick = function() { view.prev(); };
    nextEl.onclick = function() { view.next(); };
};

// Each example returns the view
var ex1 = window.ex1 = function(el) {
    var qView = new FMView({
        el: el,
        title: 'super basic - render form view with no content, just an el'
    });
    qView.render();
    return qView;
};

var ex2 = window.ex2 = function(el) {
    var basicForm = window.ex2.basicForm = dummyForms.newBasic();
    var basicForm2 = window.ex3.basicForm = dummyForms.newBasic();
    var qView = new FMView({
        el: el,
        forms: [basicForm, basicForm2],
        title: 'two forms, autoload form 1'
    });
    qView.render();
    // basicForm.render();
    return qView;
};

var ex3 = window.ex3 = function(el) {
    var basicForm = window.ex3.basicForm = dummyForms.newBasic();
    var basicForm2 = window.ex3.basicForm = dummyForms.newBasic();
    var qView = new FMView({
        el: el,
        forms: [basicForm, basicForm2],
        title: 'no eagerLoad-ing',
        eagerLoad: false
    });
    return qView;
};

var ex4 = window.ex4 = function(el) {
    var qView = new FMView({
        el: el,
        forms: [],
        title: 'qView with no forms (complete)'
    });
    qView.render();
    return qView;
};

var ex5 = window.ex5 = function(el) {
    var singleCheck = window.ex5.singleCheck = dummyForms.newSingleCheck();
    var singleCheck2 = window.ex5.singleCheck2 = dummyForms.newSingleCheck();
    var qView = new FMView({
        el: el,
        forms: [singleCheck, singleCheck2],
        eagerLoad: true,
        title: 'qView with non-required forms. eagerLoad \'true\' (complete)'
    });
    qView.render();
    return qView;
};

var ex6 = window.ex6 = function(el) {
    var singleCheck = window.ex6.singleCheck = dummyForms.newSingleCheck();
    var singleCheck2 = window.ex6.singleCheck2 = dummyForms.newSingleCheckRequired();
    var qView = new FMView({
        cycle: true,
        el: el,
        forms: [singleCheck, singleCheck2],
        eagerLoad: true,
        title: 'qView with one required form, one not-required form. eagerLoad \'true\' (incomplete)'
    });
    qView.render();
    return qView;
};

var ex7 = window.ex7 = function(el, done) {
    var singleCheck = window.ex7.singleCheck = dummyForms.newSingleCheck();
    var singleCheck2 = window.ex7.singleCheck2 = dummyForms.newSingleCheck();
    singleCheck2.render();
    var qView = new FMView({
        el: el,
        forms: [singleCheck, singleCheck2],
        completeCallback: done,
        title: 'exec completeCallback -- the forms are all valid'
    });
    qView.render();
    return qView;
};


// eagerLoad: fn
var ex8 = window.ex8 = function(el, fn) {
    var newDouble = window.ex8.newDouble = dummyForms.newDoubleCheck();
    var newDouble2 = window.ex8.newDouble2 = dummyForms.newDoubleCheck();
    var qView = new FMView({
        el: el,
        forms: [newDouble, newDouble2],
        eagerLoad: fn || function(forms) {
            console.log('eagerLoad custom function: got ' +
                forms.length + ' forms');
        },
        title: 'qView eagerLoad with eagerLoad custom function'
    });
    qView.render();
    return qView;
};

// eagerLoad: 'all'
// TODO enable feature in main package file
var ex9 = window.ex9 = function(el) {
    var newBasic = window.ex9.newBasic = dummyForms.newBasic();
    var newBasic2 = window.ex9.newBasic2 = dummyForms.newBasic();
    var qView = new FMView({
        el: el,
        forms: [newBasic, newBasic2],
        // eagerLoad: 'all',
        title: 'TODO (qView eagerLoad all forms)' // TODO
    });
    qView.render();
    return qView;
};

// eagerLoad: true
var ex10 = window.ex10 = function(el) {
    var one = window.ex10.one = dummyForms.newBasic();
    var two = window.ex10.two = dummyForms.newDoubleCheck();
    var qView = new FMView({
        el: el,
        forms: [one, two],
        eagerLoad: true,
        title: 'qView eagerLoad one (first) form'
    });
    qView.render();
    return qView;
};


// nav form
var ex11 = window.ex11 = function(el) {
    var one = window.ex11.one = dummyForms.newBasic();
    var two = window.ex11.two = dummyForms.newDoubleCheck();
    var three = window.ex11.three = dummyForms.newSingleCheck();

    var qView = new FMView({
        el: el,
        forms: [one, two, three],
        eagerLoad: true,
        title: 'nav thru forms'
    });
    qView.render();
    addNav(qView.formContainer, qView);
    return qView;
};

module.exports = {
    ex1: ex1,
    ex2: ex2,
    ex3: ex3,
    ex4: ex4,
    ex5: ex5,
    ex6: ex6,
    ex7: ex7,
    ex8: ex8,
    ex9: ex9,
    ex10: ex10,
    ex11: ex11
};