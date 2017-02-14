![travis CI](https://travis-ci.org/ivanrod/polobx.svg?branch=master "Travis Build")

# Polobx

State manager for Polymer based in [MobX](https://github.com/mobxjs/mobx).

It uses [Monostate Pattern](http://wiki.c2.com/?MonostatePattern) such that any instance with the behavior will share the same state.

Inspired by [tur-nr/polymer-redux](https://github.com/tur-nr/polymer-redux) & [flux](https://facebook.github.io/flux/).

You can see an example app [here](https://github.com/ivanrod/polobx-demo-app).

[See the docs](https://ivanrod.github.io/polobx/).

# Table of Contents
1. [Install](#install)
2. [Usage](#usage)
  - [Binding Properties](#binding-properties)
  - [Dispatch Actions](#dispatch-actions)
3. [Polobx API](#polobx-api)
4. [License](#license)

## Install

With bower do:

```bash
$ bower install --save polobx
```

## Usage

Create the behavior (with your stores & actions) to have access to the bindings:

*my-state.html*
```html
<link rel="import" href="../bower_components/polobx/polobx.html">

<script type="text/javascript">
var myStore = {

  store: {
    foo: 'bar'
  },

  actions: {
    changeFoo: function(newFoo) {
      this.store.foo = newFoo;
    }
  }
};

var myOtherStore = {

  store: {
    counter: 0,
    xxx: {
      xx: 'x'
    }
  },

  actions: {
    addOne: function() {
      this.store.counter++;
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

Gets a field/property of the selected store.

Example:

```javascript
this.getStateProperty('myStore', 'foo');
// -> 'bar'
```

## License

MIT © [ivanrod](https://github.com/ivanrod).
