const myStore =   {
  model: {
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
      this.model.foo = newFoo;
    },

    addOne: function() {
      this.model.counter++;
    },

    addColor: function(color) {
      this.model.colors.push(color);
    }

  }
};

const PolobxBehavior = createPolobxBehavior(
  {
    myStore
  }
);
