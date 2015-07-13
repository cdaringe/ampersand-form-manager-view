[ ![Codeship Status for cdaringe/ampersand-form-manager-view](https://codeship.com/projects/dd792fa0-0511-0133-1aec-265ba245c2c5/status?branch=master)](https://codeship.com/projects/89424)

# ampersand-form-manager-view
Manage groups of forms!  Use to:
- render sets of forms within a form-wrapper,
- gather meta about a collection of forms, or
- display/extract data about the group of forms.

# demo
See github.io page here: [cdaringe.github.io/ampersand-form-manager-view](http://cdaringe.github.io/ampersand-form-manager-view/)

## micro-demos
Run `npm run demo` to check out each example.  Note, these are tightly coupled with the test suite.

## why would i use this?
Use this if you need to present a series of [forms](AmpersandJS/ampersand-form-view) to a user, but wish to collect the data from the full form set all at once.  Often times a client may need to go through several pages/views to fill in all of their information in non-trivial transactions.  This package makes it easy to present several forms, then agregate the composite result into a single js object.  Under the same thought, it is an excellent questionnaire foundation.

In a nutshell, this package can be used to manage various forms as though they were subsets of a larger, grander form.


## api

### methods

#### constructor(opts)
- autoAppend (boolean // default: true)
    - add forms (FormView instances) to container, vs. allowing each form to bind to its own el
- completeCallback (Function // default: noop)
    - Fired when all forms are complete (valid).  This will fire immediately if all forms are valid on initialization
- cycle (boolean // default: false)
    - determines whether the form set is circular (e.g. next() sets the current form to the first form when the last form selected)
- eagerLoad (boolean) Render form in `formContainer` on init
    - `true` //=> loads first form
    - `function (formsCollection, CurrentView) { ... }` //=> user specific actions to be executed at load time.
- formContainer (Element|string|function // default: 'form-container')
    - node that forms rendered into. if a string is provided, it must be a ref to a `data-hook` attr on a node.
- forms (Collection|array|Function)
    - collection of forms to render in view.  Function must return Collection or array.  Async not yet supported (PR welcomed).
- freezeState (boolean // default: true)
    - on each next/prev scroll through the form collection, does a `form.reset`
- singleObject: (boolean // default: false)
    - data by default is returned as an array of objects (results of all forms `.data` calls).  This mode flattens all data into a single object.
- value [FormView]
    default form loaded in view
- validOnly (boolean // default: false)
    - next/prev form calls will not be allowed to change form view unless current form valid

#### next() / prev()
Sets the view to the next/previous form.  If no forms available, does nothing. If `cycle` is permitted on the form manager view, the views will rotate circularly.

#### setForm([FormView])
Sets the View's switcher to the requested form.  Throws Error if the requested FormView not present


### properties

- `complete` [boolean] - `true` when all forms in `forms` collection are `valid`.
- `completed` [Array] - returns an array of valid form views
- `current` [FormView] - current form rendered by view
- `remaining` [Array] - returns an array of invalid form views

### usage
- When extending FormManagerView to customize the `template ([String|Function])`, ensure that it contain an element with `data-hook="form-container"` to render the forms in *if* the view is to be rendered.  The default view may be used, or, if you may use `formContainer` in the constructor instead.


# Todo
* KNOWN BUG: discrepancy between rendered `afmv.data` and all composite `form`s `.data`s. events dropped?  see `bug1` in src
* `eagerLoad: all` support (lo-pro)
