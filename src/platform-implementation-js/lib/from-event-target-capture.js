/* @flow */

var Kefir = require('kefir');

type Emitter = {
  +addEventListener: Function,
  +removeEventListener: Function
};

export default function fromEventTargetCapture(
  target: Emitter,
  eventName: string
): Kefir.Observable<any> {
  return Kefir.stream(emitter => {
    function sink(event) {
      emitter.emit(event);
    }
    target.addEventListener(eventName, sink, true);
    return () => {
      target.removeEventListener(eventName, sink, true);
    };
  });
}
