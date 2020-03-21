<a name="EventListenerHelper"></a>

## EventListenerHelper
**Kind**: global class  
**Author**: Tom Misawa (riversun.org@gmail.com,https://github.com/riversun)  

* [EventListenerHelper](#EventListenerHelper)
    * [new EventListenerHelper()](#new_EventListenerHelper_new)
    * [.addEventListener(eventTarget, eventType, listener, [options])](#EventListenerHelper+addEventListener) ⇒

<a name="new_EventListenerHelper_new"></a>

### new EventListenerHelper()
Helper class to name event listener and make it easier to delete

MIT License

<a name="EventListenerHelper+addEventListener"></a>

### eventListenerHelper.addEventListener(eventTarget, eventType, listener, [options]) ⇒
**Kind**: instance method of [<code>EventListenerHelper</code>](#EventListenerHelper)  

| Param | Type | Description |
| --- | --- | --- |
| eventTarget | <code>EventTarget</code> | EventTarget is a DOM interface implemented by objects that can receive events and may have listeners for them.<br>   <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p> |
| eventType | <code>String</code> | A case-sensitive string representing the <a href="/en-US/docs/Web/Events">event type</a> to listen for. |
| listener | <code>function</code> | The object which receives a notification (an object that implements the <a href="/en-US/docs/Web/API/Event"><code>Event</code></a> interface) when an event of the specified type occurs. This must be an object implementing the <a href="/en-US/docs/Web/API/EventListener"><code>EventListener</code></a> interface, or a JavaScript <a href="/en-US/docs/JavaScript/Guide/Functions">function</a>. See <a href="#The_event_listener_callback">The event listener callback</a> for details on the callback itself. |
| [options] | <code>Object</code> | An options object specifies characteristics about the event listener. The available options are:<br>    <dl>    <dt><code><var><b>listenerName</b></var></code></dt>    <dd>A <code>String</code>By assigning listenerName, the specified listener function (callback function) can be specified.In other words, it is possible to retrieve the listener function later    using this listenerName as a key.listenerName must be unique.    </dd>    <dt><code><var>capture</var></code></dt>    <dd>A <a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"><code>Boolean</code></a> indicating that events of this type will be dispatched to the registered <code>listener</code>    before being dispatched to any <code>EventTarget</code> beneath it in the DOM tree.    </dd>    <dt><code><var>once</var></code></dt>    <dd>A <a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"><code>Boolean</code></a> indicating that the <code><var>listener</var></code> should be invoked at most once after being    added. If <code>true</code>, the <code><var>listener</var></code> would be automatically removed when invoked.    </dd>    <dt><code><var>passive</var></code></dt>    <dd>A <a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"><code>Boolean</code></a> which, if <code>true</code>, indicates that the function specified by <code><var>listener</var></code>    will never call <a href="/en-US/docs/Web/API/Event/preventDefault"><code>preventDefault()</code></a>. If a passive listener does call <code>preventDefault()</code>, the user agent will do    nothing other than generate a console warning. See <a href="#Improving_scrolling_performance_with_passive_listeners">Improving scrolling performance with passive listeners</a> to learn more.    </dd>    <dt><span class="icon-only-inline" title="This API has not been standardized."><i class="icon-warning-sign"> </i></span> <code><var>mozSystemGroup</var></code></dt>    <dd>A <a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean"><code>Boolean</code></a> indicating that the listener should be added to the system group. Available only in code    running in XBL or in the <a href="/en-US/docs/Glossary/chrome">chrome</a> of the Firefox browser.    </dd>    </dl>    <p><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">addEventListener</a> by <a class="new" rel="nofollow" title="Page has not yet been created.">Mozilla Contributors</a> is licensed under <a class="external" href="http://creativecommons.org/licenses/by-sa/2.5/" rel="noopener">CC-BY-SA 2.5</a>.</p> |

