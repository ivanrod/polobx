## Stores

A store it's an object where you define the store itself and the actions to modify it.

Polobx will transform your store into [MobX observables](https://mobx.js.org/refguide/observable.html) and your actions to [MobX actions](https://mobx.js.org/refguide/action.html) so you can use them to manage your app state.

Let's see an example:

```javascript
var myStore = {
  store: {
    users: {},
    otherData: '',
    counter: 0,
    foo: 'bar'
  },

  actions: {
    /**
     * When dispatched, this action will modify counter property,
     * adding 1 to the current state value
     */
    addCount: function() {
      this.store.counter++;
    },

    /**
     * This one modifies foo property with a new value
     */
    modifyFoo: function(newValue) {
      this.store.foo = 'otherBar';
    }
  }
};
```

MobX methods [`action`](https://mobx.js.org/refguide/action.html) & [`extendObservable`](https://mobx.js.org/refguide/extend-observable.html) are exposed in the store context so you can use them to create async actions or modify your store.

## Actions

Polobx uses [`useStrict`](https://github.com/mobxjs/mobx/blob/gh-pages/docs/refguide/api.md#usestrict) method from MobX so you can only modify your store through actions.

If you need to extend your store tree with other objects or arrays you can use `extendObservable` method to make them observables:

```javascript
...
  addUser: function() {
    var user = {
      name: 'Ivan',
      surname: 'Rodriguez'
    };

    this.extendObservable(this.state.users, user);
  }
...
```

You have access to other stores using `getStore()` method.

```javascript
...
  addCountConditionally: function() {
    var otherStore = getStore('otherStore');
    if (otherStore.store.foo) {
      this.store.count++;
    }

    otherStore.actions.otherStoreAction();
  },

...
```

`getStore().store` prevents you to modify the foreign store, you need to do this through a defined action.

## Async actions

Sometimes you will need to create *async actions* (for example, to modify your store with data provided from a server) then you can use `action` method allow you:

```javascript
...
  fetchFromServer: function() {
    var self = this;

    return fetch('data.json')
    .then(parseJson) // parse json object method
    .then(this.action(function(response) {
      var otherData = response.otherData;
      self.store.otherData = otherData;
    }));
  }
...
```

Note that if you return something in your action, this will be provided in `dispatch` method of your Polobx behavior (in this case, a promise).

You can do the same using other store action, in this case, you should use `bind` to specify the context:

```javascript
...
  modifyOtherData: function(response) {
    var otherData = response.otherData;
    this.store.otherData = otherData;
  },

  fetchFromServer: function() {    
    return fetch('data.json')
    .then(parseJson) // parse json object method
    .then(this.actions.modifyOtherData.bind(this));
  }
...
```

In the previous examples, native method [`fetch`](https://developer.mozilla.org/es/docs/Web/API/Fetch_API) is used, but you can use your favorite XHR library too.
