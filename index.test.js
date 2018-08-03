/** Dependencies */
const assert = require('assert');
const Roadway = require('./index.js');

/** Preparing */
const preString = 'riders on the storm';
const preArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const preObject = ((...items) => {
    const result = {};

    for (let i = 0; i < items.length; i += 1) {
        result[i] = i;
    }

    result.length = items.length;
    return result;
})(...preArray);

/** Testing */
describe('Roadway', () => {
    describe('Basic(string)', () => {
        it('#reset', () => {
            const str1 = preString.slice(Math.floor(preString.length / 2));
            const str2 = preString.slice(Math.floor(preString.length / 4));
            const rw = new Roadway(str1);

            while (!rw.eof()) rw.next();

            assert.deepEqual(rw.cursor, str1.length);

            rw.reset();

            assert.deepEqual(rw.input, str1);
            assert.deepEqual(rw.cursor, 0);

            rw.reset(str2);

            assert.deepEqual(rw.input, str2);
        });

        it('#flush & #record', () => {
            const rw = new Roadway(preString, {
                framed: true,
            });

            rw.record();
            rw.next(5);
            assert.deepEqual(rw.flush(), preString.slice(0, 6));

            rw.next();

            rw.record();
            rw.next(1);
            assert.deepEqual(rw.flush(), preString.slice(7, 9));
        });

        it('#peek', () => {
            const rw = new Roadway(preString);

            for (let i = 0; i < preString.length; i += 1) {
                assert.deepEqual(rw.peek(i), preString[i]);
            }
        });

        it('#next', () => {
            const rw = new Roadway(preString);

            for (let i = 0; i < preString.length; i += 1) {
                assert.deepEqual(rw.next(), preString[i]);
            }
        });

        it('#eof', () => {
            const rw = new Roadway(preString);

            while (!rw.eof()) {
                rw.next();
            }

            assert.deepEqual(rw.cursor, preString.length);
            assert.deepEqual(rw.next(), undefined);
        });
    });

    it('Array', () => {
        const rw = new Roadway(preArray, {
            framed: true,
        });

        // peek
        assert.deepEqual(rw.peek(), preArray[0]);

        // next
        assert.deepEqual(rw.peek(), rw.next());
        assert.deepEqual(rw.peek(), preArray[1]);

        // record & flush
        rw.record();
        rw.next(1);
        assert.deepEqual(rw.flush(), preArray.slice(1, 3));

        // reset
        rw.reset();
        assert.deepEqual(rw.cursor, 0);
        assert.deepEqual(rw.input, preArray);

        // eof
        while (!rw.eof()) rw.next();

        assert.deepEqual(rw.cursor, preArray.length);
        assert.deepEqual(rw.next(), undefined);
    });

    it('Object', () => {
        const rw = new Roadway(preObject, {
            framed: true,
        });

        // peek
        assert.deepEqual(rw.peek(), preObject[0]);

        // next
        assert.deepEqual(rw.peek(), rw.next());
        assert.deepEqual(rw.peek(), preObject[1]);

        // record & flush
        rw.record();
        rw.next(1);

        assert.deepEqual(rw.flush(), [1, 2]);

        // reset
        rw.reset();
        assert.deepEqual(rw.cursor, 0);
        assert.deepEqual(rw.input, preObject);

        // eof
        while (!rw.eof()) rw.next();

        assert.deepEqual(rw.cursor, preObject.length);
        assert.deepEqual(rw.next(), undefined);
    });
});
