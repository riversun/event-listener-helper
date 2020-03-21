<a name="EventListenerHelper"></a>

## EventListenerHelper
**Kind**: global class  
**Author**: Tom Misawa (riversun.org@gmail.com,https://github.com/riversun)  

* [EventListenerHelper](#EventListenerHelper)
    * [new EventListenerHelper()](#new_EventListenerHelper_new)
    * [.addEventListener(eventTarget, eventType, listener, [options])](#EventListenerHelper+addEventListener) ⇒
    * [.removeEventListener(eventTarget, eventType, listener, [options])](#EventListenerHelper+removeEventListener) ⇒

<a name="new_EventListenerHelper_new"></a>

### new EventListenerHelper()
Helper class to name event listener and make it easier to delete

MIT License

<a name="EventListenerHelper+addEventListener"></a>

### eventListenerHelper.addEventListener(eventTarget, eventType, listener, [options]) ⇒
By using EventListenerHelper#addEventListener instead of EventTarget#addEventListener,
you can get the registered listener from EventListenerHelper using getEventListeners,
delete the individual listener by listenerName, and check the listener existence.

**Kind**: instance method of [<code>EventListenerHelper</code>](#EventListenerHelper)  

| Param | Type | Description |
| --- | --- | --- |
| eventTarget | <code>EventTarget</code> | EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.<br>   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p> |
| eventType | <code>String</code> | A string which specifies the type of event for which to remove an event listener. |
| listener | <code>function</code> | <dd>The <a href="/en-US/docs/Web/API/EventListener"><code>EventListener</code></a> function of the event handler to remove from the event target.</dd> |
| [options] | <code>Object</code> | An options object specifies characteristics about the event listener. The available options are:<br>    <dl>    <dt><code><var><b>listenerName</b></var></code></dt>    <dd>A <code>String</code>By assigning listenerName, the specified listener function (callback function) can be specified.In other words, it is possible to retrieve the listener function later    using this listenerName as a key.listenerName must be unique.    </dd>    <dt><var>options</var> <span class="inlineIndicator optional optionalInline">Optional</span></dt>    <dd>An options object that specifies characteristics about the event listener. The available options are:    <ul>    <li><code>capture</code>: A&nbsp;<a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"><code>Boolean</code></a> that indicates that events of this type will be dispatched to the registered <code>listener</code>&nbsp;before being dispatched to any <code>EventTarget</code> beneath it in the DOM tree.</li>    <li><span class="icon-only-inline" title="This API has not been standardized."><i class="icon-warning-sign"> </i></span><code> mozSystemGroup</code>: Available only in code running in XBL or in Firefox' chrome, it is a <a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"><code>Boolean</code></a> defining if the listener is added to the system group.</li>    </ul>    </dd>    </dl>    <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">addEventListener</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p> |

<a name="EventListenerHelper+removeEventListener"></a>

### eventListenerHelper.removeEventListener(eventTarget, eventType, listener, [options]) ⇒
The EventListenerHelper#removeEventListener method removes from the EventTarget an event listener previously registered with EventListenerHelper#addEventListener.
   The event listener to be removed is identified using option.
   listenerName and a combination of the event type, the event listener function itself,
   and various optional options that may affect the matching process; see Matching event listeners for removal

**Kind**: instance method of [<code>EventListenerHelper</code>](#EventListenerHelper)  

| Param | Type | Description |
| --- | --- | --- |
| eventTarget | <code>EventTarget</code> | EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.<br>   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p> |
| eventType | <code>String</code> | A string which specifies the type of event for which to remove an event listener. |
| listener | <code>function</code> | The object which receives a notification (an object that implements the <a href="/en-US/docs/Web/API/Event"><code>Event</code></a> interface) when an event of the specified type occurs. This must be an object implementing the <a href="/en-US/docs/Web/API/EventListener"><code>EventListener</code></a> interface, or a JavaScript <a href="/en-US/docs/JavaScript/Guide/Functions">function</a>. See <a href="#The_event_listener_callback">The event listener callback</a> for details on the callback itself. |
| [options] | <code>Object</code> | An options object specifies characteristics about the event listener. The available options are:<br>    <dl>    <dt><code><var><b>listenerName</b></var></code></dt>    <dd>A <code>String</code>By assigning listenerName, the specified listener function (callback function) can be specified.In other words, it is possible to retrieve the listener function later    using this listenerName as a key.listenerName must be unique.    </dd>    <dt><code><var>capture</var></code></dt>    <dd>A <a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"><code>Boolean</code></a> indicating that events of this type will be dispatched to the registered <code>listener</code>    before being dispatched to any <code>EventTarget</code> beneath it in the DOM tree.    </dd>    </dl>    <p><a href="https://developer.mozilla.org/ja/docs/Web/API/EventTarget/removeEventListener">removeEventListener</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p> |

