import EventListenerHelper from '../src/event-listener-helper';
import { createHTMLForListenerManager } from './test-common';

describe('ListenerManager', () => {

  ///addEventListener///////////////////////////////////////////
  describe('addEventListener()', () => {

    test('Add eventListener with listener name', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const listenerName = 'my-test-listener';
      const options = {};
      options.listenerName = listenerName;

      const result = lm.addEventListener(btn, 'click', (event) => {
        expect(event.target.id)
          .toBe('myButton');
        done();
      }, options);

      expect(result.success).toBe(true);
      expect(result.listenerName).toBe(listenerName);

      btn.click();
    });

    test('Add eventListeners with same listener name. duplicate', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const listenerName = 'my-test-listener';

      const testFunc = () => {
        for (let i = 0; i < 2; i += 1) {
          const options = {};
          options.listenerName = listenerName;
          const result = lm.addEventListener(btn, 'click', (event) => {
            //do nothing
          }, options);
        }
      };
      expect(testFunc).toThrowError('already used for the specified event type');
    });

    test('Add multiple eventListeners with listener name', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const numOfListeners = 10;
      for (let i = 0; i < numOfListeners; i += 1) {
        const listenerName = `my-test-listener-${i}`;
        const options = {};
        options.listenerName = listenerName;

        const result = lm.addEventListener(btn, 'click', (event) => {
          expect(event.target.id).toBe('myButton');
          if (i + 1 === numOfListeners) {
            done();
          }
        }, options);
        expect(result.success).toBe(true);
        expect(result.listenerName).toBe(listenerName);
      }
      btn.click();
    });

    test('Add anonymous eventListener', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const result = lm.addEventListener(btn, 'click', (event) => {
        expect(event.target.id).toBe('myButton');
        done();
      });
      expect(result.success).toBe(true);
      expect(result.listenerName).toEqual(expect.anything());

      btn.click();

    });

    test('Add eventListener with listener name with "capture" options', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const listenerName = 'my-test-listener';
      const options = { capture: true };
      options.listenerName = listenerName;

      const result = lm.addEventListener(btn, 'click', (event) => {
        expect(event.target.id).toBe('myButton');
        done();
      }, options);

      expect(result.success).toBe(true);
      expect(result.listenerName).toBe(listenerName);

      btn.click();
    });

    test('Add and remove eventListener with listener name with "capture" options', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const listenerName = 'my-test-listener';
      const options = { capture: true };
      options.listenerName = listenerName;

      // add listener
      lm.addEventListener(btn, 'click', (event) => {
        throw new Error('Error');
      }, options);

      // remove listener with option
      lm.removeEventListener(btn, 'click', null, options);

      btn.click();

      setTimeout(() => {
        done();
      }, 100);

    });
    test('Add "once" eventListener, if once is specified, make sure it is called-back only once', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const listenerName = 'my-test-listener';
      const options = { once: true };
      options.listenerName = listenerName;

      const numOfEventCall = 10;
      let counter = 0;

      // add listener
      lm.addEventListener(btn, 'click', (event) => {
        expect(event.target.id).toBe('myButton');
        counter++;
        if (counter == numOfEventCall) {
          throw Error(`Called ${counter} times even though "once:true" is specified.`);
        }
      }, options);

      for (let i = 0; i < numOfEventCall; i += 1) {
        btn.click();
      }

      setTimeout(() => {
        done();
      }, 100);

    });

    test('remove "once" eventListener with only listener in arg', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const listenerName = 'my-test-listener-once';
      const options = { once: true };
      options.listenerName = listenerName;
      const listenerFunc = (event) => {
        throw Error(`Once listener is not gone`);
      };
      // add listener
      lm.addEventListener(btn, 'click', listenerFunc, options);

      lm.removeEventListener(btn, 'click', listenerFunc);
      btn.click();

      setTimeout(() => {
        done();
      }, 100);

    });
    test('Once called once, automatically check if the event information has been deleted from the library cache', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const listenerName = 'my-test-listener';
      const options = { once: true };
      options.listenerName = listenerName;

      let isCalledOnce = false;
      lm.addEventListener(btn, 'click', (event) => {
        expect(event.target.id).toBe('myButton');
        if (isCalledOnce) {
          throw Error(`Called ${counter} times even though "once:true" is specified.`);
        }
        isCalledOnce = true;
      }, options);

      expect(lm.hasEventListeners(btn, 'click')).toBe(true);
      btn.click();
      expect(lm.hasEventListeners(btn, 'click')).toBe(false);
      btn.click();
      expect(lm.hasEventListeners(btn, 'click')).toBe(false);


      setTimeout(() => {
        done();
      }, 100);

    });

    test('Remove once listeners', () => {
      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const listenerName = 'my-test-listener';
      const options = { listenerName, once: true };

      //remove by clearAllEventListeners
      {
        lm.addEventListener(btn, 'click', (event) => {
          throw Error(`Once listener survived 1`);
        }, options);
        lm.clearAllEventListeners();
        btn.click();
      }

      {
        lm.addEventListener(btn, 'click', (event) => {
          throw Error(`Once listener survived 2`);
        }, options);
        lm.clearEventListeners(btn);
        btn.click();
      }

      {
        lm.addEventListener(btn, 'click', (event) => {
          throw Error(`Once listener survived 3`);
        }, options);
        lm.clearEventListeners(btn, 'click');
        btn.click();
      }

      {
        lm.addEventListener(btn, 'click', (event) => {
          throw Error(`Once listener survived 4`);
        }, options);
        lm.clearEventListener(btn, 'click', 'my-test-listener');
        btn.click();
      }

      {
        const options2 = { listenerName: 'my-test-listener-2', once: true };

        const listener2 = (event) => {
          throw Error(`Once listener survived 5`);
        };
        lm.addEventListener(btn, 'click', listener2, options2);
        lm.clearEventListener(btn, 'click', 'my-test-listener-2');
        btn.click();
      }

      {
        const options3 = { listenerName: 'my-test-listener-3', once: true };

        const listener3 = (event) => {
          throw Error(`Once listener survived 6`);
        };
        lm.addEventListener(btn, 'click', listener3, options3);
        lm.removeEventListener(btn, 'click', listener3, { listenerName: 'my-test-listener-3' });
        btn.click();
      }

      {
        const options4 = { listenerName: 'my-test-listener-4', once: true };

        const listener4 = (event) => {
          throw Error(`Once listener survived 7`);
        };
        lm.addEventListener(btn, 'click', listener4, options4);
        lm.removeEventListener(btn, 'click', listener4);
        btn.click();
      }

      {
        const options5 = { listenerName: 'my-test-listener-5', once: true };

        const listener5 = (event) => {
          throw Error(`Once listener survived 8`);
        };
        lm.addEventListener(btn, 'click', listener5, options5);
        lm.removeEventListener(btn, 'click', null, { listenerName: 'my-test-listener-5' });
        btn.click();
      }
    });

    test('Check illegal options type:string', () => {
      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const listenerName = 'my-test-listener';
      const btn = document.querySelector('#myButton');
      const doAddEventListener = () => {
        lm.addEventListener(btn, 'click', (event) => {
        }, listenerName);
      };
      expect(doAddEventListener).toThrowError('Type of string is not accepted');
    });

    test('Check illegal options type:boolean', () => {
      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const useCapture = true;
      const btn = document.querySelector('#myButton');
      const doAddEventListener = () => {
        lm.addEventListener(btn, 'click', (event) => {
        }, useCapture);
      };
      expect(doAddEventListener).toThrowError('Type of boolean is not accepted');
    });
    test('Check too many arguments', () => {
      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const listenerName = 'my-test-listener';
      const options = {};
      options.listenerName = listenerName;
      const btn = document.querySelector('#myButton');
      const doAddEventListener = () => {
        lm.addEventListener(btn, 'click', (event) => {
        }, null, options);
      };
      expect(doAddEventListener).toThrowError('Too many arguments');
    });


  });

  //removeEventListener//////////////////////////////////////////////////////////
  describe('removeListener()', () => {
    test('remove named listener', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const listenerName = 'my-test-listener';
      const options = {};
      options.listenerName = listenerName;

      lm.addEventListener(btn, 'click', () => {
        throw new Error('Listener is not removed!');
      }, options);

      const result = lm.removeEventListener(btn, 'click', null, options);

      if (result.success === false) {
        console.error(JSON.stringify(result));
        throw Error();
      }

      expect(lm.hasEventListeners(btn, 'click')).toBe(false);

      btn.click();

      setTimeout(() => {
        done();
      }, 100);
    });

    test('arg error', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const listenerName = 'my-test-listener';
      const options = {};
      options.listenerName = listenerName;

      lm.addEventListener(btn, 'click', () => {
        throw new Error('Listener is not removed!');
      }, options);

      expect(() => {
        lm.removeEventListener(btn, 'click', options)
      }).toThrowError('Type of 3rd arg should be a');

    });
    test('remove named listener', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const listenerName = 'my-test-listener';
      const options = {};
      options.listenerName = listenerName;

      lm.addEventListener(btn, 'click', () => {
        throw new Error('Listener is not removed!');
      }, options);

      const result = lm.removeEventListener(btn, 'click', null, options);

      if (result.success === false) {
        console.error(JSON.stringify(result));
        throw Error();
      }

      expect(lm.hasEventListeners(btn, 'click')).toBe(false);

      btn.click();

      setTimeout(() => {
        done();
      }, 100);
    });

    test('remove  named listener, if both options.listenerName and listenerFunction are specified in removeEventListener, listenerName takes precedence', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const listenerName1 = 'my-test-listener-1';
      const options1 = {};
      options1.listenerName = listenerName1;
      const listenerFunc1 = () => {
        throw new Error('Listener1 is not removed!');
      };

      const listenerName2 = 'my-test-listener-2';
      const options2 = {};
      options2.listenerName = listenerName2;
      const listenerFunc2 = () => {
        done();
      };
      lm.addEventListener(btn, 'click', listenerFunc1, options1);
      lm.addEventListener(btn, 'click', listenerFunc2, options2);
      const result = lm.removeEventListener(btn, 'click', listenerFunc2, options1);
      btn.click();
    });

    test('remove named listener without listenerName and listenerObject will failure', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const options = {};

      lm.addEventListener(btn, 'click', () => {
        throw new Error('Listener is not removed!');
      }, options);

      const result = lm.removeEventListener(btn, 'click', null, options);
      if (result.success === false) {
        expect(result.message).toMatch('options.listenerName is not found');
      }

    });
    test('remove named listener with options without listenerName and listenerObject will failure', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const options = { capture: true, once: true };

      lm.addEventListener(btn, 'click', () => {
        throw new Error('Listener is not removed!');
      }, options);

      const result = lm.removeEventListener(btn, 'click', null, options);
      if (result.success === false) {
        expect(result.message).toMatch('options.listenerName is not found');
      }

    });
    test('remove non-existing listener by eventName', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const listenerName = 'my-test-listener';
      const options = {};
      options.listenerName = listenerName;
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');
      lm.addEventListener(btn, 'click', () => {
        throw new Error('Listener is not removed!');
      }, options);


      //To remove non-exist element
      {
        const result = lm.removeEventListener(btn2, 'click', null, options);
        expect(result.success)
          .toBe(false);
        expect(result.message)
          .toBe('DOM element [object HTMLButtonElement](id=myButton2) doesn\'t have any listeners.');
      }
      //To remove non-exist eventName
      {
        const result = lm.removeEventListener(btn, 'hover', null, options);

        expect(result.success)
          .toBe(false);
        expect(result.message)
          .toBe('DOM element [object HTMLButtonElement](id=myButton) doesn\'t have "hover" listeners.');

      }
      //To remove non-exist eventName
      {
        const options2 = {};
        options2.listenerName = 'foo';

        const result = lm.removeEventListener(btn, 'click', null, options2);
        expect(result.success)
          .toBe(false);
        expect(result.message)
          .toBe('DOM element [object HTMLButtonElement](id=myButton) doesn\'t have "click" listener "foo"');
      }

    });

    test('remove listener that is registered with event-listener-helper with listenerName in options by listener object itself', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const listenerName = 'my-test-listener';
      const options = {};
      options.listenerName = listenerName;

      const listenerFunc = () => {
        throw new Error('Listener is not removed!');
      };

      lm.addEventListener(btn, 'click', listenerFunc, options);

      // options is not specified
      const result = lm.removeEventListener(btn, 'click', listenerFunc);
      if (result.success === false) {
        console.error(JSON.stringify(result));
        throw Error();
      }

      btn.click();

      expect(lm.hasEventListeners(btn, 'click')).toBe(false);

      setTimeout(() => {
        done();
      }, 100);
    });

    test('remove listener that is registered with event-listener-helper without listenerName in options by listener object itself', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      const options = {};

      const listenerFunc = () => {
        throw new Error('Listener is not removed!');
      };

      lm.addEventListener(btn, 'click', listenerFunc, options);

      // options is not specified
      const result = lm.removeEventListener(btn, 'click', listenerFunc);
      if (result.success === false) {
        console.error(JSON.stringify(result));
        throw Error();
      }

      btn.click();

      expect(lm.hasEventListeners(btn, 'click')).toBe(false);

      setTimeout(() => {
        done();
      }, 100);
    });
    test('remove listener that is registered without event-listener-hleper by listener object itself', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      {
        const listenerName = 'my-test-listener';
        const options = {};
        options.listenerName = listenerName;

        const listenerFunc = () => {
          // do nothing
        };

        lm.addEventListener(btn, 'click', listenerFunc, options);
      }

      //add event from outside of this library
      {
        const listenerFuncRegisteredExternally = () => {
          // do nothing
        };
        btn.addEventListener('click', listenerFuncRegisteredExternally);

        const result = lm.removeEventListener(btn, 'click', listenerFuncRegisteredExternally);
        if (result.success === false) {
          expect(result.message).toMatch('Specified listener could not be deleted from DOM element');
        }
      }


      btn.click();

      setTimeout(() => {
        done();
      }, 100);
    });

  });


  //getEventListener//////////////////////////////////////////////////////////
  describe('getEventListener()', () => {
    test('normal', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');

      {
        const options = { listenerName: 'my-test-listener-1' };
        const func = () => {
          return options.listenerName;
        };
        lm.addEventListener(btn, 'click', func, options);
      }

      {
        const options = { listenerName: 'my-test-listener-2', capture: true };
        const func = () => {
          return options.listenerName;
        };
        lm.addEventListener(btn, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-3', once: true };
        const func = () => {
          return options.listenerName;
        };
        lm.addEventListener(btn, 'mousemove', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-4', once: true };
        const func = () => {
          return options.listenerName;
        };
        lm.addEventListener(btn2, 'mouseover', func, options);
      }

      expect(() => {
        lm.getEventListener(btn);
      }).toThrowError('Only 3 arguments can be specified');
      expect(() => {
        lm.getEventListener(btn, 'click');
      }).toThrowError('Only 3 arguments can be specified');

      expect(lm.getEventListener(null, 'click', 'my-test-listener-1')).toBeNull();
      expect(lm.getEventListener(btn, null, 'my-test-listener-1')).toBeNull();

      expect(lm.getEventListener(btn, 'click', 'my-test-listener-1').listener()).toBe('my-test-listener-1');

      expect(lm.getEventListener(btn, 'click', 'my-test-listener-2').listener()).toBe('my-test-listener-2');
      expect(lm.getEventListener(btn, 'click', 'my-test-listener-2').options.capture).toBe(true);

      expect(lm.getEventListener(btn, 'click', 'my-test-listener-3')).toBeNull();
      expect(lm.getEventListener(btn, 'mousemove', 'my-test-listener-3').listener()).toBe('my-test-listener-3');
      expect(lm.getEventListener(btn, 'mousemove', 'my-test-listener-3').options.once).toBe(true);

      expect(lm.getEventListener(btn, 'click', 'my-test-listener-4')).toBeNull();
      expect(lm.getEventListener(btn, 'mousemove', 'my-test-listener-4')).toBeNull();
      expect(lm.getEventListener(btn2, 'mouseover', 'my-test-listener-4').listener()).toBe('my-test-listener-4');
      expect(lm.getEventListener(btn2, 'mouseover', 'my-test-listener-4').options.once).toBe(true);
    });
  });


  ///getEventListeners///////////////////////////////////////////

  describe('getEventListeners() 1 arg', () => {
    test('normal', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');

      {
        const options = { listenerName: 'my-test-listener-1' };
        const func = () => {
          return options.listenerName;
        };
        lm.addEventListener(btn, 'click', func, options);
      }

      {
        const options = { listenerName: 'my-test-listener-2', capture: true };
        const func = () => {
          return options.listenerName;
        };
        lm.addEventListener(btn, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-3', once: true };
        const func = () => {
          return options.listenerName;
        };
        lm.addEventListener(btn, 'mousemove', func, options);
      }


      const result = lm._getEventListenersWith1Arg(btn);

      expect(result[0].eventType).toBe('click');
      expect(result[0].listeners[0]).not.toBeUndefined();
      expect(result[0].listeners[0].options).not.toBeUndefined();
      expect(result[0].listeners[0].options.listenerName).toBe('my-test-listener-1');
      expect(result[0].listeners[1].options.listenerName).toBe('my-test-listener-2');
      expect(result[0].listeners[1].options.capture).toBe(true);
      expect(result[1].eventType).toBe('mousemove');
      expect(result[1].listeners[0].options.listenerName).toBe('my-test-listener-3');
      expect(result[1].listeners[0].options.once).toBe(true);

      const result2 = lm._getEventListenersWith1Arg(btn2);
      expect(result2.length).toBe(0);
    });

  });
  describe('getEventListeners() 2 args', () => {

    test('Make sure that the listener registered with options can be get correctly', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      {
        const func1 = (event) => {
          return 'my-test-listener-1';
        };
        lm.addEventListener(btn, 'click', func1, { listenerName: 'my-test-listener-1' });

        const func2 = (event) => {
          return 'my-test-listener-2';
        };
        lm.addEventListener(btn, 'click', func2, { listenerName: 'my-test-listener-2', capture: true });

        const func3 = (event) => {
          return 'my-test-listener-3';
        };
        lm.addEventListener(btn, 'click', func3, { listenerName: 'my-test-listener-3', once: true });
      }

      const listeners = lm._getEventListenersWith2Args(btn, 'click');

      expect(listeners.length).toBe(3);

      const testTemp_listenerNames = [];
      const testTemp_listenerNameOptionMap = new Map();

      for (const listenerInfo of listeners) {

        // listenerInfo is frozen (read only)
        expect(() => {
          listenerInfo.listener = null;
        }).toThrowError('Cannot assign to read only property');

        // options is also frozen
        expect(() => {
          listenerInfo.options.listenerName = 'abc';
        }).toThrowError('Cannot assign to read only property');

        const listener = listenerInfo.listener;
        const options = listenerInfo.options;
        const listenerName = options.listenerName;

        //Check that the listener function you intend to register is registered properly
        expect(listener()).toBe(listenerName);
        testTemp_listenerNames.push(listenerName);
        testTemp_listenerNameOptionMap.set(listenerName, options);
      }

      //Verify that all listener names are registered
      expect(testTemp_listenerNames).toHaveLength(3);
      expect(testTemp_listenerNames).toEqual(expect.arrayContaining(['my-test-listener-1', 'my-test-listener-2', 'my-test-listener-3']));
      expect(testTemp_listenerNameOptionMap.get('my-test-listener-2').capture).toBe(true);
      expect(testTemp_listenerNameOptionMap.get('my-test-listener-3').once).toBe(true);

    });

    test('Make sure that the listener registered without name without options can be get correctly,Check that the listener name is automatically assigned', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');

      {
        const func1 = (event) => {
          return 'result-my-test-listener-1';
        };
        lm.addEventListener(btn, 'click', func1, { listenerName: 'my-test-listener-1' });


        const func2 = (event) => {
          return 'result-my-test-listener-2';
        };
        lm.addEventListener(btn, 'click', func2);

        const func3 = (event) => {
          return 'result-my-test-listener-3';
        };
        lm.addEventListener(btn, 'click', func3, {});

        const func4 = (event) => {
          return 'result-my-test-listener-4';
        };
        lm.addEventListener(btn, 'click', func4, { capture: true });

        const func5 = (event) => {
          return 'result-my-test-listener-5';
        };
        lm.addEventListener(btn, 'click', func5, { capture: true, once: true });
      }

      const listeners = lm._getEventListenersWith2Args(btn, 'click');

      expect(listeners.length).toBe(5);

      const testTemp_listenerNames = [];
      const testTemp_funcResultOptionMap = new Map();
      for (const listenerInfo of listeners) {

        const listener = listenerInfo.listener;
        const options = listenerInfo.options;
        testTemp_funcResultOptionMap.set(listener(), options);
      }
      expect(testTemp_funcResultOptionMap.get('result-my-test-listener-1').listenerName).toBeDefined();
      expect(testTemp_funcResultOptionMap.get('result-my-test-listener-2').listenerName).toBeDefined();
      expect(testTemp_funcResultOptionMap.get('result-my-test-listener-3').listenerName).toBeDefined();
      expect(testTemp_funcResultOptionMap.get('result-my-test-listener-4').listenerName).toBeDefined();
      expect(testTemp_funcResultOptionMap.get('result-my-test-listener-5').listenerName).toBeDefined();
      //console.log(listeners);
    });

    test('Make sure that the listener registered with options can be get correctly', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');

      {
        const func1 = (event) => {
          return 'my-test-listener-1';
        };
        lm.addEventListener(btn, 'click', func1, { listenerName: 'my-test-listener-1' });

        const func2 = (event) => {
          return 'my-test-listener-2';
        };
        lm.addEventListener(btn, 'click', func2, { listenerName: 'my-test-listener-2', capture: true });

        const func3 = (event) => {
          return 'my-test-listener-3';
        };
        lm.addEventListener(btn, 'click', func3, { listenerName: 'my-test-listener-3', once: true });
      }

      const btn2ClickListeners = lm._getEventListenersWith2Args(btn2, 'click');
      expect(btn2ClickListeners.length).toBe(0);

      const btnMouseMoveListeners = lm._getEventListenersWith2Args(btn, 'mousemove');
      expect(btnMouseMoveListeners.length).toBe(0);

    });
  });

  ///getAllEventListeners///////////////////////////////////////////
  describe('getAllEventListeners()', () => {
    const lm = new EventListenerHelper();
    createHTMLForListenerManager();
    const btn = document.querySelector('#myButton');
    const btn2 = document.querySelector('#myButton2');

    const options = { listenerName: 'my-test-listener-1' };
    const func1 = () => {
      return options.listenerName;
    };
    lm.addEventListener(btn, 'click', func1, options);

    const options2 = { listenerName: 'my-test-listener-2', capture: true };
    const func2 = () => {
      return options2.listenerName;
    };
    lm.addEventListener(btn, 'click', func2, options2);

    const options3 = { listenerName: 'my-test-listener-3' };
    const func3 = () => {
      return options3.listenerName;
    };
    lm.addEventListener(btn2, 'click', func3, options3);


    const allListeners = lm.getAllEventListeners();
    const clickListenerFuncsOnBtn = allListeners.get(btn).get('click');
    const clickListenerFuncsOnBtn2 = allListeners.get(btn2).get('click');

    expect(clickListenerFuncsOnBtn.length === 2);
    expect(clickListenerFuncsOnBtn[0].listener).toBe(func1);
    expect(clickListenerFuncsOnBtn[0].options.listenerName).toBe('my-test-listener-1');
    expect(clickListenerFuncsOnBtn[1].listener).toBe(func2);
    expect(clickListenerFuncsOnBtn[1].options.listenerName).toBe('my-test-listener-2');
    expect(clickListenerFuncsOnBtn[1].options.capture).toBe(true);
    expect(clickListenerFuncsOnBtn2.length === 1);
    expect(clickListenerFuncsOnBtn2[0].listener).toBe(func3);
    expect(clickListenerFuncsOnBtn2[0].options.listenerName).toBe('my-test-listener-3');

  });

  ///hasEventListeners///////////////////////////////////////////
  describe('hasEventListeners()', () => {

    test('default', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');

      {
        const func1 = (event) => {
          return 'my-test-listener-1';
        };
        lm.addEventListener(btn, 'click', func1, { listenerName: 'my-test-listener-1' });

        const func2 = (event) => {
          return 'my-test-listener-2';
        };
        lm.addEventListener(btn, 'mouseover', func2, { listenerName: 'my-test-listener-2', capture: true });
      }

      expect(lm.hasEventListeners(btn, 'click')).toBe(true);
      expect(lm.hasEventListeners(btn, 'mouseover')).toBe(true);
      expect(lm.hasEventListeners(btn, 'mousemove')).toBe(false);

      lm.removeEventListener(btn, 'click', null, { listenerName: 'my-test-listener-1' });
      expect(lm.hasEventListeners(btn, 'click')).toBe(false);
      expect(lm.hasEventListeners(btn, 'mouseover')).toBe(true);

      // Irrelevant event Target
      expect(lm.hasEventListeners(btn2, 'click')).toBe(false);
    });
  });


  //hasEventListener
  describe('hasEventListener()', () => {
    test('normal', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');

      {
        const options = { listenerName: 'my-test-listener-1' };
        const func = () => {
          return options.listenerName;
        };
        lm.addEventListener(btn, 'click', func, options);
      }

      {
        const options = { listenerName: 'my-test-listener-2', capture: true };
        const func = () => {
          return options.listenerName;
        };
        lm.addEventListener(btn, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-3', once: true };
        const func = () => {
          return options.listenerName;
        };
        lm.addEventListener(btn, 'mousemove', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-4', once: true };
        const func = () => {
          return options.listenerName;
        };
        lm.addEventListener(btn2, 'mouseover', func, options);
      }

      expect(() => {
        lm.hasEventListener(btn);
      }).toThrowError('Only 3 arguments can be specified');
      expect(() => {
        lm.hasEventListener(btn, 'click');
      }).toThrowError('Only 3 arguments can be specified');

      expect(lm.hasEventListener(null, 'click', 'my-test-listener-1')).toBe(false);
      expect(lm.hasEventListener(btn, null, 'my-test-listener-1')).toBe(false);

      expect(lm.hasEventListener(btn, 'click', 'my-test-listener-1')).toBe(true);

      expect(lm.hasEventListener(btn, 'click', 'my-test-listener-2')).toBe(true);

      expect(lm.hasEventListener(btn, 'click', 'my-test-listener-3')).toBe(false);
      expect(lm.hasEventListener(btn, 'mousemove', 'my-test-listener-3')).toBe(true);

      expect(lm.hasEventListener(btn, 'click', 'my-test-listener-4')).toBe(false);
      expect(lm.hasEventListener(btn, 'mousemove', 'my-test-listener-4')).toBe(false);
      expect(lm.hasEventListener(btn2, 'mouseover', 'my-test-listener-4')).toBe(true);

    });
  });

  // clearEventListeners
  describe('clearEventListeners()', () => {
    test('test with 1 arg. specify only "eventTarget" ', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');

      {
        const options = { listenerName: 'my-test-listener-1' };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }

      {
        const options = { listenerName: 'my-test-listener-2', capture: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-3', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'mousemove', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-4', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn2, 'mouseover', func, options);
      }

      console.log("before" + JSON.stringify(lm.getEventListeners(btn)));

      expect(lm.getEventListeners(btn).length).toBe(2);
      expect(lm.getEventListeners(btn2).length).toBe(1);

      //clear event listeners on btn
      lm.clearEventListeners(btn);

      expect(lm.getEventListeners(btn).length).toBe(0);

      //Make sure BTN2 isn't affected.
      expect(lm.getEventListeners(btn2).length).toBe(1);

      //clear event listeners on btn2
      lm.clearEventListeners(btn2);
      expect(lm.getEventListeners(btn2).length).toBe(0);

      // Make sure there is no error when clicking the button.
      btn.click();
    });

    test('test with 2 args. specify only "eventTarget" ', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');

      {
        const options = { listenerName: 'my-test-listener-1' };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }

      {
        const options = { listenerName: 'my-test-listener-2', capture: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-3', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'mousemove', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-4', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn2, 'mouseover', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-5', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn2, 'click', func, options);
      }

      // //clear event listeners on btn
      lm.clearEventListeners(btn, 'click');
      expect(lm.getEventListeners(btn, 'click').length).toBe(0);
      expect(lm.getEventListeners(btn, 'mousemove').length).toBe(1);

      lm.clearEventListeners(btn, 'mousemove');
      expect(lm.getEventListeners(btn, 'mousemove').length).toBe(0);
      expect(lm.getEventListeners(btn2, 'click').length).toBe(1);
    });
  });

  // clearEventListener
  describe('clearEventListener()', () => {
    test('default', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');

      {
        const options = { listenerName: 'my-test-listener' };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-1' };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener', capture: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'mousemove', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-1' };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'mousemove', func, options);
      }

      {
        const options = { listenerName: 'my-test-listener', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn2, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn2, 'mouseover', func, options);
      }
      expect(lm.getEventListeners(btn, 'click').length).toBe(2);
      expect(lm.hasEventListener(btn, 'click', 'my-test-listener')).toBe(true);
      expect(lm.hasEventListener(btn, 'click', 'my-test-listener-1')).toBe(true);

      lm.clearEventListener(btn, 'click', 'my-test-listener-1');
      expect(lm.getEventListeners(btn, 'click').length).toBe(1);

      lm.clearEventListener(btn, 'click', 'my-test-listener');
      expect(lm.getEventListeners(btn, 'click').length).toBe(0);

      expect(lm.hasEventListener(btn, 'click', 'my-test-listener-1')).toBe(false);

      lm.clearEventListener(btn, 'click', 'my-test-listener-2');
    });
  });


  // clearAllEventListeners
  describe('clearAllEventListeners()', () => {
    test('test with 1 arg. specify only "eventTarget" ', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');

      {
        const options = { listenerName: 'my-test-listener-1' };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }

      {
        const options = { listenerName: 'my-test-listener-2', capture: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-3', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'mousemove', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-4', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn2, 'mouseover', func, options);
      }

      console.log("before" + JSON.stringify(lm.getEventListeners(btn)));

      expect(lm.getEventListeners(btn).length).toBe(2);
      expect(lm.getEventListeners(btn2).length).toBe(1);

      lm.clearAllEventListeners();

      expect(lm.getEventListeners(btn).length).toBe(0);
      expect(lm.getEventListeners(btn2).length).toBe(0);

      // Make sure there is no error when clicking the button.
      btn.click();
    });

    test('test with 2 args. specify only "eventTarget" ', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');

      {
        const options = { listenerName: 'my-test-listener-1' };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }

      {
        const options = { listenerName: 'my-test-listener-2', capture: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-3', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'mousemove', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-4', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn2, 'mouseover', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-5', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn2, 'click', func, options);
      }

      // //clear event listeners on btn
      lm.clearEventListeners(btn, 'click');
      expect(lm.getEventListeners(btn, 'click').length).toBe(0);
      expect(lm.getEventListeners(btn, 'mousemove').length).toBe(1);

      lm.clearEventListeners(btn, 'mousemove');
      expect(lm.getEventListeners(btn, 'mousemove').length).toBe(0);
      expect(lm.getEventListeners(btn2, 'click').length).toBe(1);
    });
  });

  // searchEventListenersByName
  describe('searchEventListenersByName()', () => {
    test('default', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const btn2 = document.querySelector('#myButton2');

      {
        const options = { listenerName: 'my-test-listener' };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }

      {
        const options = { listenerName: 'my-test-listener', capture: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'mousemove', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn2, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener', once: true };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn2, 'mouseover', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-1' };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'click', func, options);
      }
      {
        const options = { listenerName: 'my-test-listener-1' };
        const func = () => {
          throw Error(`Error occurred on listener "${options.listenerName}"`);
        };
        lm.addEventListener(btn, 'mousemove', func, options);
      }

      const res = lm.searchEventListenersByName('my-test-listener');
      expect(lm.searchEventListenersByName('my-test-listener').length).toBe(4);


    });
  });


});
