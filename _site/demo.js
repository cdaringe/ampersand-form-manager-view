'use strict';
var FMView = require('ampersand-form-manager-view');
var template = [
    '<div data-hook="demo-container">',
        '<div data-hook="demo-nav">',
            '<span data-hook=log></span>'
        '</div>',
        '<div data-hook="form-container">',
        '</div>',
    '</div>'
].join('\n');

var demo = new FMView.extend({
    el: document.querySelector('[data-hook=demo]'),
    bindings: {
        log: {
            type: function(el, value, prevValue) {
                setTimeout(function setLogContent() {

                }, 5000);
            },
            hook: 'log'
        }
    },
    completeCallback: function() {
        this.queryByHook('log')
    },
    template: template
});
demo.render();


- completeCallback (Function // default: noop)
    - Fired when all forms are complete (valid).  This will fire immediately if all forms are valid on initialization
- cycle (boolean // default: false)
    - determines whether the form set is circular (e.g. next() sets the current form to the first form when the last form selected)
- eagerLoad (boolean) Render form in `formContainer` on init
    - `true` //=> loads first form
    - `'all'` //=> loads all forms
    - `function (formsCollection, CurrentView) { ... }` //=> user specific actions to be executed at load time.
- formContainer (Element)
    - node which package renders FormViews into
- forms (Collection|array|Function)
    - collection of forms to render in view.  Function must return Collection or array.  Async not yet supported (PR welcomed).
- freezeState (boolean // default: true)
    - on each next/prev scroll through the form collection, does a `form.reset`
- template [String|Function]
    Template must contain an element with `data-hook="form-container"` to render the forms in *if* the view is to be rendered.  The default view may be used
- value [FormView]
    default form loaded in view

#### next() / prev()
Sets the view to the next/previous form.  If no forms available, does nothing. If `cycle` is permitted on the form manager view, the views will rotate circularly.

#### setForm([FormView])
Sets the View's switcher to the requested form.  Throws Error if the requested FormView not present


### properties

- `complete` [boolean] - `true` when all forms in `forms` collection are `valid`.
- `completed` [Array] - returns an array of valid form views
- `current` [FormView] - current form rendered by view
- `remaining` [Array] - returns an array of invalid form views
