/**
 * The simple InputStream with frames to array-like objects.
 *
 * @module roadway
 * @author Denis Maslennikov <mrdenniska@gmail.com> (nofach.co)
 * @license MIT
 */

/** Errors */
class BasicError extends Error {
    constructor(msg) {
        super(msg);
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(msg)).stack;
        }
    }
}

class InvalidInputError extends BasicError {}
class EmptyBufferError extends BasicError {}
class FramedError extends BasicError {}

/** Methods */
function isValidInput(input) {
    return input && input[0] !== undefined && typeof (input.length) === 'number';
}

function slice(target, begin, end) {
    const result = [];

    for (let i = begin; i < end; i += 1) {
        result.push(target[i]);
    }

    return result;
}

/** Implementation */
class Roadway {
    constructor(input, options = { framed: false }) {
        this.options = options;
        this.framedSlice = -1;
        this.cursor = 0;

        if (input && !isValidInput(input)) {
            throw new InvalidInputError();
        }

        this.input = input;
    }

    reset(input = null) {
        if (input !== null) {
            if (!isValidInput(input)) {
                throw new InvalidInputError();
            }

            this.input = input;
        }

        this.framedSlice = -1;
        this.cursor = 0;
    }

    peek(offset = 0) {
        if (this.eof(offset)) {
            return undefined;
        }

        return this.input[this.cursor + offset];
    }

    next(offset = 0) {
        const result = this.peek();

        if (result !== undefined) {
            this.cursor += offset + 1;
        }

        return result;
    }

    flush() {
        let result = null;

        if (!this.options.framed) {
            throw new FramedError('');
        }

        if (this.framedSlice < 0) {
            throw new EmptyBufferError('');
        }

        if (this.input.slice) {
            result = this.input.slice(this.framedSlice, this.cursor);
        } else {
            result = slice(this.input, this.framedSlice, this.cursor);
        }

        this.framedSlice = -1;
        return result;
    }

    record() {
        if (!this.options.framed) {
            throw new FramedError('');
        }

        this.framedSlice = this.cursor;
    }

    eof(offset = 0) {
        if (this.input && this.input.length) {
            if (this.cursor + offset >= this.input.length) {
                return true;
            }
        }

        return false;
    }
}

/** Exports */
module.exports = Roadway;
