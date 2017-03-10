/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

import { autorun, observable, extendObservable, action, toJS } from 'mobx';

/**
 * Create a mobx actions object
 * @param  {Object} actions Raw actions functions
 * @return {Object}         Mobx actions
 */
function actionsReducer(actions) {
  return Object.keys(actions).reduce( (prevActions, actionName) => {
    prevActions[actionName] = action.bound(actions[actionName]);

    return prevActions;
  }, {});
}

function getStore(state, storeName) {
  const { store, actions } = state[storeName];
  const fullStore = {
    store: toJS(store), // toJS to prevent changes in other stores?
    actions // Remove?
  };

  return fullStore;
}

/**
 * Iterates through a polymer element properties to find statePath atribute
 * subscribing it to state mutations
 * @param {Object} appState
 * @param {Object} element
 * @param {Object} properties
 */
export function addStatePathBinding(appState, element) {
  const properties = element.properties;

  return Object.keys(properties).forEach( property => {
    const { [property]: { statePath } } = properties;

    // If property has statePath field with a proper store
    // -> subscribe to state mutations
    if (statePath && element._appState.hasOwnProperty(statePath.store)) {
      autorun(() => {
        const appStateValue = deepPathCheck(appState, statePath.store, statePath.path);

        // Update property with mutated state value
        element.set(property, toJS(appStateValue));
      });
    }
  });
}

/**
 * Create an app state with the provided stores
 * @param  {Object} stores
 * @return {Object}       app state
 */
export function appStateReducer(stores) {
  return Object.keys(stores).reduce( (state, key) => {
    // mobx.observable() applies itself recursively by default,
    // so all fields inside the store are observable
    const store = observable(stores[key].store);
    const actions = actionsReducer(stores[key].actions);

    state[key] = {
      getStore: getStore.bind(this, state),
      extendObservable,
      action,
      store,
      actions
    };

    return state;
  }, {});
}

/**
 * Dispach an action to a defined store
 * @param  {Object} appState
 * @param  {string} store   Store name
 * @param  {string} action  Action name
 * @param  {any} payload Payload data. Optional
 * @return {Object}         Store object
 */
export function dispatch(appState, {store, action: actionName, payload}) {
  if (appState[store] && appState[store].actions && appState[store].actions[actionName]) {
    const storeAction = appState[store].actions[actionName];

    return storeAction.apply(appState[store], [payload]);
  }

  console.warn(`No action "${action}" for "${store}" store`);
}

/**
 * Get a deep property value from a store
 * @param  {Object} appState
 * @param  {string} storeName
 * @param  {string} path  Example: path.subpath.subsubpath
 * @return {any}
 */
export function deepPathCheck(appState, storeName, path) {
  const pathArray = path.split('.');
  const { [storeName]: { store } } = appState;

  return pathArray.reduce((prev, next) => {
    const hasNextPath = prev && prev.hasOwnProperty && prev.hasOwnProperty(next);

    if (hasNextPath) {
      return prev[next];
    }
  }, store);
}
