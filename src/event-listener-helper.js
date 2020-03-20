/**
 * Helper class to name event listener and make it easier to delete
 */
export default class EventListenerHelper {
  constructor() {
    // this.listeners={ele1:{'click':[func1,func2]},ele2:{'click':[func1,func2]}}
    this.listeners = new Map();
    this.listenerNum = 0;
  }

  addEventListener(eventTarget, eventType, listener, options) {
    // console.log(`addEventListener ${JSON.stringify(options)}`);
    if (arguments.length > 4) {
      throw Error('Too many arguments');
    }
    this._checkTypeOfOptions(options);
    let listenerName = null;
    if (options && options.listenerName) {
      listenerName = options.listenerName;
    }
    const result = {
      listenerName: null,
      success: true,
    };
    eventTarget.addEventListener(eventType, listener, options);
    let listenerMapForEle = this.listeners.get(eventTarget);// returns Map
    if (!listenerMapForEle) {
      listenerMapForEle = new Map();
      this.listeners.set(eventTarget, listenerMapForEle);
    }
    let listenerFuncsForName = listenerMapForEle.get(eventType);// returns Map
    if (!listenerFuncsForName) {
      listenerFuncsForName = new Map();
      listenerMapForEle.set(eventType, listenerFuncsForName);
    }

    if (listenerName !== null) {
      // listenerName not equals null
      listenerFuncsForName.set(listenerName, listener);
      result.listenerName = listenerName;
    } else {
      // listenerName equals null
      const randomListenerName = `listener-${this.listenerNum}`;
      listenerFuncsForName.set(randomListenerName, listener);
      result.listenerName = randomListenerName;
      this.listenerNum += 1;
    }
    return result;
  }

  removeEventListener(eventTarget, eventType, listener, options) {
    // console.log(`removeEventListener ${JSON.stringify(options)}`);
    this._checkTypeOfOptions(options);
    let listenerName = null;
    if (options && options.listenerName) {
      listenerName = options.listenerName;
    }
    const result = {
      success: false,
      message: 'unknown error',
    };

    const listenerMapForEle = this.listeners.get(eventTarget);// returns map
    if (!listenerMapForEle) {
      result.message = `DOM element ${eventTarget}(id=${eventTarget.id}) doesn't have any listeners.`;
      return result;
    }
    const listenerFuncsForName = listenerMapForEle.get(eventType);// returns map
    if (!listenerFuncsForName) {
      result.message = `DOM element ${eventTarget}(id=${eventTarget.id}) doesn't have "${eventType}" listeners.`;
      return result;
    }
    // check listener function exists
    if (listener === null) {
      const listenerFunc = listenerFuncsForName.get(listenerName);
      if (!listenerFunc) {
        result.message = `DOM element ${eventTarget}(id=${eventTarget.id}) doesn't have "${eventType}" listener "${listenerName}"`;
        return result;
      }
      listenerFuncsForName.delete(listenerName);
      eventTarget.removeEventListener(eventType, listenerFunc, options);
      result.success = true;
    }
    if (listener) {
      if (this._isMapHasValue(listenerFuncsForName, listener)) {
        // Whether the listener is registered.
        // Listeners not registered with this method are not deleted
        eventTarget.removeEventListener(eventType, listener, options);
        result.success = true;
      } else {
        result.success = false;
        result.message = `Specified listener could not be deleted from DOM element ${eventTarget}(id=${eventTarget.id}).
        Since the specified listener is not registered as an event listener,
        it may have been registered outside of event-listener-helper.`;
      }
    }
    return result;
  }

  _isMapHasValue(map, value) {
    return Array.from(map.values()).includes(value);
  }

  _checkTypeOfOptions(options) {
    // console.log(`_checkTypeOfOptions ${typeof options}`)
    if (typeof options === 'object' || typeof options === 'undefined') {
      // no error
      return;
    }
    if (typeof options === 'boolean') {
      throw new Error(`Type of boolean is not accepted as the fourth argument you specify.
      If you want to enable useCapture, specify {capture: true} as the fourth parameter instead.`);
    } else {
      throw new Error(`Type of ${typeof options} is not accepted as the fourth argument you specify.
      If you want to specify options, specify an object like {capture: true, listenerName:'my-listener-01'}.`);
    }
  }
}
