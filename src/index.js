window.createPolobxBehavior = function(stores) {
  let appState = {};

  Object.keys(stores).forEach( key => {
    const store = mobx.observable(stores[key].store);
    const actions = stores[key].actions;

    appState[key] = {
      store,
      actions
    };
  });

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

  function deepPathCheck(path, store) {
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
        for (let property in properties) {
          const statePath = properties[property].statePath;

          if (statePath && this._appState[statePath.store]) {
            mobx.autorun(() => {
              const store = this._appState[statePath.store].store;
              const appStateValue = deepPathCheck(statePath.path, statePath.store);
              // this[property] = store[statePath.path];
              this.set(property, mobx.toJS(appStateValue));
            });
          }
        }
      }

    }
  };
};
