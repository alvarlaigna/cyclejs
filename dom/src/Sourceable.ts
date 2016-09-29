import {GenericStream} from './GenericStream';
import {EventsFnOptions} from './EventsFnOptions';

export interface Sourceable {
  select(selector: string): Sourceable;
  elements(): GenericStream;
  events(eventType: string, options?: EventsFnOptions): GenericStream;
}

export {EventsFnOptions}
