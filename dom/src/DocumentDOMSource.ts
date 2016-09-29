import xs, {Stream} from 'xstream';
import xsAdapter from '@cycle/xstream-adapter';
import {DevToolEnabledSource} from '@cycle/base';
import {Sourceable, EventsFnOptions} from './Sourceable';
import {DOMSource} from './DOMSource';
import {SourceOptions} from './SourceOptions';
import {fromEvent} from './fromEvent';

export class DocumentDOMSource extends DOMSource implements Sourceable {
  constructor(specification: SourceOptions) {
    super(specification);
  }

  select(selector: string): DOMSource {
    // @TODO Decide what should happen.
    return this;
  }

  elements(): any {
    const runSA = this._runStreamAdapter;
    const out: DevToolEnabledSource = runSA.remember(
      runSA.adapt(xs.of(document), xsAdapter.streamSubscribe)
    );
    out._isCycleSource = this._driverKey;
    return out;
  }

  events(eventType: string, options: EventsFnOptions = {}): any {
    let stream: Stream<Event>;
    if (options && typeof options.useCapture === 'boolean') {
      stream = fromEvent(document, eventType, options.useCapture);
    } else {
      stream = fromEvent(document, eventType);
    }
    const out: DevToolEnabledSource = this._runStreamAdapter.adapt(
      stream,
      xsAdapter.streamSubscribe
    );
    out._isCycleSource = this._driverKey;
    return out;
  }
}
