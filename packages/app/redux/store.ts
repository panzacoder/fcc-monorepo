import {createStore} from 'redux';
import rootReducer from './rootReducer';
import StateLoader from './stateLoader';

const stateLoader = new StateLoader();

const store = createStore(
  rootReducer,
  stateLoader.loadState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
store.subscribe(() => {
  stateLoader.saveState(store.getState());
});
export default store;
