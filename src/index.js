import { useStrict, autorun, toJS } from 'mobx';
import { appStateReducer, deepPathCheck, dispatch } from './store.utils.js';

export default function(stores) {

  // Create app state with the provided stores
  let appState = appStateReducer(stores);

  // Enable strict mode
  // it allows store changes only throught actions
  useStrict(true);

  return {

    created() {
      this._appState = appState;
      this.dispatch = dispatch.bind(this, appState);
    },

    attached() {
      const properties = this.properties;

      if (properties) {
        Object.keys(properties).forEach( property => {
          const { [property]: { statePath } } = properties;

          // If property has statePath field with a proper store
          // -> subscribe to state mutations
          if (statePath && this._appState.hasOwnProperty(statePath.store)) {
            autorun(() => {
              const appStateValue = deepPathCheck(appState, statePath.store, statePath.path);

              // Update property with mutated state value
              this.set(property, toJS(appStateValue));
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
      const stateProperty = deepPathCheck(appState, store, path);

      return toJS(stateProperty);
    }
  };
}
