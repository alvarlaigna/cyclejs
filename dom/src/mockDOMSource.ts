import {StreamAdapter, DevToolEnabledSource} from '@cycle/base';
import {DOMSourceable, GenericStream, EventsFnOptions} from './DOMSourceable';
import {VNode} from './interfaces';
import xsAdapter from '@cycle/xstream-adapter';
import xs from 'xstream';

export type MockConfig = {
  [name: string]: GenericStream | MockConfig;
  elements?: GenericStream;
}

const CYCLE_SOURCE = `MockedDOM`;
const CSS_NOTATION = `.`;
const SCOPE_PREFIX = `___`;

export class MockedDOMSource implements DOMSourceable {
  private _elements: any;

  constructor(private _streamAdapter: StreamAdapter,
              private _mockConfig: MockConfig) {
    this._elements = _mockConfig.elements ||
                     _streamAdapter.adapt(xs.empty(), xsAdapter.streamSubscribe);
  }

  public elements(): any {
    const out: DevToolEnabledSource = this._elements;
    out._isCycleSource = CYCLE_SOURCE;

    return out;
  }

  public events(eventType: string, options: EventsFnOptions): any {
    const mockConfig = this._mockConfig;
    const keys = Object.keys(mockConfig);
    const keysCount = keys.length;
    for (let idx = 0; idx < keysCount; idx++) {
      const key = keys[idx];
      if (key === eventType) {
        const out: DevToolEnabledSource = mockConfig[key];
        out._isCycleSource = CYCLE_SOURCE;

        return out;
      }
    }
    const out: DevToolEnabledSource = this._streamAdapter.adapt(
      xs.empty(),
      xsAdapter.streamSubscribe
    );
    out._isCycleSource = CYCLE_SOURCE;

    return out;
  }

  public select(selector: string): DOMSourceable {
    const mockConfig = this._mockConfig;
    const keys = Object.keys(mockConfig);
    const keysCount = keys.length;
    for (let idx = 0; idx < keysCount; idx++) {
      const key = keys[idx];
      if (key === selector) {
        return new MockedDOMSource(this._streamAdapter, mockConfig[key]);
      }
    }

    return new MockedDOMSource(this._streamAdapter, {});
  }

  public isolateSource(source: MockedDOMSource, scope: string): DOMSourceable {
    return source.select(CSS_NOTATION + SCOPE_PREFIX + scope);
  }

  public isolateSink(sink: any, scope: string): any {
    return sink.map((vnode: VNode) => {
      if (vnode.sel.indexOf(SCOPE_PREFIX + scope) !== -1) {
        return vnode;
      } else {
        vnode.sel += `${CSS_NOTATION}${SCOPE_PREFIX}${scope}`;

        return vnode;
      }
    });
  }
}

export function mockDOMSource(
    streamAdapter: StreamAdapter,
    mockConfig: Object): DOMSourceable {
  return new MockedDOMSource(streamAdapter, mockConfig);
}
