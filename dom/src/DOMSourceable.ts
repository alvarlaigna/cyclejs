import {Sourceable} from './Sourceable';
export {GenericStream} from './GenericStream';
export {EventsFnOptions} from './EventsFnOptions';

export interface DOMSourceable extends Sourceable {
  select(selector: string): DOMSourceable;
}
