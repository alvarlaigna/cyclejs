import {StreamAdapter} from '@cycle/base';
import {DOMSourceable} from './DOMSourceable';
import {SourceOptions} from './SourceOptions';
import {GenericStream} from './GenericStream';
import {EventsFnOptions} from './EventsFnOptions';

export abstract class DOMSource implements DOMSourceable {
  protected _runStreamAdapter: StreamAdapter;
  protected _driverKey: string;

  constructor(options: SourceOptions) {
    this._runStreamAdapter = options.runStreamAdapter;
    this._driverKey = options.driverKey;
  }

  abstract select(selector: string): DOMSource;
  abstract elements(): GenericStream;
  abstract events(eventType: string, options?: EventsFnOptions): GenericStream;
}
