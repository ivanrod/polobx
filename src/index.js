import { useStrict, toJS } from 'mobx';
import { appStateReducer, addStatePathBinding, addStateObservers, deepPathCheck, dispatch } from './store.utils.js';

export default function(stores, middlewares) {

  // Create app state with the provided stores
  const appState = appStateReducer(stores);

  // Enable strict mode
  // it allows store changes only throught actions
  useStrict(true);

  return {

    created() {
      this._appState = appState;
      this._disposers = [];
      this.dispatch = dispatch.bind(this, appState, middlewares);
    },

    attached() {
      if (this.properties) {
        const stateBindingsDisposers = addStatePathBinding(appState, this);
        this._disposers = this._disposers.concat(stateBindingsDisposers);
      }

      if (this.stateObservers) {
        const stateObserversDisposers = addStateObservers(appState, this);
        this._disposers = this._disposers.concat(stateObserversDisposers);
      }

    },

    detached() {
      this._disposers.forEach(disposer => disposer());
    },

    /**
     * Gets a field/property of the selected store
     * @param  {string} store
     * @param  {string} path
     * @return {any}  field/property value
     */
    getStateProperty(store, path) {
      const stateProperty = deepPathCheck(appState, store, path);

      return toJS(stateProperty);
    }
  };
}
