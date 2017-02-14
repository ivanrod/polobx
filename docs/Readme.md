# Polobx

Polobx is a state manager for Polymer based in [MobX](https://github.com/mobxjs/mobx). It's inspired by unidirectional data flow architectures like [flux](https://facebook.github.io/flux/) and similar Polymer libraries like [tur-nr/polymer-redux](https://github.com/tur-nr/polymer-redux).

Polobx exposes a factory (`createPolobxBehavior({...})`) that you can use to create your behavior with your stores inside.

Use your Polobx behavior with components where you need to share and manage the app state. You can:

- bind component properties to app state properties
- dispatch actions to modify your stores
- access to your app state

You can see an example app [here](https://github.com/ivanrod/polobx-demo-app).
