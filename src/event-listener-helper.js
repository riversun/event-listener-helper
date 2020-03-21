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
    // console.log(`addEventListener listener=${listener} options=${JSON.stringify(options)}`);
    let optionsClone = null;
    if (options) {
      optionsClone = this._cloneJson(options);
    }
    if (arguments.length > 4) {
      throw Error('Too many arguments');
    }
    this._checkTypeOfOptions(optionsClone);
    let listenerName = null;
    if (optionsClone && optionsClone.listenerName) {
      listenerName = optionsClone.listenerName;
    }
    let onceWrapperListener = null;
    if (optionsClone && optionsClone.once) {
      // Once is handled on this library side,
      // so remove it from options
      // so that it is not evaluated by addEventListener.
      // Set callbackOnce instead
      delete optionsClone.once;
      optionsClone.callbackOnce = true;
      onceWrapperListener = (e) => {
        listener(e);
        // remove listener
        // listener is null to extract the listener information registered with listenerName
        this.removeEventListener(eventTarget, eventType, null, optionsClone);
      };
    }
    const result = {
      listenerName: null,
      success: true,
    };
    // When using once, wrap the listener specified by the user
    if (onceWrapperListener) {
      eventTarget.addEventListener(eventType, onceWrapperListener, optionsClone);
    } else {
      eventTarget.addEventListener(eventType, listener, optionsClone);
    }
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
      listenerFuncsForName.set(listenerName,
        {
          listener,
          onceListener: onceWrapperListener,
          options: optionsClone,
        });
      result.listenerName = listenerName;
    } else {
      // listenerName equals null
      const randomListenerName = `listener-${this.listenerNum}`;
      listenerFuncsForName.set(randomListenerName,
        {
          listener,
          onceListener: onceWrapperListener,
          options: optionsClone,
        });
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
      const listenerInfo = listenerFuncsForName.get(listenerName);
      if (!listenerInfo) {
        result.message = `DOM element ${eventTarget}(id=${eventTarget.id}) doesn't have "${eventType}" listener "${listenerName}"`;
        return result;
      }
      listenerFuncsForName.delete(listenerName);

      if (options && options.callbackOnce) {
        eventTarget.removeEventListener(eventType, listenerInfo.onceListener, options);
      } else {
        eventTarget.removeEventListener(eventType, listenerInfo.listener, options);
      }
      result.success = true;
    }
    if (listener) {
      const searchKey = 'listener';
      const searchVal = listener;
      // The specified listener object is stored as part of the map value.
      // Gets the map key to search for that map value.
      const resultListenerName = this._searchKeyInValueContent(listenerFuncsForName, searchKey, searchVal);
      if (resultListenerName) {
        const storedListenerInfo = listenerFuncsForName.get(resultListenerName);
        // const storedListener = storedListenerInfo.listener;
        const storedOnceListener = storedListenerInfo.onceListener;
        const storedOptions = storedListenerInfo.options;
        // Whether the listener is registered.
        // Listeners not registered with this method are not deleted
        if (storedOnceListener) {
          eventTarget.removeEventListener(eventType, storedOnceListener, storedOptions);
        } else {
          eventTarget.removeEventListener(eventType, listener, storedOptions);
        }
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

  _searchKeyInValueContent(map, searchKey, searchValue) {
    for (const [k, v] of map) {
      if (v[searchKey] === searchValue) {
        return k;
      }
    }
    return null;
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

  _cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
  }
}
