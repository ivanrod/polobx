![travis CI](https://travis-ci.org/ivanrod/polobx.svg?branch=master "Travis Build")
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/ivanrod/polobx)

# Polobx

State manager for Polymer based on [MobX](https://github.com/mobxjs/mobx).

Uses the [Monostate Pattern](http://wiki.c2.com/?MonostatePattern) such that any instance with the behavior will share the same state.

Inspired by [tur-nr/polymer-redux](https://github.com/tur-nr/polymer-redux) & [flux](https://facebook.github.io/flux/).

You can see an example app [here](https://github.com/ivanrod/polobx-demo-app).

[See the docs](https://ivanrod.github.io/polobx/).

# Table of Contents
1. [Install](#install)
2. [Usage](#usage)
  - [Binding Properties](#binding-properties)
  - [State observers](#state-observers)
  - [Dispatch Actions](#dispatch-actions)
3. [Polobx API](#polobx-api)
4. [License](#license)

## Install

With bower:

```bash
$ bower install --save polobx
```

## Usage

Use the `createPolobxBehavior` factory method to create the behavior. This will give the behavior access to the bindings:

*my-state.html*
```html
<link rel="import" href="../bower_components/polobx/polobx.html">

<script type="text/javascript">
var myStore = {

  model: {
    foo: 'bar'
  },

  actions: {
    changeFoo: function(newFoo) {
      this.model.foo = newFoo;
    }
  }
};

var myOtherStore = {

  model: {
    counter: 0,
    xxx: {
      xx: 'x'
    }
  },

  actions: {
    addOne: function() {
      this.model.counter++;
    }
  }
};

window.PolobxBehavior = createPolobxBehavior(
  {
    myStore: myStore,
    myOtherStore: myOtherStore
  }
);
</script>

```

### Binding Properties

With your `PolobxBehavior` you can bind your state to properties of your elements.

Use `statePath` field in your property to define the store and path you want to bind to it:

*my-view.html*
```html
<link rel="import" href="my-state.html">
<dom-module id="my-view">
  <template>
    ...
    <p>My element var: [[myVar]]</p>
    ...
  </template>
  <script>
    Polymer({
      is: 'my-view',

      behaviors: [PolobxBehavior],

      properties: {

        myVar: {
          type: String,
          statePath: {
            store: 'myStore',
            path: 'foo'
          }
        },

        myOtherVar: {
          type: String,
          statePath: {
            store: 'myOtherStore',
            path: 'xxx.xx'
          }
        }

      }
    });
  </script>
</dom-module>
```

### State Observers

Define a `stateObservers` field in your component with a list of observers of your state:

```html
<link rel="import" href="my-state.html">
<dom-module id="my-view">
  <template>
    ...
    <p>My colors counter: [[myColorsCounter]]</p>
    <p>My foo: [[myFoo]]</p>
    ...
  </template>
  <script>
    Polymer({
      is: 'my-view',

      behaviors: [PolobxBehavior],

      stateObservers: [
        // Store path observer
        {
          store: 'myStore',
          path: 'colors',
          observer: function(colors) {
            if (colors.length > 4) {
              this.set('myColorsCounter', 'We have more than 4.')
            }
          }
        },

        // Store observer
        {
          store: 'myStore',
          observer: function(state) {

            if (state.foo === 'bar') {
              this.set('myFoo', 'My foo is actually bar.')
            }
          }
        }

      ],

      properties: {

        myColorsCounter: String,

        myFoo: String

      }
    });
  </script>
</dom-module>
```

### Dispatch actions

Using `PolobxBehavior` you can use `dispatch()` inside your element to dispatch a defined action of your store:

*my-other-view.html*
```html
<link rel="import" href="my-state.html">
<dom-module id="my-other-view">
  <template>
    ...
    <button on-click="changeOtherViewVar">X</button>
    ...
  </template>
  <script>
    Polymer({
      is: 'my-other-view',

      behaviors: [PolobxBehavior],

      changeOtherViewVar: function() {
        this.dispatch({
          store: 'myStore',
          action: 'changeFoo',
          payload: 'OtherBar'
        })
      }

    });
  </script>
</dom-module>
```

## Polobx API

### Behavior API

#### dispatch({store:string, action:string, payload:any})

Dispatch an action to a defined store.

Returns the action result.

Example:

```javascript
this.dispatch({
          store: 'myStore',
          action: 'changeFoo',
          payload: 'OtherBar'
        });
// -> <Action Result>
```

#### getStateProperty(store:string, path:string)

Get a field/property of the selected store.

Returned value is just a copy of the store property, you can only modify it when dispatching an action.

Example:

```javascript
this.getStateProperty('myStore', 'foo');
// -> 'bar'
```

## Test

Run:

```bash
npm run test
```

## License

MIT © [ivanrod](https://github.com/ivanrod).
