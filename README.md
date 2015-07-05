[ ![Codeship Status for cdaringe/ampersand-form-manager-view](https://codeship.com/projects/dd792fa0-0511-0133-1aec-265ba245c2c5/status?branch=master)](https://codeship.com/projects/89424)

# ampersand-form-manager-view
Manage groups of forms!  Use to:
- render sets of forms within a form-wrapper,
- gather meta about a collection of forms, or
- display/extract data about the group of forms.

## why would i use this?
Use this if you need to present a series of [forms](AmpersandJS/ampersand-form-view) to a user, but wish to collect the data from the full form set all at once.  Often times a client may need to go through several pages/views to fill in all of their information in non-trivial transactions.  This package makes it easy to present several forms, then agregate the composite result into a single js object.  Under the same thought, it is an excellent questionairre foundation.

In a nutshell, this package can be used to manage various forms as though they were subsets of a larger, grander form.

## demo
The demo is tightly coupled to all of the examples used in the tests.  Run `npm run demo` to check out each example!

## api

### methods

#### construtor(opts)
- autoAppend (boolean // default: true)
    - add FormView to form-manager-view container, vs. allowing the FormView to bind to it's own el
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

**ToDo**, change from checking `valid` to `complete` or `submitted`, if we can make them available in FormView

# Todo

* Convert ampersand-form-view dependency to upstream once [3.0.0 PR](https://github.com/AmpersandJS/ampersand-form-view/pull/35) *and* `autoRender: false` support make it in to core
* `eagerLoad` ToDos
* Use better indicator that a form is complete than `valid`
* Better support for some ampersand fields that currently don't report a valid value.
* Add cached mixin, extend FormView, or PR FormView for setting `completed` on the Form for improving this module's `complete` accuracy
