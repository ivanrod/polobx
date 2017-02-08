(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('mobx')) :
  typeof define === 'function' && define.amd ? define('createPolobxBehavior', ['mobx'], factory) :
  (global.createPolobxBehavior = factory(global.mobx));
}(this, (function (mobx) { 'use strict';

mobx = 'default' in mobx ? mobx['default'] : mobx;

/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

var index = function (stores) {

  // Create app state with the provided stores
  var appState = Object.keys(stores).reduce(function (state, key) {
    // mobx.observable() applies itself recursively by default,
    // so all fields inside the store are observable
    var store = mobx.observable(stores[key].store);
    var actions = stores[key].actions;

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
  function dispatch(_ref) {
    var store = _ref.store,
        action = _ref.action,
        payload = _ref.payload;

    if (appState[store] && appState[store].actions && appState[store].actions[action]) {
      var storeAction = appState[store].actions[action];

      mobx.action(storeAction.bind(appState[store], [payload]))();

      return appState[store];
    }

    console.warn('No action "' + action + '" for "' + store + '" store');
  }

  /**
   * Get a deep property value from a store
   * @param  {string} store
   * @param  {string} path  Example: path.subpath.subsubpath
   * @return {any}
   */
  function deepPathCheck(store, path) {
    var pathArray = path.split('.');

    var appStateValue = pathArray.reduce(function (prev, next) {
      if (prev === undefined) {
        return;
      }

      var nextPath = prev[next];
      // TODO: Use hasOwnProperty() method
      if (nextPath !== undefined) {
        return nextPath;
      }
    }, appState[store].store);

    return appStateValue;
  }

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
        Object.keys(properties).forEach(function (property) {
          var statePath = properties[property].statePath;
          // TODO: Use hasOwnProperty() method
          // If property has statePath attribute -> subscribe to state mutations

          if (statePath && _this._appState[statePath.store]) {
            mobx.autorun(function () {
              var appStateValue = deepPathCheck(statePath.store, statePath.path);

              // Update property with mutated state value
              _this.set(property, mobx.toJS(appStateValue));
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
    getStateProperty: function getStateProperty(store, path) {
      var stateProperty = deepPathCheck(store, path);

      return mobx.toJS(stateProperty);
    }
  };
};

return index;

})));
