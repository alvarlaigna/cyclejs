import xs, {Stream} from 'xstream';
import {DevToolEnabledSource} from '@cycle/base';
import {DOMSource} from './DOMSource';
import {SourceOptions} from './SourceOptions';
import {EventsFnOptions} from './EventsFnOptions';
import xsAdapter from '@cycle/xstream-adapter';

export class HTMLSource extends DOMSource {
  private _html$: Stream<string>;
  private _empty$: Stream<any>;

  constructor(options: HTMLSourceOptions) {
    super(options);
    this._html$ = options.html$;
    this._empty$ = this._runStreamAdapter.adapt(xs.empty(), xsAdapter.streamSubscribe);
  }

  public elements(): any {
    const out: DevToolEnabledSource = this._runStreamAdapter.adapt(
      this._html$,
      xsAdapter.streamSubscribe
    );
    out._isCycleSource = this._driverKey;

    return out;
  }

  public select(selector: string): DOMSource {
    const options: HTMLSourceOptions = {
      runStreamAdapter: this._runStreamAdapter,
      driverKey: this._driverKey,
      html$: xs.empty()
    };

    return new HTMLSource(options);
  }

  public events(eventType: string, options?: EventsFnOptions): any {
    const out: DevToolEnabledSource = <any>this._empty$;
    out._isCycleSource = this._driverKey;

    return out;
  }
}

export interface HTMLSourceOptions extends SourceOptions {
  html$: Stream<string>;
}
