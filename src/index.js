window.createPolobxBehavior = function(stores) {

  // Create app state with the provided stores
  let appState = Object.keys(stores).reduce( (state, key) => {
    // mobx.observable() applies itself recursively by default,
    // so all fields inside the store are observable
    const store = mobx.observable(stores[key].store);
    const actions = stores[key].actions;

    state[key] = {
      store: store,
      actions: actions
    };

    return state;
  }, {});

  /**
   * Dispach an action to a defined store
   * @param  {string} store   Store name
   * @param  {string} action  Action name
   * @param  {any} payload Payload data. Optional
   * @return {Object}         Store object
   */
  function dispatch({store, action, payload}) {
    if (appState[store] && appState[store].actions && appState[store].actions[action]) {
      const storeAction = appState[store].actions[action];

      mobx.action(storeAction.bind(appState[store], [payload]))();

      return appState[store];
    }

    console.warn(`No action "${action}" for "${store}" store`);
  };

  /**
   * Get a deep property value from a store
   * @param  {string} store
   * @param  {string} path  Example: path.subpath.subsubpath
   * @return {any}
   */
  function deepPathCheck(store, path) {
    const pathArray = path.split('.');

    const appStateValue = pathArray.reduce((prev, next) => {
      if (prev === undefined) {
        return;
      }

      const nextPath = prev[next];

      if (nextPath !== undefined) {
        return nextPath;
      }
    }, appState[store].store);

    return appStateValue;
  };

  mobx.useStrict(true);

  return {

    created() {
      this._appState = appState;
      this.dispatch = dispatch;
    },

    attached() {
      const properties = this.properties;

      if (properties) {
        Object.keys(properties).forEach( property => {
          const { [property]: { statePath } } = properties;

          // If property has statePath attribute -> subscribe to state mutations
          if (statePath && this._appState[statePath.store]) {
            mobx.autorun(() => {
              const store = this._appState[statePath.store].store;
              const appStateValue = deepPathCheck(statePath.store, statePath.path);

              // Update property with mutated state value
              this.set(property, mobx.toJS(appStateValue));
            });
          }
        });
      }

    },

    /**
     * Gets a field/property of the selected store
     * @param  {string} store
     * @param  {string} path
     * @return {any}  field/property value
     */
    getStateProperty(store, path) {
      const stateProperty = deepPathCheck(store, path);

      return mobx.toJS(stateProperty);
    }
  };
};
