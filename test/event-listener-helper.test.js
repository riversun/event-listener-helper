import EventListenerHelper from '../src/event-listener-helper';
import { createHTMLForListenerManager } from './test-common';

describe('ListenerManager', () => {

  ///addEventListener///////////////////////////////////////////
  describe('addEventListener()', () => {

    test('addListener with listener name', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const listenerName = 'my-test-listener';
      const options = {};
      options.listenerName = listenerName;
      const btn = document.querySelector('#myButton');
      const result = lm.addEventListener(btn, 'click', (event) => {
        expect(event.target.id)
            .toBe('myButton');
        done();
      }, options);

      expect(result.success)
          .toBe(true);
      expect(result.listenerName)
          .toBe(listenerName);

      btn.click();
    });
    test('addListener mutiple with listener names', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      for (let i = 0; i < 3; i += 1) {
        const listenerName = `my-test-listener-${i}`;
        const options = {};
        options.listenerName = listenerName;

        const result = lm.addEventListener(btn, 'click', (event) => {
          expect(event.target.id)
              .toBe('myButton');
          done();
        }, options);

        expect(result.success)
            .toBe(true);
        expect(result.listenerName)
            .toBe(listenerName);
      }

      btn.click();
    });
    test('addListener add anonymous listener', (done) => {

      const lm = new EventListenerHelper();
      createHTMLForListenerManager();
      const btn = document.querySelector('#myButton');
      const result = lm.addEventListener(btn, 'click', (event) => {
        expect(event.target.id)
            .toBe('myButton');
        done();
      });
      expect(result.success)
          .toBe(true);
      expect(result.listenerName)
          .toEqual(expect.anything());

      btn.click();

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
});
