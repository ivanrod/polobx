## Install

To install Polobx in your project with bower do:

```bash
$ bower install --save polobx
```

You can download it from npm repositories too:

```bash
$ npm install polobx --save
```

Or using yarn:

```bash
$ yarn add polobx
```

## Import

Now you can import `polobx.html` that will expose `createPolobxBehavior` factory. Use this factory to create your Polobx behavior with the stores that you need in your application. You can create as many stores to define your app state.

![App State](images/appState.png)

You should do this in a separate html file that you will import in every component that need to use your Polobx behavior. In the next example, this file is `my-state.html`.

`my-state.html`
```html
<link rel="import" href="../bower_components/polobx/polobx.html">

<script type="text/javascript">
var myStore = {...};

var myOtherStore = {...};

window.PolobxBehavior = createPolobxBehavior(
  {
    myStore: myStore,
    myOtherStore: myOtherStore
  }
);
</script>
```

[See how to create your stores in the next section](create-stores.md)
