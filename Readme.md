# Polobx

State manager for Polymer based in [mobx](https://github.com/mobxjs/mobx).

It uses [Monostate Pattern](http://wiki.c2.com/?MonostatePattern) such that any instance with the behavior will share the same state.

Inspired by [tur-nr/polymer-redux](https://github.com/tur-nr/polymer-redux) & [flux](https://facebook.github.io/flux/).

You can see an example app [here](https://github.com/ivanrod/polobx-demo-app).

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
    counter: 0
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

## License

MIT © [ivanrod](https://github.com/ivanrod).
