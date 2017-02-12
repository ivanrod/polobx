const myStore =   {
  store: {
    counter: 0,
    colors: [],
    foo: 'bar',
    xxx: {
      xx: {
        x: 'yeah'
      }
    }
  },

  actions: {
    changeFoo: function(newFoo) {
      this.store.foo = newFoo;
    },

    addOne: function() {
      this.store.counter++;
    },

    addColor: function(color) {
      this.store.colors.push(color);
    }

  }
};

const PolobxBehavior = createPolobxBehavior(
  {
    myStore: myStore
  }
);
