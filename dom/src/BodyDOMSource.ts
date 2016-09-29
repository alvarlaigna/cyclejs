import xs, {Stream} from 'xstream';
import xsAdapter from '@cycle/xstream-adapter';
import {DevToolEnabledSource} from '@cycle/base';
import {Sourceable, EventsFnOptions} from './Sourceable';
import {DOMSource} from './DOMSource';
import {SourceOptions} from './SourceOptions';
import {fromEvent} from './fromEvent';

export class BodyDOMSource extends DOMSource implements Sourceable {
  constructor(options: SourceOptions) {
    super(options);
  }

  select(selector: string): DOMSource {
    // @TODO Decide what should happen.
    return this;
  }

  elements(): any {
    const runStreamAdapter = this._runStreamAdapter;
    const out: DevToolEnabledSource = runStreamAdapter.remember(
      runStreamAdapter.adapt(xs.of(document.body), xsAdapter.streamSubscribe)
    );
    out._isCycleSource = this._driverKey;
    return out;
  }

  events(eventType: string, options: EventsFnOptions = {}): any {
    let stream: Stream<Event>;
    if (options && typeof options.useCapture === 'boolean') {
      stream = fromEvent(document.body, eventType, options.useCapture);
    } else {
      stream = fromEvent(document.body, eventType);
    }
    const out: DevToolEnabledSource = this._runStreamAdapter.adapt(
      stream,
      xsAdapter.streamSubscribe
    );
    out._isCycleSource = this._driverKey;
    return out;
  }
}
