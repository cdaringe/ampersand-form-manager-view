/**
 * Demo constructs each form defined in test-seeds.js and puts them on the page
 * This is a great way not only to view your forms, but also debug your tests.
 * Simply modify your dummy-form example function (maybe slap a debugger; in there),
 * and refresh the demo to get goin!
 *
 * This is _NOT_ the github.io demo.  This is a series of micro-demos used as test seeds
 */

var seeds = require('../test/test-seeds.js');
var each = require('lodash/collection/each');
var body = document.body,
    page, padCol;

/**
 * Build pretty example row
 * @param  {View} el example view
 * @return {Object}
 */
var append = function(el) {
    var container = page || body;
    var exRow = document.createElement('div');
    exRow.className = 'row';

    var exHeader = document.createElement('h4');
    exHeader.textContent = el.id || 'Please enter an id on the example `el`';
    var exContent = document.createElement('div');
    exContent.className = 'col-sm-8 col-xs-10';
    var formContent = document.createElement('div');
    formContent.className = 'well';
    exContent.appendChild(formContent);
    formContent.appendChild(el);

    exRow.appendChild(padCol.cloneNode());
    exRow.appendChild(exContent);
    exRow.appendChild(padCol.cloneNode());
    exContent.insertBefore(exHeader, exContent.childNodes[0]);

    container.appendChild(exRow);
    return {row: exRow, header: exHeader};
};

var prettyify = function() {
    // build content container
    page = document.createElement('div');
    page.id = 'page';
    page.className = 'container-fluid';
    body.appendChild(page);

    padCol = document.createElement('div');
    padCol.className = 'col-sm-2 col-xs-1';

    if (document.createStyleSheet) {
        document.createStyleSheet('bootstrap.min.css');
    } else {
        var newSS = document.createElement('link');
        newSS.rel = 'stylesheet';
        newSS.href = 'bootstrap.min.css';
        document.getElementsByTagName('head')[0].appendChild(newSS);
    }
};

// for visible browsers, let's make this stuff viewable!
if (document.getElementsByTagName('head')[0]) {
    window.document.addEventListener('DOMContentLoaded', function () {
        prettyify();
        var viewGenerators = Object.keys(seeds).map(function getViewGenerators(seedKey) {
            return seeds[seedKey];
        });

        // Build an example el for the view to live, feed it to the generator which will attach an example to it
        viewGenerators.forEach(function postExEvents(viewGenerator, ndx) {
            var el = window.document.createElement('div');
            var view,
                rowNodes;

            el.id = 'ex' + (ndx + 1);
            rowNodes = append(el);

            // build qView on this el
            view = viewGenerator(el);

            // well-ify each form in the form view
            if (view.formContainer) {
                each(view.formContainer.querySelectorAll('form'), function(form) {
                    form.className = 'well';
                });
            }

            var titleNode = document.createElement('h5');
            titleNode.textContent = view.title || el.id;
            rowNodes.header.parentNode.insertBefore(titleNode, rowNodes.header.parentNode.firstChild);
            window[el.id] = view;
            view.on('all', function (name, field) {
                console.log('Got event', name, field.value, field.valid);
            });
        });
    });
}
