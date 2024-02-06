export class StateLoader {
    loadState() {
      let storeName = '_appdata_store';
      try {
        let serializedState = localStorage.getItem(storeName);
  
        if (serializedState === null) {
          return this.initializeState();
        }
        return JSON.parse(serializedState);
      } catch (err) {
        return this.initializeState();
      }
    }
  
    saveState(state:any) {
      let storeName = '_appdata_store';
      try {
        let serializedState = JSON.stringify(state);
        localStorage.setItem(storeName, serializedState);
      } catch (err) {}
    }
  
    initializeState() {
      return {
        //state object
      };
    }
  }
  
  export default StateLoader;
  