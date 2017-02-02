"use strict";

var createPolobxBehavior = function createPolobxBehavior(stores) {
  var appState = {};

  Object.keys(stores).forEach(function (key) {
    var store = mobx.observable(stores[key].store);
    var actions = stores[key].actions;

    appState[key] = {
      store: store,
      actions: actions
    };
  });

  function dispatch(_ref) {
    var store = _ref.store,
        action = _ref.action,
        payload = _ref.payload;

    if (appState[store] && appState[store].actions && appState[store].actions[action]) {
      var storeAction = appState[store].actions[action];

      mobx.action(storeAction.bind(appState[store], [payload]))();

      return appState[store];
    }

    console.warn("No action \"" + action + "\" for \"" + store + "\" store");
  };

  mobx.useStrict(true);

  return {
    created: function created() {
      this._appState = appState;
      this.dispatch = dispatch;
    },
    attached: function attached() {
      var _this = this;

      var properties = this.properties;

      if (properties) {
        var _loop = function _loop(property) {
          var statePath = properties[property].statePath;

          if (statePath && _this._appState[statePath.store]) {
            mobx.autorun(function () {
              var store = _this._appState[statePath.store].store;
              // this[property] = store[statePath.path];
              _this.set(property, store[statePath.path]);
            });
          }
        };

        for (var property in properties) {
          _loop(property);
        }
      }
    }
  };
};