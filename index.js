const createPolobxBehavior = function(stores) {
  let appState = {};

  Object.keys(stores).forEach( key => {
    const store = mobx.observable(stores[key].store);
    const actions = stores[key].actions;

    appState[key] = {
      store,
      actions
    };
  });

  function dispatch({store, action, payload}) {
    if (appState[store] && appState[store].actions && appState[store].actions[action]) {
      const storeAction = appState[store].actions[action];

      mobx.action(storeAction.bind(appState[store], [payload]))();

      return appState[store];
    }

    console.warn(`No action "${action}" for "${store}" store`);
  };

  mobx.useStrict(true);

  return {

    created() {
      this._appState = appState;
      this.dispatch = dispatch;
    }

    attached() {
      const properties = this.constructor.config.properties;

      if (properties) {
        for (let property in properties) {
          const statePath = properties[property].statePath;

          if (statePath && this._appState[statePath.store]) {
            mobx.autorun(() => {
              const store = this._appState[statePath.store].store;
              this[property] = store[statePath.path];
            });
          }
        }
      }

    }
  };
};
