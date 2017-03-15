## Binding properties

With your `PolobxBehavior` you can bind your state to your elements properties.

Use `statePath` field in your property to define the store and model path you want to bind to it:

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

## State Observers

You can listen to state changes in your component using state observers too.
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

## Dispatching actions

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
          store: 'myStore', // Your store name
          action: 'changeFoo', // The action to trigger
          payload: 'OtherBar' // The data provided to your action
        })
      }

    });
  </script>
</dom-module>
```

`dispatch` receives whatever your action returns (for example a promise, useful to put a spinner):

```javascript
...
fetchWithData: function() {
  var self = this;

  this.putYourSpinnerOn();

  this.dispatch({
    store: 'myStore',
    action: 'fetchWithDataAction'
  })
  .then(function() {
    self.putYourSpinnerOff();
  })
}
...
```
