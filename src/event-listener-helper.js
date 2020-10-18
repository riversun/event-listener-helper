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
    this.evTargetListenersMap = new Map();
    this.listenerNum = 0;
  }

  /**
   * @memberof EventListenerHelper
   * @instance
   * @method
   * @param {EventTarget} eventTarget
   * EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.<br>
   *   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p>
   *
   * @param {String} eventType
   * A case-sensitive string representing the <a href="/en-US/docs/Web/Events">event type</a> to listen for.
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
   <dt><code><var>once</var></code></dt>
   <dd>A <a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"><code>Boolean</code></a> indicating that the <code><var>listener</var></code> should be invoked at most once after being
   added. If <code>true</code>, the <code><var>listener</var></code> would be automatically removed when invoked.
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
      throw Error('Too many arguments. Number of arguments can be specified 4.');
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
        // listener is null to extract the listener definition registered with listenerName
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
    let evTypeListenersMap = this.evTargetListenersMap.get(eventTarget);// returns Map
    if (!evTypeListenersMap) {
      evTypeListenersMap = new Map();
      this.evTargetListenersMap.set(eventTarget, evTypeListenersMap);
    }
    let listenerDefs = evTypeListenersMap.get(eventType);// returns Map
    if (!listenerDefs) {
      listenerDefs = new Map();
      evTypeListenersMap.set(eventType, listenerDefs);
    }

    if (listenerName !== null) {
      // listenerName not equals null
      if (listenerDefs.has(listenerName)) {
        throw Error(`The listenerName "${listenerName}" is already used for the specified event type ${eventType}`);
      }
      listenerDefs.set(listenerName,
        {
          listener,
          onceListener: onceWrapperListener,
          options: optionsClone,
        });
      result.listenerName = listenerName;
    } else {
      // listenerName equals null
      const randomListenerName = `listener-${this.listenerNum}`;

      if (!optionsClone) {
        optionsClone = {};
      }
      optionsClone.listenerName = randomListenerName;
      listenerDefs.set(randomListenerName,
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
   * @param {Function=} listener
   * (Either the listener or options.listenerName must be specified. If both are specified, options.listenerName takes precedence.) <br>
   * The object which receives a notification (an object that implements the <a href="/en-US/docs/Web/API/Event"><code>Event</code></a> interface)
   * when an event of the specified type occurs. This must be an object implementing the
   * <a href="/en-US/docs/Web/API/EventListener"><code>EventListener</code></a> interface, or a JavaScript <a href="/en-US/docs/JavaScript/Guide/Functions">function</a>.
   * See <a href="#The_event_listener_callback">The event listener callback</a> for details on the callback itself.
   *
   * @param {Object=} options
   * (Either the listener or options.listenerName must be specified. If both are specified, options.listenerName takes precedence.)<br>
   * An options object specifies characteristics about the event listener.
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
    if (arguments.length < 3) {
      throw Error('Three or four arguments are required.');
    }
    this._checkTypeOfOptions(options);
    let listenerName = null;
    if (options && options.listenerName) {
      listenerName = options.listenerName;
    }
    const result = {
      success: false,
      message: 'unknown error',
    };

    const evTypeListenersMap = this.evTargetListenersMap.get(eventTarget);// returns map
    if (!evTypeListenersMap) {
      result.message = `DOM element ${eventTarget}(id=${eventTarget.id}) doesn't have any listeners.`;
      return result;
    }
    const listenerDefs = evTypeListenersMap.get(eventType);// returns map
    if (!listenerDefs) {
      result.message = `DOM element ${eventTarget}(id=${eventTarget.id}) doesn't have "${eventType}" listeners.`;
      return result;
    }

    if (listenerName) {
      const listenerDef = listenerDefs.get(listenerName);
      if (!listenerDef) {
        result.message = `DOM element ${eventTarget}(id=${eventTarget.id}) doesn't have "${eventType}" listener "${listenerName}"`;
        return result;
      }
      listenerDefs.delete(listenerName);

      if (listenerDef.options && listenerDef.options.callbackOnce) {
        eventTarget.removeEventListener(eventType, listenerDef.onceListener, listenerDef.options);
      } else {
        eventTarget.removeEventListener(eventType, listenerDef.listener, listenerDef.options);
      }
      result.success = true;
    } else if (!listenerName) {
      if (listener) {
        const searchKey = 'listener';
        const searchVal = listener;
        // The specified listener object is stored as part of the map value.
        // Gets the map key to search for that map value.
        const resultListenerName = this._searchKeyInValueContent(listenerDefs, searchKey, searchVal);
        if (resultListenerName) {
          const storedListenerDef = listenerDefs.get(resultListenerName);
          const storedOnceListener = storedListenerDef.onceListener;
          const storedOptions = storedListenerDef.options;

          listenerDefs.delete(resultListenerName);
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
      } else {
        result.message = 'options.listenerName is not found';
        return result;
      }
    }
    return result;
  }

  /**
   * Get a listener definition matching the specified eventTarget and eventType (optional).
   * Please note that the return value is immutable.
   * @memberof EventListenerHelper
   * @instance
   * @method
   * @param {EventTarget} eventTarget
   * EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.<br>
   *   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p>
   *
   * @param {String=} eventType
   * A case-sensitive string representing the <a href="/en-US/docs/Web/Events">event type</a> to listen for.
   *
   * @returns {}
   * Example of the returned value when only eventTarget is specified:<br><code><pre>
   [
   {
      eventType:click,
      listener:[
         {
            listener:func,
            options:{
               listenerName:my-test-listener-1
            }
         },
         {
            listener:func,
            options:{
               capture:true,
               listenerName:my-test-listener-2
            }
         }
      ]
   },
   {
      eventType:mousemove,
      listener:[
         {
            listener:func,
            options:{
               once:true,
               listenerName:my-test-listener-3
            }
         }
      ]
   }
   ]
   </pre></code>
   <br>
   Example of returned value when eventType is also specified as an argument:<br><code><pre>
   [
   {
      options:{
         listenerName:my-test-listener-1
      },
      listener:func1
   },
   {
      options:{
         capture:true,
         listenerName:my-test-listener-2
      },
      listener:func2
   },
   {
      options:{
         once:true,
         listenerName:my-test-listener-3
      },
      listener:func3
   }
   ]
   </pre></code>
   */
  getEventListeners(eventTarget, eventType) {
    const result = [];
    if (!eventTarget) {
      return result;
    }
    if (!eventType) {
      return this._getEventListenersWith1Arg(eventTarget);
    }
    return this._getEventListenersWith2Args(eventTarget, eventType);
  }

  /**
   * Returns all event listeners as a Map object
   *
   * You can get listeners for "inputElement" 's "click" event by map chain like below.
   * const listeners=result.get(inputElement).get('click');
   */
  getAllEventListeners() {
    const resultMap = new Map();
    this.evTargetListenersMap.forEach((mapValue, mapKey) => {
      const eventTarget = mapKey;
      const listenersForEventTarget = this._getEventListenersWith1Arg(eventTarget);
      const eventTypeListenersMap = new Map();
      resultMap.set(eventTarget, eventTypeListenersMap);
      for (const listenerData of listenersForEventTarget) {
        eventTypeListenersMap.set(listenerData.eventType, listenerData.listeners);
      }
    });
    return resultMap;
  }

  _getEventListenersWith1Arg(eventTarget) {
    const result = [];
    const evTypeListenersMap = this.evTargetListenersMap.get(eventTarget);// returns map
    if (!evTypeListenersMap) {
      return result;
    }
    for (const [eventType, listenerDefs] of evTypeListenersMap) {
      const frozenListenerDefs = [];
      for (const listenerDef of listenerDefs.values()) {
        frozenListenerDefs.push(this._getFrozenListenerDef(listenerDef));
      }

      if (frozenListenerDefs.length > 0) {
        // evnetType:eventType,listeners:listenerDefOfEventType
        result.push({ eventType, listeners: frozenListenerDefs });
      }
    }
    return result;
  }

  _getEventListenersWith2Args(eventTarget, eventType) {
    if (arguments.length !== 2) {
      throw Error('Only two arguments can be specified');
    }
    const result = [];
    const evTypeListenersMap = this.evTargetListenersMap.get(eventTarget);// returns map
    if (!evTypeListenersMap) {
      return result;
    }
    const listenerDefs = evTypeListenersMap.get(eventType);// returns map
    if (!listenerDefs) {
      return result;
    }
    for (const listenerDef of listenerDefs.values()) {
      // Converts an internal listenerDef to a user-friendly listenerDef
      const frozenListenerDef = this._getFrozenListenerDef(listenerDef);
      result.push(frozenListenerDef);
    }
    return result;
  }

  /**
   * Get a listener with the specified eventTarget, eventType and listenerName.
   The listenerName must be unique for one eventTarget and eventType combination,
   but it does not have to be unique for different eventTargets or different eventTypes.
   * @param {EventTarget} eventTarget
   * EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.<br>
   *   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p>
   * @memberof EventListenerHelper
   * @instance
   * @method
   * @param {String} eventType
   * A case-sensitive string representing the <a href="/en-US/docs/Web/Events">event type</a> to listen for.
   *
   * @param {String} listenerName The listener name of the listener you want to find

   * @returns {function} Returns null if no listener function is found
   */
  getEventListener(eventTarget, eventType, listenerName) {
    if (arguments.length !== 3) {
      throw Error('Only 3 arguments can be specified');
    }
    const evTypeListenersMap = this.evTargetListenersMap.get(eventTarget);// returns map
    if (!evTypeListenersMap) {
      return null;
    }
    const listenerDefs = evTypeListenersMap.get(eventType);// returns map
    if (!listenerDefs) {
      return null;
    }
    const listenerDef = listenerDefs.get(listenerName);
    // Converts an internal listenerDef to a user-friendly listenerDef
    const frozenListenerDef = this._getFrozenListenerDef(listenerDef);
    return frozenListenerDef;
  }

  /**
   * Returns whether or not there are more than one event listener for the given eventTarget and eventType.
   * @memberof EventListenerHelper
   * @instance
   * @method
   * @param eventTarget
   * @param eventType
   * @returns {boolean}
   */
  hasEventListeners(eventTarget, eventType) {
    if (arguments.length !== 2) {
      throw Error('Only two arguments can be specified');
    }
    const evTypeListenersMap = this.evTargetListenersMap.get(eventTarget);// returns map
    if (!evTypeListenersMap) {
      return false;
    }
    const listenerDefs = evTypeListenersMap.get(eventType);// returns map
    if (!listenerDefs || listenerDefs.size === 0) {
      return false;
    }
    return true;
  }

  /**
   * Returns whether a listenerName exists for the specified eventTarget and eventType.
   * @memberof EventListenerHelper
   * @instance
   * @method
   * @param {EventTarget} eventTarget
   * EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.<br>
   *   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p>
   *
   * @param {String} eventType
   * A case-sensitive string representing the <a href="/en-US/docs/Web/Events">event type</a> to listen for.
   *
   * @param {String} listenerName The listener name of the listener you want to find

   * @returns {boolean}
   */
  hasEventListener(eventTarget, eventType, listenerName) {
    if (arguments.length !== 3) {
      throw Error('Only 3 arguments can be specified');
    }
    const evTypeListenersMap = this.evTargetListenersMap.get(eventTarget);// returns map
    if (!evTypeListenersMap) {
      return false;
    }
    const listenerDefs = evTypeListenersMap.get(eventType);// returns map
    if (!listenerDefs) {
      return false;
    }
    const listenerDef = listenerDefs.get(listenerName);
    if (listenerDef) {
      return true;
    }
    return false;
  }

  _getFrozenListenerDef(listenerDef) {
    // Converts an internal listenerDef to a user-friendly listenerDef
    // For example, the callbackOnce used internally will be converted to an once as if the user had specified it.
    if (!listenerDef) {
      return null;
    }
    const resListenerDef = {};
    let optionsRes = null;
    const optionsOrg = listenerDef.options;
    if (optionsOrg) {
      optionsRes = {};
      resListenerDef.options = optionsRes;
      if (optionsOrg.capture) {
        optionsRes.capture = optionsOrg.capture;
      }
      if (optionsOrg.callbackOnce) {
        optionsRes.once = optionsOrg.callbackOnce;
      }
      if (optionsOrg.listenerName) {
        optionsRes.listenerName = optionsOrg.listenerName;
      }
    }
    resListenerDef.listener = listenerDef.listener;
    Object.freeze(optionsRes);
    Object.freeze(resListenerDef);
    return resListenerDef;
  }

  /**
   * Removes all registered events through the addEventListener method.
   * @memberof EventListenerHelper
   * @instance
   * @method
   */
  clearAllEventListeners() {
    const eventTargets = this.getAllEventTargets();
    for (const eventTarget of eventTargets) {
      this.clearEventListeners(eventTarget);
    }
  }

  /**
   * Remove all listeners matching the specified eventTarget and eventType (optional).
   *
   * @memberof EventListenerHelper
   * @instance
   * @method
   * @param {EventTarget} eventTarget
   * EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.<br>
   *   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p>
   *
   * @param {String=} eventType
   * A case-sensitive string representing the <a href="/en-US/docs/Web/Events">event type</a> to listen for.
   *
   */
  clearEventListeners(eventTarget, eventType) {
    if (!eventTarget) {
      throw Error('At least the EventTarget must be specified as an argument');
    }
    const items = this.getEventListeners(eventTarget, eventType);
    if (!eventType) {
      // only eventTarget is specified
      for (const item of items) {
        const itemEventType = item.eventType;
        const itemListeners = item.listeners;
        for (const itemListener of itemListeners) {
          const itemOptions = itemListener.options;
          this.removeEventListener(eventTarget, itemEventType, null, itemOptions);
        }
      }
    } else if (eventType) {
      // both eventTarget and eventType are specified
      for (const item of items) {
        this.removeEventListener(eventTarget, eventType, null, item.options);
      }
    }
  }

  /**
   * Removes the eventListener with eventTarget, eventType, and listenerName as arguments.
   The functions are the same as those of removeEventListener, except for the way to give arguments.
   * @memberof EventListenerHelper
   * @instance
   * @method
   * @param {EventTarget} eventTarget
   * EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.<br>
   *   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p>
   *
   * @param {String=} eventType
   * A case-sensitive string representing the <a href="/en-US/docs/Web/Events">event type</a> to listen for.
   * @param {String} listenerName The listener name of the listener you want to find
   */
  clearEventListener(eventTarget, eventType, listenerName) {
    const listenerDef = this.getEventListener(eventTarget, eventType, listenerName);
    if (listenerDef && listenerDef.options) {
      this.removeEventListener(eventTarget, eventType, null, listenerDef.options);
    }
  }

  /**
   * Get all registered eventTargets through the #addEventListener method.
   * @memberof EventListenerHelper
   * @instance
   * @method
   * @returns {}
   */
  getAllEventTargets() {
    return Array.from(this.evTargetListenersMap.keys());
  }

  /**
   * Get all listeners(listener definition) with a given listenerName.
   Since listeners need only be unique to the eventTarget and eventType,
   it is possible to have the same listenerName for different eventTargets and eventTypes.
   * @memberof EventListenerHelper
   * @instance
   * @method
   * @param {String} listenerName The listener name of the listener you want to find
   * @returns {}
   * <code><pre>[ { options: { listenerName: 'my-test-listener' },
        listener: [Function: func] },
   { options: { capture: true, listenerName: 'my-test-listener' },
        listener: [Function: func] },
   { options: { once: true, listenerName: 'my-test-listener' },
        listener: [Function: func] },
   { options: { once: true, listenerName: 'my-test-listener' },
        listener: [Function: func] } ]
   </pre></code>
   */
  searchEventListenersByName(listenerName) {
    const result = [];
    const eventTargets = this.getAllEventTargets();
    for (const eventTarget of eventTargets) {
      const evTypeListenersMap = this.evTargetListenersMap.get(eventTarget);// returns Map
      const eventTypes = evTypeListenersMap.keys();
      for (const eventType of eventTypes) {
        const listenerDefs = evTypeListenersMap.get(eventType);// returns Map
        const frozenListenerDef = this._getFrozenListenerDef(listenerDefs.get(listenerName));
        if (frozenListenerDef) {
          result.push(frozenListenerDef);
        }
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
