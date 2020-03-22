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

    test('Add "once" eventListener, if once is specified, make sure it is called-back only once', (done) => {

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
      const listenerName = 'my-test-listener';
      const options = {};
      options.listenerName = listenerName;
      const btn = document.querySelector('#myButton');
      lm.addEventListener(btn, 'click', () => {
        throw new Error('Listener is not removed!');
      }, options);
      const result = lm.removeEventListener(btn, 'click', null, options);
      if (result.success === false) {
        console.error(JSON.stringify(result));
      }

      btn.click();

      setTimeout(() => {
        done();
      }, 100);
    });

    test('remove named listener without listenerName', () => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const listenerName = 'my-test-listener';
      const options = {};
      //options.listenerName = listenerName;
      const btn = document.querySelector('#myButton');
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

    test('remove listener that is registered with event-listener-hleper by listener object itself', (done) => {

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
      }

      btn.click();

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

  ///getEventListeners///////////////////////////////////////////
  describe('getEventListeners()', () => {

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

      const listeners = lm.getEventListeners(btn, 'click');

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

      const listeners = lm.getEventListeners(btn, 'click');

      expect(listeners.length).toBe(5);

      const testTemp_listenerNames = [];
      const testTemp_funcResultOptionMap = new Map();
      for (const listenerInfo of listeners) {

        const listener = listenerInfo.listener;
        const options = listenerInfo.options;
        testTemp_funcResultOptionMap.set(listener(), options)
      }
      expect(testTemp_funcResultOptionMap.get('result-my-test-listener-1').listenerName).toBeDefined();
      expect(testTemp_funcResultOptionMap.get('result-my-test-listener-2').listenerName).toBeDefined();
      expect(testTemp_funcResultOptionMap.get('result-my-test-listener-3').listenerName).toBeDefined();
      expect(testTemp_funcResultOptionMap.get('result-my-test-listener-4').listenerName).toBeDefined();
      expect(testTemp_funcResultOptionMap.get('result-my-test-listener-5').listenerName).toBeDefined();
      //console.log(listeners);
    });
  });
});
