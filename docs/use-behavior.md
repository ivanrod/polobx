## Binding properties

With your `PolobxBehavior` you can bind your state to your elements properties.

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
