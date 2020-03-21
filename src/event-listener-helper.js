/**
 * This library allows you to:
 * get a list of event listeners attached to the target node,
 * confirms the existence of event listener registered on the target node,
 * deletes all event listeners registered on the target node,
 * registers event listeners with name (rather than a reference).
 * These benefits can be received by calling addEventListener and removeEventListener through this library.
 *
 * MIT License
 * @class EventListenerHelper
 * @author Tom Misawa (riversun.org@gmail.com,https://github.com/riversun)
 */
export default class EventListenerHelper {
  constructor() {
    // this.listeners={ele1:{'click':[func1,func2]},ele2:{'click':[func1,func2]}}
    this.listeners = new Map();
    this.listenerNum = 0;
  }

  /**
   * By using EventListenerHelper#addEventListener instead of EventTarget#addEventListener,
   * you can get the registered listener from EventListenerHelper using getEventListeners,
   * delete the individual listener by listenerName, and check the listener existence.
   * @memberof EventListenerHelper
   * @instance
   * @method
   * @param {EventTarget} eventTarget
   * EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.<br>
   *   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p>
   *
   * @param {String} eventType
   * A string which specifies the type of event for which to remove an event listener.
   *
   * @param {Function} listener
   <dd>The <a href="/en-US/docs/Web/API/EventListener"><code>EventListener</code></a> function of the event handler to remove from the event target.</dd>
   *
   * @param {Object=} options An options object specifies characteristics about the event listener.
   * The available options are:<br>
   <dl>
   <dt><code><var><b>listenerName</b></var></code></dt>
   <dd>A <code>String</code>By assigning listenerName, the specified listener function (callback function) can be specified.In other words, it is possible to retrieve the listener function later
   using this listenerName as a key.listenerName must be unique.
   </dd>
   <dt><var>options</var> <span class="inlineIndicator optional optionalInline">Optional</span></dt>
   <dd>An options object that specifies characteristics about the event listener. The available options are:
   <ul>
   <li><code>capture</code>: A&nbsp;<a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"><code>Boolean</code></a> that indicates that events of this type will be dispatched to the registered <code>listener</code>&nbsp;before being dispatched to any <code>EventTarget</code> beneath it in the DOM tree.</li>
   <li><span class="icon-only-inline" title="This API has not been standardized."><i class="icon-warning-sign"> </i></span><code> mozSystemGroup</code>: Available only in code running in XBL or in Firefox' chrome, it is a <a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"><code>Boolean</code></a> defining if the listener is added to the system group.</li>
   </ul>
   </dd>
   </dl>
   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">addEventListener</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p>
   * @returns {}
   */
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
      if (listenerFuncsForName.has(listenerName)) {
        throw Error(`The listenerName "${listenerName}" is already used for the specified event type ${eventType}`);
      }
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

  /**
   * The EventListenerHelper#removeEventListener method removes from the EventTarget an event listener previously registered with EventListenerHelper#addEventListener.
   The event listener to be removed is identified using option.
   listenerName and a combination of the event type, the event listener function itself,
   and various optional options that may affect the matching process; see Matching event listeners for removal
   * @memberof EventListenerHelper
   * @instance
   * @method
   * @param {EventTarget} eventTarget
   * EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.<br>
   *   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p>
   *
   * @param {String} eventType
   * A string which specifies the type of event for which to remove an event listener.
   *
   * @param {Function} listener
   * The object which receives a notification (an object that implements the <a href="/en-US/docs/Web/API/Event"><code>Event</code></a> interface)
   * when an event of the specified type occurs. This must be an object implementing the
   * <a href="/en-US/docs/Web/API/EventListener"><code>EventListener</code></a> interface, or a JavaScript <a href="/en-US/docs/JavaScript/Guide/Functions">function</a>.
   * See <a href="#The_event_listener_callback">The event listener callback</a> for details on the callback itself.
   *
   * @param {Object=} options An options object specifies characteristics about the event listener.
   * The available options are:<br>
   <dl>
   <dt><code><var><b>listenerName</b></var></code></dt>
   <dd>A <code>String</code>By assigning listenerName, the specified listener function (callback function) can be specified.In other words, it is possible to retrieve the listener function later
   using this listenerName as a key.listenerName must be unique.
   </dd>
   <dt><code><var>capture</var></code></dt>
   <dd>A <a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"><code>Boolean</code></a> indicating that events of this type will be dispatched to the registered <code>listener</code>
   before being dispatched to any <code>EventTarget</code> beneath it in the DOM tree.
   </dd>
   </dl>
   <p><a href="https://developer.mozilla.org/ja/docs/Web/API/EventTarget/removeEventListener">removeEventListener</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p>
   * @returns {}
   */
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
      if (!listenerName) {
        result.message = 'options.listenerName is not found';
        return result;
      }
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
