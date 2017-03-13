import { useStrict, toJS } from 'mobx';
import { appStateReducer, addStatePathBinding, addStateObservers, deepPathCheck, dispatch } from './store.utils.js';

export default function(stores) {

  // Create app state with the provided stores
  const appState = appStateReducer(stores);

  // Enable strict mode
  // it allows store changes only throught actions
  useStrict(true);

  return {

    created() {
      this._appState = appState;
      this.dispatch = dispatch.bind(this, appState);
    },

    attached() {
      if (this.properties) {
        addStatePathBinding(appState, this);
      }

      if (this.stateObservers) {
        addStateObservers(appState, this);
      }

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
