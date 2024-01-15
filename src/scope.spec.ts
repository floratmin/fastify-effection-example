import {expect} from 'vitest';
import {describe, it, beforeEach} from './test/test-scope.ts';
import {createContext} from 'effection';

const context = createContext<string>('some-string');

describe('scenario', () => {
    beforeEach(function* () {
        yield* context.set('Hello World');
    });
    it('Does something with context', function*() {
        expect(yield* context).toEqual('Hello World');
    });
});

