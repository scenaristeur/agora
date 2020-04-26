(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.eve = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],5:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":3,"./encode":4}],6:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":7,"punycode":2,"querystring":5}],7:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],8:[function(require,module,exports){
"use strict";

// rawAsap provides everything we need except exception management.
var rawAsap = require("./raw");
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};

},{"./raw":9}],9:[function(require,module,exports){
(function (global){
"use strict";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":12,"es5-ext/object/is-callable":15,"es5-ext/object/normalize-options":21,"es5-ext/string/#/contains":24}],11:[function(require,module,exports){
"use strict";

// eslint-disable-next-line no-empty-function
module.exports = function () {};

},{}],12:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")() ? Object.assign : require("./shim");

},{"./is-implemented":13,"./shim":14}],13:[function(require,module,exports){
"use strict";

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
};

},{}],14:[function(require,module,exports){
"use strict";

var keys  = require("../keys")
  , value = require("../valid-value")
  , max   = Math.max;

module.exports = function (dest, src/*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":18,"../valid-value":23}],15:[function(require,module,exports){
// Deprecated

"use strict";

module.exports = function (obj) { return typeof obj === "function"; };

},{}],16:[function(require,module,exports){
"use strict";

var value                   = require("./valid-value")
  , objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (obj) {
	var i;
	value(obj);
	for (i in obj) {
		// Jslint: ignore
		if (objPropertyIsEnumerable.call(obj, i)) return false;
	}
	return true;
};

},{"./valid-value":23}],17:[function(require,module,exports){
"use strict";

var _undefined = require("../function/noop")(); // Support ES3 engines

module.exports = function (val) { return val !== _undefined && val !== null; };

},{"../function/noop":11}],18:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")() ? Object.keys : require("./shim");

},{"./is-implemented":19,"./shim":20}],19:[function(require,module,exports){
"use strict";

module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
		return false;
	}
};

},{}],20:[function(require,module,exports){
"use strict";

var isValue = require("../is-value");

var keys = Object.keys;

module.exports = function (object) { return keys(isValue(object) ? Object(object) : object); };

},{"../is-value":17}],21:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1/*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};

},{"./is-value":17}],22:[function(require,module,exports){
"use strict";

module.exports = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};

},{}],23:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{"./is-value":17}],24:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")() ? String.prototype.contains : require("./shim");

},{"./is-implemented":25,"./shim":26}],25:[function(require,module,exports){
"use strict";

var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return str.contains("dwa") === true && str.contains("foo") === false;
};

},{}],26:[function(require,module,exports){
"use strict";

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],27:[function(require,module,exports){
exports.Agent = require('./lib/Agent');
exports.ServiceManager = require('./lib/ServiceManager');
exports.TransportManager = require('./lib/TransportManager');

exports.transport = {
  LocalTransport:     require('./lib/transport/local/LocalTransport')
};

exports.TransportManager.registerType(exports.transport.LocalTransport);

// load the default ServiceManager, a singleton, initialized with a LocalTransport
exports.system = new exports.ServiceManager();
exports.system.transports.add(new exports.transport.LocalTransport());

// override Agent.getTransportById in order to support Agent.connect(transportId)
exports.Agent.getTransportById = function (id) {
  return exports.system.transports.get(id);
};

},{"./lib/Agent":28,"./lib/ServiceManager":29,"./lib/TransportManager":30,"./lib/transport/local/LocalTransport":34}],28:[function(require,module,exports){
'use strict';

var Promise = require('promise');
var uuid = require('uuid-v4');
var util = require('./util');
var URL = require('url');

/**
 * Agent
 * @param {string} [id]         Id for the agent. If not provided, the agent
 *                              will be given a uuid.
 * @constructor
 */
function Agent(id) {
  this.id = id ? id.toString() : uuid();

  // a list with all connected transports
  this.connections = [];
  this.defaultConnection = null;
  this.ready = Promise.resolve([]);
}

// an object with modules which can be used to extend the agent
Agent.modules = {};

/**
 * Register a new type of module. This module can then be loaded via
 * Agent.extend() and Agent.loadModule().
 * @param {Function} constructor     A module constructor
 */
Agent.registerModule = function (constructor) {
  var type = constructor.prototype.type;
  if (typeof constructor !== 'function') {
    throw new Error('Constructor function expected');
  }
  if (!type) {
    throw new Error('Field "prototype.type" missing in transport constructor');
  }
  if (type in Agent.modules) {
    if (Agent.modules[type] !== constructor) {
      throw new Error('Module of type "' + type + '" already exists');
    }
  }

  Agent.modules[type] = constructor;
};

/**
 * Get a transport by id.
 * This static method can be overloaded for example by the get function of
 * a singleton TransportManager.
 * @param {string} id
 * @return {Transport}
 */
Agent.getTransportById = function (id) {
  throw new Error('Transport with id "' + id + '" not found');
};

/**
 * Extend an agent with modules (mixins).
 * The modules new functions are added to the Agent itself.
 * See also function `loadModule`.
 * @param {string | string[]} module  A module name or an Array with module
 *                                    names. Available modules:
 *                                    'pattern', 'request', 'babble'
 * @param {Object} [options]          Additional options for loading the module
 * @return {Agent} Returns the agent itself
 */
Agent.prototype.extend = function (module, options) {
  if (Array.isArray(module)) {
    var modules = [].concat(module);

    // order the modules such that 'pattern' comes first, this module must be
    // loaded before other modules ('request' specifically)
    modules.sort(function (a, b) {
      if (a == 'pattern') return -1;
      if (b == 'pattern') return 1;
      return 0;
    });

    // an array with module names
    for (var i = 0; i < modules.length; i++) {
      this.extend(modules[i], options)
    }
  }
  else {
    // a single module name
    var constructor = _getModuleConstructor(module);
    var instance = new constructor(this, options);
    var mixin = instance.mixin();

    // check for conflicts in the modules mixin functions
    var me = this;
    Object.keys(mixin).forEach(function (name) {
      if (me[name] !== undefined && name !== '_receive') {
        throw new Error('Conflict: agent already has a property "' + prop + '"');
      }
    });

    // extend the agent with all mixin functions provided by the module
    Object.keys(mixin).forEach(function (name) {
      me[name] = mixin[name];
    });
  }

  return this;
};

/**
 * Load a module onto an agent.
 * See also function `extend`.
 * @param {string | string[]} module  A module name or an Array with module
 *                                    names. Available modules:
 *                                    'pattern', 'request', 'babble'
 * @param {Object} [options]          Additional options for loading the module
 * @return {Object} Returns the created module
 */
Agent.prototype.loadModule = function (module, options, additionalOptions) {
  var _options = options !== undefined ? Object.create(options) : {};
  _options.extend = false;

  var constructor = _getModuleConstructor(module);
  var instance = new constructor(this, options, additionalOptions);
  var mixin = instance.mixin();

  // only replace the _receive function, do not add other mixin functions
  this._receive = mixin._receive;

  return instance;
};

/**
 * Get a module constructor by it's name.
 * Throws an error when the module is not found.
 * @param {string} name
 * @return {function} Returns the modules constructor function
 * @private
 */
function _getModuleConstructor(name) {
  var constructor = Agent.modules[name];
  if (!constructor) {
    throw new Error('Unknown module "' + name + '". ' +
      'Choose from: ' + Object.keys(Agent.modules).map(JSON.stringify).join(', '));
  }
  return constructor;
}

/**
 * Send a message to an agent
 * @param {string} to
 *              to is either:
 *              - A string "agentId", the id of the recipient. Will be send
 *                via the default transport or when there is no default
 *                transport via the first connected transport.
 *              - A string "agentId@transportId" Only usable locally, not
 *                for sharing an address with remote agents.
 *              - A string "protocol://networkId/agentId". This is a sharable
 *                identifier for an agent.
 * @param {*} message  Message to be send
 * @return {Promise} Returns a promise which resolves when the message as
 *                   successfully been sent, or rejected when sending the
 *                   message failed
 */
Agent.prototype.send = function (to, message) {

  var colon = to.indexOf(':');
  if (colon !== -1) {
    var url = URL.parse(to);

    //TODO: Fix this for protocols that use networkId instead of host (Needs to be fixed in the protocol itself.)
    return this._sendByProtocol(url.protocol.slice(0, -1), to, message);
  }

  // TODO: deprecate this notation "agentId@transportId"?
  var at = to.indexOf('@');
  if (at != -1) {
    // to is an id like "agentId@transportId"
    var _to = to.substring(0, at);
    var _transportId = to.substring(at + 1);
    return this._sendByTransportId(_transportId, _to, message);
  }

  // to is an id like "agentId". Send via the default transport
  var conn = this.defaultConnection;
  if (conn) {
    return conn.send(to, message);
  }
  else {
    return Promise.reject(new Error('No transport found'));
  }
};

/**
 * Send a transport to an agent given a networkId
 * @param {string} networkId    A network id
 * @param {string} to           An agents id
 * @param {string} message      Message to be send
 * @return {Promise} Returns a promise which resolves when the message as
 *                   successfully been sent, or rejected when sending the
 *                   message failed
 * @private
 */
Agent.prototype._sendByNetworkId = function (networkId, to, message) {
  // TODO: change this.connections to a map with networkId as keys, much faster
  for (var i = 0; i < this.connections.length; i++) {
    var connection = this.connections[i];
    if (connection.transport.networkId == networkId) {
      return connection.send(to, message);
    }
  }

  return Promise.reject(new Error('No transport found with networkId "' + networkId + '"'));
};

/**
 * Send a message by a transport by protocol.
 * The message will be send via the first found transport having the specified
 * protocol.
 * @param {string} protocol     A protocol, for example 'http' or 'ws'
 * @param {string} to           An agents id
 * @param {string} message      Message to be send
 * @return {Promise} Returns a promise which resolves when the message as
 *                   successfully been sent, or rejected when sending the
 *                   message failed
 * @private
 */
Agent.prototype._sendByProtocol = function (protocol, to, message) {

  // the https addresses also make use of the http protocol.
  protocol = protocol == 'https' ? 'http' : protocol;

  for (var i = 0; i < this.connections.length; i++) {
    var connection = this.connections[i];
    if (connection.transport.type == protocol) {
      return connection.send(to, message);
    }
  }

  return Promise.reject(new Error('No transport found for protocol "' + protocol + '"'));
};

/**
 * Send a transport to an agent via a specific transport
 * @param {string} transportId  The configured id of a transport.
 * @param {string} to           An agents id
 * @param {string} message      Message to be send
 * @return {Promise} Returns a promise which resolves when the message as
 *                   successfully been sent, or rejected when sending the
 *                   message failed
 * @private
 */
Agent.prototype._sendByTransportId = function (transportId, to, message) {
  for (var i = 0; i < this.connections.length; i++) {
    var connection = this.connections[i];
    if (connection.transport.id == transportId) {
      return connection.send(to, message);
    }
  }

  return Promise.reject(new Error('No transport found with id "' + transportId + '"'));
};

/**
 * Receive a message.
 * @param {string} from     Id of sender
 * @param {*} message       Received message, a JSON object (often a string)
 */
Agent.prototype.receive = function (from, message, oobParams) {
  // ... to be overloaded
};

/**
 * The method _receive is overloaded in a cascaded way by modules, and calls
 * the public method Agent.receive at the end of the chain.
 * @param {string} from     Id of sender
 * @param {*} message       Received message, a JSON object (often a string)
 * @param {array} oobParams Optional Out of Band parameters, e.g. query params for http
 * @returns {*} Returns the return value of Agent.receive
 * @private
 */
Agent.prototype._receive = function (from, message, oobParams) {
  return this.receive(from, message);
};

Agent.prototype.getUrls = function () {
  return this.connections.map(function (connection) {
    return connection.getMyUrl()
  });
};

Agent.prototype.getUrlByProtocol = function (protocol) {
  for (var i = 0; i < this.connections.length; i++) {
    var connection = this.connections[i];
    if (connection.transport.type == protocol) {
      return connection.getMyUrl();
    }
  }
};

/**
 * Connect to a transport. The agent will subscribe itself to
 * messages sent to his id.
 * @param {string | Transport | Transport[] | string[]} transport
 *                                  A Transport instance, or the id of a
 *                                  transport loaded in eve.system.
 * @param {string} [id]             An optional alternative id to be used
 *                                  for the connection. By default, the agents
 *                                  own id is used.
 * @return {Connection | Connection[]}  Returns a connection or, in case of
 *                                      multiple transports, returns an
 *                                      array with connections. The connections
 *                                      have a promise .ready which resolves
 *                                      as soon as the connection is ready for
 *                                      use.
 */
Agent.prototype.connect = function (transport, id) {
  if (Array.isArray(transport)) {
    var me = this;
    return transport.map(function (_transport) {
        try {
          return me._connect(_transport, id);
        } catch (e) {
          return {error: e}
        }
      }
    );
  }
  else if (typeof transport === 'string') {
    // get transport by id
    try {
      return this._connect(Agent.getTransportById(transport), id);
    } catch (e) {
      return {error: e}
    }
  }
  else {
    // a transport instance
    try {
      return this._connect(transport, id);
    } catch (e) {
      return {error: e}
    }
  }
};

/**
 * Connect to a transport
 * @param {Transport} transport     A Transport instance
 * @param {string} [id]             An optional alternative id to be used
 *                                  for the connection. By default, the agents
 *                                  own id is used.
 * @return {Connection}             Returns a connection.
 * @private
 */
Agent.prototype._connect = function (transport, id) {
  // create a receive function which is bound to the _receive function.
  // the _receive function can be replaced in by modules in a cascaded way,
  // and in the end calls this.receive of the agent.
  // note: we don't do receive = this._receive.bind(this) as the _receive
  //       function can be overloaded after a connection is made.
  var me = this;
  var receive = function (from, message, oobParams) {
    return me._receive(from, message, oobParams);
  };
  var connection = transport.connect(id || this.id, receive);
  this.connections.push(connection);

  // set or replace the defaultConnection
  if (!this.defaultConnection) {
    this.defaultConnection = connection;
  }
  else if (transport['default']) {
    if (this.defaultConnection['default']) {
      throw new Error('Cannot connect to a second default transport');
    }
    this.defaultConnection = connection;
  }

  this._updateReady();

  return connection;
};

/**
 * Disconnect from one or multiple transports
 * @param {string | Transport | string[] | Transport[]} [transport]
 *              A transport or an array with transports.
 *              parameter transport can be an instance of a Transport, or the
 *              id of a transport.
 *              When transport is undefined, the agent will be disconnected
 *              from all connected transports.
 */
Agent.prototype.disconnect = function (transport) {
  var i, connection;

  if (!transport) {
    // disconnect all transports
    while (connection = this.connections[0]) {
      this._disconnect(connection);
    }
  }
  else if (Array.isArray(transport)) {
    // an array with transports
    i = 0;
    while (i < this.connections.length) {
      connection = this.connections[i];
      if (transport.indexOf(connection.transport) !== -1) {
        this._disconnect(connection);
      }
      else {
        i++;
      }
    }
  }
  else if (typeof transport === 'string') {
    // transport by id
    this.disconnect(Agent.getTransportById(transport));
  }
  else {
    // a single transport
    for (i = 0; i < this.connections.length; i++) {
      connection = this.connections[i];
      if (connection.transport === transport) {
        this._disconnect(connection);
        break;
      }
    }
  }
};

/**
 * Close a connection
 * @param {Connection} connection
 * @private
 */
Agent.prototype._disconnect = function (connection) {
  // find the connection
  var index = this.connections.indexOf(connection);
  if (index !== -1) {
    // close the connection
    connection.close();

    // remove from the list with connections
    this.connections.splice(index, 1);

    // replace the defaultConnection if needed
    if (this.defaultConnection === connection) {
      this.defaultConnection = this.connections[this.connections.length - 1] || null;
    }
  }

  this._updateReady();
};

/**
 * Update the ready state of the agent
 * @private
 */
Agent.prototype._updateReady = function () {
  // FIXME: we should not replace with a new Promise,
  //        we have a problem when this.ready is requested before ready,
  //        and another connection is opened before ready
  this.ready = Promise.all(this.connections.map(function (connection) {
    return connection.ready;
  }));
};

module.exports = Agent;

},{"./util":35,"promise":59,"url":6,"uuid-v4":68}],29:[function(require,module,exports){
'use strict';

var seed = require('seed-random');
var hypertimer = require('hypertimer');
var TransportManager = require('./TransportManager');

// map with known configuration properties
var KNOWN_PROPERTIES = {
  transports: true,
  timer: true,
  random: true
};

function ServiceManager(config) {
  this.transports = new TransportManager();

  this.timer = hypertimer();

  this.random = Math.random;

  this.init(config);
}

/**
 * Initialize the service manager with services loaded from a configuration
 * object. All current services are unloaded and removed.
 * @param {Object} config
 */
ServiceManager.prototype.init = function (config) {
  this.transports.clear();

  if (config) {
    if (config.transports) {
      this.transports.load(config.transports);
    }

    if (config.timer) {
      this.timer.config(config.timer);
    }

    if (config.random) {
      if (config.random.deterministic) {
        var key = config.random.seed || 'random seed';
        this.random = seed(key, config.random);
      }
      else {
        this.random = Math.random;
      }
    }

    for (var prop in config) {
      if (config.hasOwnProperty(prop) && !KNOWN_PROPERTIES[prop]) {
        // TODO: should log this warning via a configured logger
        console.log('WARNING: Unknown configuration option "' + prop + '"')
      }
    }
  }
};

/**
 * Clear all configured services
 */
ServiceManager.prototype.clear = function () {
  this.transports.clear();
};

module.exports = ServiceManager;

},{"./TransportManager":30,"hypertimer":38,"seed-random":67}],30:[function(require,module,exports){
'use strict';

/**
 * A manager for loading and finding transports.
 * @param {Array} [config]      Optional array containing configuration objects
 *                             for transports.
 * @constructor
 */
function TransportManager(config) {
  this.transports = [];

  if (config) {
    this.load(config);
  }
}

// map with all registered types of transports
// each transport must register itself at the TransportManager using registerType.
TransportManager.types = {};

/**
 * Register a new type of transport. This transport can then be loaded via
 * configuration.
 * @param {Transport.prototype} constructor     A transport constructor
 */
TransportManager.registerType = function (constructor) {
  var type = constructor.prototype.type;
  if (typeof constructor !== 'function') {
    throw new Error('Constructor function expected');
  }
  if (!type) {
    throw new Error('Field "prototype.type" missing in transport constructor');
  }
  if (type in TransportManager.types) {
    if (TransportManager.types[type] !== constructor) {
      throw new Error('Transport type "' + type + '" already exists');
    }
  }

  TransportManager.types[type] = constructor;
};

/**
 * Add a loaded transport to the manager
 * @param {Transport} transport
 * @return {Transport} returns the transport itself
 */
TransportManager.prototype.add = function (transport) {
  this.transports.push(transport);
  return transport;
};

/**
 * Load one or multiple transports based on JSON configuration.
 * New transports will be appended to current transports.
 * @param {Object | Array} config
 * @return {Transport | Transport[]} Returns the loaded transport(s)
 */
TransportManager.prototype.load = function (config) {
  if (Array.isArray(config)) {
    return config.map(this.load.bind(this));
  }

  var type = config.type;
  if (!type) {
    throw new Error('Property "type" missing');
  }

  var constructor = TransportManager.types[type];
  if (!constructor) {
    throw new Error('Unknown type of transport "' + type + '". ' +
        'Choose from: ' + Object.keys(TransportManager.types).join(','))
  }

  var transport = new constructor(config);
  this.transports.push(transport);
  return transport;
};

/**
 * Unload a transport.
 * @param {Transport | Transport[] | string | string[]} transport
 *              A Transport instance or the id of a transport, or an Array
 *              with transports or transport ids.
 */
TransportManager.prototype.unload = function (transport) {
  var _transport;
  if (typeof transport === 'string') {
    _transport = this.get(transport);
  }
  else if (Array.isArray(transport)) {
    for (var i = 0; i < transport.length; i++) {
      this.unload(transport[i]);
    }
  }
  else {
    _transport = transport;
  }

  if (_transport) {
    _transport.close();

    var index = this.transports.indexOf(_transport);
    if (index !== -1) {
      this.transports.splice(index, 1);
    }
  }
};

/**
 * Get a transport by its id. The transport must have been created with an id
 * @param {string} [id] The id of a transport
 * @return {Transport} Returns the transport when found. Throws an error
 *                     when not found.
 */
TransportManager.prototype.get = function (id) {
  for (var i = 0; i < this.transports.length; i++) {
    var transport = this.transports[i];
    if (transport.id === id) {
      return transport;
    }
  }

  throw new Error('Transport with id "' + id + '" not found');
};

/**
 * Get all transports.
 * @return {Transport[]} Returns an array with all loaded transports.
 */
TransportManager.prototype.getAll = function () {
  return this.transports.concat([]);
};

/**
 * Find transports by type.
 * @param {string} [type]   Type of the transport. Choose from 'amqp',
 *                          'distribus', 'local', 'pubnub'.
 * @return {Transport[]}    When type is defined, the all transports of this
 *                          type are returned. When undefined, all transports
 *                          are returned.
 */
TransportManager.prototype.getByType = function (type) {
  if (type) {
    if (!(type in TransportManager.types)) {
      throw new Error('Unknown type of transport "' + type + '". ' +
          'Choose from: ' + Object.keys(TransportManager.types).join(','))
    }

    return this.transports.filter(function (transport) {
      return transport.type === type;
    });
  }
  else {
    return [].concat(this.transports);
  }
};

/**
 * Close all configured transports and remove them from the manager.
 */
TransportManager.prototype.clear = function () {
  this.transports.forEach(function (transport) {
    transport.close();
  });
  this.transports = [];
};

module.exports = TransportManager;

},{}],31:[function(require,module,exports){
'use strict';

var Promise = require('promise');

/**
 * An abstract Transport connection
 * @param {Transport} transport
 * @param {string} id
 * @param {function} receive
 * @constructor
 * @abstract
 */
function Connection (transport, id, receive) {
  throw new Error('Cannot create an abstract Connection');
}

Connection.prototype.ready = Promise.reject(new Error('Cannot get abstract property ready'));

/**
 * Send a message to an agent.
 * @param {string} to
 * @param {*} message
 * @return {Promise} returns a promise which resolves when the message has been sent
 */
Connection.prototype.send = function (to, message) {
  throw new Error('Cannot call abstract function send');
};

/**
 * Close the connection, disconnect from the transport.
 */
Connection.prototype.close = function () {
  throw new Error('Cannot call abstract function "close"');
};

Connection.prototype.getMyUrl = function(){
  return this.transport.type +":"+this.id;
};

module.exports = Connection;

},{"promise":59}],32:[function(require,module,exports){
'use strict';

/**
 * Abstract prototype of a transport
 * @param {Object} [config]
 * @constructor
 */
function Transport(config) {
  this.id = config && config.id || null;
  this['default'] = config && config['default'] || false;
}

Transport.prototype.type = null;

/**
 * Connect an agent
 * @param {String} id
 * @param {Function} receive  Invoked as receive(from, message)
 * @return {Connection}       Returns a connection
 */
Transport.prototype.connect = function(id, receive) {
  throw new Error('Cannot invoke abstract function "connect"');
};

/**
 * Close the transport
 */
Transport.prototype.close = function() {
  throw new Error('Cannot invoke abstract function "close"');
};

module.exports = Transport;

},{}],33:[function(require,module,exports){
'use strict';

var Promise = require('promise');
var Connection = require('../Connection');

/**
 * A local connection.
 * @param {LocalTransport} transport
 * @param {string | number} id
 * @param {function} receive
 * @constructor
 */
function LocalConnection(transport, id, receive) {
  this.transport = transport;
  this.id = id;

  // register the agents receive function
  if (this.id in this.transport.agents) {
    throw new Error('Agent with id ' + id + ' already exists');
  }
  this.transport.agents[this.id] = receive;

  // ready state
  this.ready = Promise.resolve(this);
}

LocalConnection.prototype.getMyUrl = function(){
  return this.transport.type +":"+this.id;
};

/**
 * Send a message to an agent.
 * @param {string} to
 * @param {*} message
 * @return {Promise} returns a promise which resolves when the message has been sent
 */
LocalConnection.prototype.send = function (to, message) {
  var query = to.replace("local:","").split("?");
  var callback = this.transport.agents[query[0]];
  if (!callback) {
    return Promise.reject(new Error('Agent with id ' + to + ' not found'));
  }

  var queryParams = query[1] ? query[1].split("&"):[];
  // invoke the agents receiver as callback(from, message, queryparameters)
  callback("local:"+this.id, message, queryParams);

  return Promise.resolve();
};

/**
 * Close the connection
 */
LocalConnection.prototype.close = function () {
  delete this.transport.agents[this.id];
};

module.exports = LocalConnection;

},{"../Connection":31,"promise":59}],34:[function(require,module,exports){
'use strict';

var Transport = require('./../Transport');
var LocalConnection = require('./LocalConnection');

/**
 * Create a local transport.
 * @param {Object} config         Config can contain the following properties:
 *                                - `id: string`. Optional
 * @constructor
 */
function LocalTransport(config) {
  this.id = config && config.id || null;
  this.networkId = this.id || null;
  this['default'] = config && config['default'] || false;
  this.agents = {};
}

LocalTransport.prototype = new Transport();

LocalTransport.prototype.type = 'local';

/**
 * Connect an agent
 * @param {String} id
 * @param {Function} receive                  Invoked as receive(from, message)
 * @return {LocalConnection} Returns a promise which resolves when
 *                                                connected.
 */
LocalTransport.prototype.connect = function(id, receive) {
  return new LocalConnection(this, id, receive);
};

/**
 * Close the transport. Removes all agent connections.
 */
LocalTransport.prototype.close = function() {
  this.agents = {};
};

module.exports = LocalTransport;

},{"./../Transport":32,"./LocalConnection":33}],35:[function(require,module,exports){
'use strict';

/**
 * Test whether the provided value is a Promise.
 * A value is marked as a Promise when it is an object containing functions
 * `then` and `catch`.
 * @param {*} value
 * @return {boolean} Returns true when `value` is a Promise
 */
exports.isPromise = function (value) {
  return value &&
      typeof value['then'] === 'function' &&
      typeof value['catch'] === 'function'
};

/**
 * Normalize a url. Removes trailing slash
 * @param {string} url
 * @return {string} Returns the normalized url
 */
exports.normalizeURL = function (url) {
  if (url[url.length - 1] == '/') {
    return url.substring(0, url.length - 1);
  }
  else {
    return url;
  }
};

},{}],36:[function(require,module,exports){
'use strict';

var isEmpty = require('es5-ext/object/is-empty')
  , value   = require('es5-ext/object/valid-value')

  , hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function (obj/*, type*/) {
	var type;
	value(obj);
	type = arguments[1];
	if (arguments.length > 1) {
		return hasOwnProperty.call(obj, '__ee__') && Boolean(obj.__ee__[type]);
	}
	return obj.hasOwnProperty('__ee__') && !isEmpty(obj.__ee__);
};

},{"es5-ext/object/is-empty":16,"es5-ext/object/valid-value":23}],37:[function(require,module,exports){
'use strict';

var d        = require('d')
  , callable = require('es5-ext/object/valid-callable')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;

},{"d":10,"es5-ext/object/valid-callable":22}],38:[function(require,module,exports){
module.exports = require('./lib/hypertimer');

},{"./lib/hypertimer":41}],39:[function(require,module,exports){
module.exports = (typeof window === 'undefined' || typeof window.Promise === 'undefined') ?
    require('promise') :
    window.Promise;

},{"promise":51}],40:[function(require,module,exports){
var Debug = typeof window !== 'undefined' ? window.Debug : require('debug');

module.exports = Debug || function () {
  // empty stub when in the browser
  return function () {};
};

},{"debug":49}],41:[function(require,module,exports){
var emitter = require('event-emitter');
var hasListeners = require('event-emitter/has-listeners');
var createMaster = require('./synchronization/master').createMaster;
var createSlave = require('./synchronization/slave').createSlave;
var util = require('./util');

// enum for type of timeout
var TYPE = {
  TIMEOUT: 0,
  INTERVAL: 1,
  TRIGGER: 2
};

/**
 * Create a new hypertimer
 * @param {Object} [options]  The following options are available:
 *                            deterministic: boolean
 *                                        If true (default), simultaneous events
 *                                        are executed in a deterministic order.
 *                            paced: boolean
 *                                        Mode for pacing of time. When paced,
 *                                        the time proceeds at a continuous,
 *                                        configurable rate, useful for
 *                                        animation purposes. When unpaced, the
 *                                        time jumps immediately from scheduled
 *                                        event to the next scheduled event.
 *                            rate: number
 *                                        The rate of progress of time with
 *                                        respect to real-time. Rate must be a
 *                                        positive number, and is 1 by default.
 *                                        For example when 2, the time of the
 *                                        hypertimer runs twice as fast as
 *                                        real-time.
 *                                        Only applicable when option paced=true.
 *                            time: number | Date | String
 *                                        Set a simulation time. If not provided,
 *                                        The timer is instantiated with the
 *                                        current system time.
 */
function hypertimer(options) {
  // options
  var paced = true;
  var rate = 1;             // number of milliseconds per milliseconds
  var deterministic = true; // run simultaneous events in a deterministic order
  var configuredTime = null;// only used for returning the configured time on .config()
  var master = null;        // url of master, will run as slave
  var port = null;          // port to serve as master

  // properties
  var running = false;              // true when running
  var startTime = null;             // timestamp. the moment in real-time when hyperTime was set
  var hyperTime = util.systemNow(); // timestamp. the start time in hyper-time
  var timeouts = [];                // array with all running timeouts
  var current = {};                 // the timeouts currently in progress (callback is being executed)
  var timeoutId = null;             // currently running timer
  var idSeq = 0;                    // counter for unique timeout id's
  var server = null;
  var client = null;

  // exported timer object with public functions and variables
  // add event-emitter mixin
  var timer = emitter({});

  /**
   * Change configuration options of the hypertimer, or retrieve current
   * configuration.
   * @param {Object} [options]  The following options are available:
   *                            deterministic: boolean
   *                                        If true (default), simultaneous events
   *                                        are executed in a deterministic order.
   *                            paced: boolean
   *                                        Mode for pacing of time. When paced,
   *                                        the time proceeds at a continuous,
   *                                        configurable rate, useful for
   *                                        animation purposes. When unpaced, the
   *                                        time jumps immediately from scheduled
   *                                        event to the next scheduled event.
   *                            rate: number
   *                                        The rate of progress of time with
   *                                        respect to real-time. Rate must be a
   *                                        positive number, and is 1 by default.
   *                                        For example when 2, the time of the
   *                                        hypertimer runs twice as fast as
   *                                        real-time.
   *                                        Only applicable when option paced=true.
   *                            time: number | Date | String
   *                                        Set a simulation time.
   * @return {Object} Returns the applied configuration
   */
  timer.config = function(options) {
    if (options) {
      _validateConfig(options);
      _setConfig(options);
    }

    // return a copy of the configuration options
    return _getConfig();
  };

  /**
   * Returns the current time of the timer as a number.
   * See also getTime().
   * @return {number} The time
   */
  timer.now = function () {
    if (paced) {
      if (running) {
        // TODO: implement performance.now() / process.hrtime(time) for high precision calculation of time interval
        var realInterval = util.systemNow() - startTime;
        var hyperInterval = realInterval * rate;
        return hyperTime + hyperInterval;
      }
      else {
        return hyperTime;
      }
    }
    else {
      return hyperTime;
    }
  };

  /**
   * Continue the timer.
   */
  timer['continue'] = function() {
    startTime = util.systemNow();
    running = true;

    // reschedule running timeouts
    _schedule();
  };

  /**
   * Pause the timer. The timer can be continued again with `continue()`
   */
  timer.pause = function() {
    hyperTime = timer.now();
    startTime = null;
    running = false;

    // reschedule running timeouts (pauses them)
    _schedule();
  };

  /**
   * Returns the current time of the timer as Date.
   * See also now().
   * @return {Date} The time
   */
  timer.getTime = function() {
    return new Date(timer.now());
  };

  /**
   * Get the value of the hypertimer. This function returns the result of getTime().
   * @return {Date} current time
   */
  timer.valueOf = timer.getTime;

  /**
   * Return a string representation of the current hyper-time.
   * @returns {string} String representation
   */
  timer.toString = function () {
    return timer.getTime().toString();
  };

  /**
   * Set a timeout, which is triggered when the timeout occurs in hyper-time.
   * See also setTrigger.
   * @param {Function} callback   Function executed when delay is exceeded.
   * @param {number} delay        The delay in milliseconds. When the delay is
   *                              smaller or equal to zero, the callback is
   *                              triggered immediately.
   * @return {number} Returns a timeoutId which can be used to cancel the
   *                  timeout using clearTimeout().
   */
  timer.setTimeout = function(callback, delay) {
    var id = idSeq++;
    var timestamp = timer.now() + delay;
    if (isNaN(timestamp)) {
      throw new TypeError('delay must be a number');
    }

    // add a new timeout to the queue
    _queueTimeout({
      id: id,
      type: TYPE.TIMEOUT,
      time: timestamp,
      callback: callback
    });

    // reschedule the timeouts
    _schedule();

    return id;
  };

  /**
   * Set a trigger, which is triggered when the timeout occurs in hyper-time.
   * See also getTimeout.
   * @param {Function} callback   Function executed when timeout occurs.
   * @param {Date | number | string } time
   *                              An absolute moment in time (Date) when the
   *                              callback will be triggered. When the date is
   *                              a Date in the past, the callback is triggered
   *                              immediately.
   * @return {number} Returns a triggerId which can be used to cancel the
   *                  trigger using clearTrigger().
   */
  timer.setTrigger = function (callback, time) {
    var id = idSeq++;
    var timestamp = toTimestamp(time);

    // add a new timeout to the queue
    _queueTimeout({
      id: id,
      type: TYPE.TRIGGER,
      time: timestamp,
      callback: callback
    });

    // reschedule the timeouts
    _schedule();

    return id;
  };


  /**
   * Trigger a callback every interval. Optionally, a start date can be provided
   * to specify the first time the callback must be triggered.
   * See also setTimeout and setTrigger.
   * @param {Function} callback         Function executed when delay is exceeded.
   * @param {number} interval           Interval in milliseconds. When interval
   *                                    is smaller than zero or is infinity, the
   *                                    interval will be set to zero and triggered
   *                                    with a maximum rate.
   * @param {Date | number | string} [firstTime]
   *                                    An absolute moment in time (Date) when the
   *                                    callback will be triggered the first time.
   *                                    By default, firstTime = now() + interval.
   * @return {number} Returns a intervalId which can be used to cancel the
   *                  trigger using clearInterval().
   */
  timer.setInterval = function(callback, interval, firstTime) {
    var id = idSeq++;

    var _interval = Number(interval);
    if (isNaN(_interval)) {
      throw new TypeError('interval must be a number');
    }
    if (_interval < 0 || !isFinite(_interval)) {
      _interval = 0;
    }

    var _firstTime = (firstTime != undefined) ?
        toTimestamp(firstTime) :
        null;

    var now = timer.now();
    var _time = (_firstTime != null) ? _firstTime : (now + _interval);

    var timeout = {
      id: id,
      type: TYPE.INTERVAL,
      interval: _interval,
      time: _time,
      firstTime: _firstTime != null ? _firstTime : _time,
      occurrence: 0,
      callback: callback
    };

    if (_time < now) {
      // update schedule when in the past
      _rescheduleInterval(timeout, now);
    }

    // add a new timeout to the queue
    _queueTimeout(timeout);

    // reschedule the timeouts
    _schedule();

    return id;
  };

  /**
   * Cancel a timeout
   * @param {number} timeoutId   The id of a timeout
   */
  timer.clearTimeout = function(timeoutId) {
    // test whether timeout is currently being executed
    if (current[timeoutId]) {
      delete current[timeoutId];
      return;
    }

    // find the timeout in the queue
    for (var i = 0; i < timeouts.length; i++) {
      if (timeouts[i].id === timeoutId) {
        // remove this timeout from the queue
        timeouts.splice(i, 1);

        // reschedule timeouts
        _schedule();
        break;
      }
    }
  };

  /**
   * Cancel a trigger
   * @param {number} triggerId   The id of a trigger
   */
  timer.clearTrigger = timer.clearTimeout;

  timer.clearInterval = timer.clearTimeout;

  /**
   * Returns a list with the id's of all timeouts
   * @returns {number[]} Timeout id's
   */
  timer.list = function () {
    return timeouts.map(function (timeout) {
      return timeout.id;
    });
  };

  /**
   * Clear all timeouts
   */
  timer.clear = function () {
    // empty the queue
    current = {};
    timeouts = [];

    // reschedule
    _schedule();
  };

  /**
   * Destroy the timer. This will clear all timeouts, and close connections
   * to a master or to slave timers.
   */
  timer.destroy = function () {
    timer.clear();
    if (client) client.destroy();
    if (server) server.destroy();
  };

  /**
   * Get the current configuration
   * @returns {{paced: boolean, rate: number, deterministic: boolean, time: *, master: *}}
   *                Returns a copy of the current configuration
   * @private
   */
  function _getConfig () {
    return {
      paced: paced,
      rate: rate,
      deterministic: deterministic,
      time: configuredTime,
      master: master,
      port: port
    }
  }

  /**
   * Validate configuration, depending on the current mode: slave or normal
   * @param {Object} options
   * @private
   */
  function _validateConfig (options) {
    // validate writable options
    if (client || options.master) {
      // when we are a slave, we can't adjust the config, except for
      // changing the master url or becoming a master itself (port configured)
      for (var prop in options) {
        if (prop !== 'master' && prop !== 'slave') {
          throw new Error('Cannot apply configuration option "'  + prop +'", timer is configured as slave.');
        }
      }
    }
  }

  /**
   * Change configuration
   * @param {{paced: boolean, rate: number, deterministic: boolean, time: *, master: *}} options
   * @private
   */
  function _setConfig(options) {
    if ('deterministic' in options) {
      deterministic = options.deterministic ? true : false;
    }

    if ('paced' in options) {
      paced = options.paced ? true : false;
    }

    // important: apply time before rate
    if ('time' in options) {
      hyperTime = toTimestamp(options.time);
      startTime = util.systemNow();

      // update intervals
      _rescheduleIntervals(hyperTime);

      configuredTime = new Date(hyperTime).toISOString();
    }

    if ('rate' in options) {
      var newRate = Number(options.rate);
      if (isNaN(newRate) || newRate <= 0) {
        throw new TypeError('Invalid rate ' + JSON.stringify(options.rate) + '. Rate must be a positive number');
      }

      // important: first get the new hyperTime, then adjust the startTime
      hyperTime = timer.now();
      startTime = util.systemNow();
      rate = newRate;
    }

    if ('master' in options) {
      // create a timesync slave, connect to master via a websocket
      if (client) {
        client.destroy();
        client = null;
      }

      master = options.master;
      if (options.master != null) {
        client = createSlave(options.master);

        function applyConfig(config) {
          var prev = _getConfig();
          _setConfig(config);
          var curr = _getConfig();
          timer.emit('config', curr, prev);
        }

        client.on('change', function (time)   { applyConfig({time: time}) });
        client.on('config', function (config) { applyConfig(config) });
        client.on('error',  function (err)    { timer.emit('error', err) });
      }
    }

    // create a master
    if ('port' in options) {
      if (server) {
        server.destroy();
        server = null;
      }

      port = options.port;
      if (options.port) {
        server = createMaster(timer.now, timer.config, options.port);
        server.on('error', function (err) { timer.emit('error', err) });
      }
    }

    // reschedule running timeouts
    _schedule();

    if (server) {
      // broadcast changed config
      server.broadcastConfig();
    }
  }

  /**
   * Reschedule all intervals after a new time has been set.
   * @param {number} now
   * @private
   */
  function _rescheduleIntervals(now) {
    for (var i = 0; i < timeouts.length; i++) {
      var timeout = timeouts[i];
      if (timeout.type === TYPE.INTERVAL) {
        _rescheduleInterval(timeout, now);
      }
    }
  }

  /**
   * Reschedule the intervals after a new time has been set.
   * @param {Object} timeout
   * @param {number} now
   * @private
   */
  function _rescheduleInterval(timeout, now) {
    timeout.occurrence = Math.round((now - timeout.firstTime) / timeout.interval);
    timeout.time = timeout.firstTime + timeout.occurrence * timeout.interval;
  }

  /**
   * Add a timeout to the queue. After the queue has been changed, the queue
   * must be rescheduled by executing _reschedule()
   * @param {{id: number, type: number, time: number, callback: Function}} timeout
   * @private
   */
  function _queueTimeout(timeout) {
    // insert the new timeout at the right place in the array, sorted by time
    if (timeouts.length > 0) {
      var i = timeouts.length - 1;
      while (i >= 0 && timeouts[i].time > timeout.time) {
        i--;
      }

      // insert the new timeout in the queue. Note that the timeout is
      // inserted *after* existing timeouts with the exact *same* time,
      // so the order in which they are executed is deterministic
      timeouts.splice(i + 1, 0, timeout);
    }
    else {
      // queue is empty, append the new timeout
      timeouts.push(timeout);
    }
  }

  /**
   * Execute a timeout
   * @param {{id: number, type: number, time: number, callback: function}} timeout
   * @param {function} [callback]
   *             The callback is executed when the timeout's callback is
   *             finished. Called without parameters
   * @private
   */
  function _execTimeout(timeout, callback) {
    // store the timeout in the queue with timeouts in progress
    // it can be cleared when a clearTimeout is executed inside the callback
    current[timeout.id] = timeout;

    function finish() {
      // in case of an interval we have to reschedule on next cycle
      // interval must not be cleared while executing the callback
      if (timeout.type === TYPE.INTERVAL && current[timeout.id]) {
        timeout.occurrence++;
        timeout.time = timeout.firstTime + timeout.occurrence * timeout.interval;
        _queueTimeout(timeout);
        //console.log('queue timeout', timer.getTime().toISOString(), new Date(timeout.time).toISOString(), timeout.occurrence) // TODO: cleanup
      }

      // remove the timeout from the queue with timeouts in progress
      delete current[timeout.id];

      callback && callback();
    }

    // execute the callback
    try {
      if (timeout.callback.length == 0) {
        // synchronous timeout,  like `timer.setTimeout(function () {...}, delay)`
        timeout.callback();
        finish();
      } else {
        // asynchronous timeout, like `timer.setTimeout(function (done) {...; done(); }, delay)`
        timeout.callback(finish);
      }
    } catch (err) {
      // emit or log the error
      if (hasListeners(timer, 'error')) {
        timer.emit('error', err);
      }
      else {
        console.log('Error', err);
      }

      finish();
    }
  }

  /**
   * Remove all timeouts occurring before or on the provided time from the
   * queue and return them.
   * @param {number} time    A timestamp
   * @returns {Array} returns an array containing all expired timeouts
   * @private
   */
  function _getExpiredTimeouts(time) {
    var i = 0;
    while (i < timeouts.length && ((timeouts[i].time <= time) || !isFinite(timeouts[i].time))) {
      i++;
    }
    var expired = timeouts.splice(0, i);

    if (deterministic == false) {
      // the array with expired timeouts is in deterministic order
      // shuffle them
      util.shuffle(expired);
    }

    return expired;
  }

  /**
   * Reschedule all queued timeouts
   * @private
   */
  function _schedule() {
    // do not _schedule when there are timeouts in progress
    // this can be the case with async timeouts in non-paced mode.
    // _schedule will be executed again when all async timeouts are finished.
    if (!paced && Object.keys(current).length > 0) {
      return;
    }

    var next = timeouts[0];

    // cancel timer when running
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (running && next) {
      // schedule next timeout
      var time = next.time;
      var delay = time - timer.now();
      var realDelay = paced ? delay / rate : 0;

      function onTimeout() {
        // when running in non-paced mode, update the hyperTime to
        // adjust the time of the current event
        if (!paced) {
          hyperTime = (time > hyperTime && isFinite(time)) ? time : hyperTime;
        }

        // grab all expired timeouts from the queue
        var expired = _getExpiredTimeouts(time);
        // note: expired.length can never be zero (on every change of the queue, we reschedule)

        // execute all expired timeouts
        if (paced) {
          // in paced mode, we fire all timeouts in parallel,
          // and don't await their completion (they can do async operations)
          expired.forEach(function (timeout) {
            _execTimeout(timeout);
          });

          // schedule the next round
          _schedule();
        }
        else {
          // in non-paced mode, we execute all expired timeouts serially,
          // and wait for their completion in order to guarantee deterministic
          // order of execution
          function next() {
            var timeout = expired.shift();
            if (timeout) {
              _execTimeout(timeout, next);
            }
            else {
              // schedule the next round
              _schedule();
            }
          }
          next();
        }
      }

      timeoutId = setTimeout(onTimeout, Math.round(realDelay));
      // Note: Math.round(realDelay) is to defeat a bug in node.js v0.10.30,
      //       see https://github.com/joyent/node/issues/8065
    }
  }

  /**
   * Convert a Date, number, or ISOString to a number timestamp,
   * and validate whether it's a valid Date. The number Infinity is also
   * accepted as a valid timestamp
   * @param {Date | number | string} date
   * @return {number} Returns a unix timestamp, a number
   */
  function toTimestamp(date) {
    var value =
        (typeof date === 'number') ? date :           // number
        (date instanceof Date)     ? date.valueOf() : // Date
        new Date(date).valueOf();                     // ISOString, momentjs, ...

    if (isNaN(value)) {
      throw new TypeError('Invalid date ' + JSON.stringify(date) + '. ' +
          'Date, number, or ISOString expected');
    }

    return value;
  }

  Object.defineProperty(timer, 'running', {
    get: function () {
      return running;
    }
  });

  timer.config(options);  // apply options
  timer.continue();       // start the timer

  return timer;
}

module.exports = hypertimer;

},{"./synchronization/master":43,"./synchronization/slave":44,"./util":48,"event-emitter":37,"event-emitter/has-listeners":36}],42:[function(require,module,exports){
module.exports = (typeof window === 'undefined' || typeof window.WebSocket === 'undefined') ?
    require('ws') :
    window.WebSocket;

},{"ws":69}],43:[function(require,module,exports){
var WebSocket = require('./WebSocket');
var emitter = require('./socket-emitter');
var debug = require('../debug')('hypertimer:master');

exports.createMaster = function (now, config, port) {
  var master = new WebSocket.Server({port: port});

  master.on('connection', function (ws) {
    debug('new connection');

    var _emitter = emitter(ws);

    // ping timesync messages (for the timesync module)
    _emitter.on('time', function (data, callback) {
      var time = now();
      callback(time);
      debug('send time ' + new Date(time).toISOString());
    });

    // send the masters config to the new connection
    var config = sanitizedConfig();
    debug('send config', config);
    _emitter.send('config', config);

    ws.emitter = _emitter; // used by broadcast
  });

  master.broadcast = function (event, data) {
    debug('broadcast', event, data);
    master.clients.forEach(function (client) {
      client.emitter.send(event, data);
    });
  };

  master.broadcastConfig = function () {
    master.broadcast('config', sanitizedConfig());
  };

  master.destroy = function() {
    master.close();
    debug('destroyed');
  };

  function sanitizedConfig() {
    var curr = config();
    delete curr.time;
    delete curr.master;
    delete curr.port;
    return curr;
  }

  debug('listening at ws://localhost:' + port);

  return master;
};

},{"../debug":40,"./WebSocket":42,"./socket-emitter":45}],44:[function(require,module,exports){
var WebSocket = require('./WebSocket');
var Promise = require('../Promise');
var debug = require('../debug')('hypertimer:slave');
var emitter = require('./socket-emitter');
var stat = require('./stat');
var util = require('./util');

// TODO: make these constants configurable
var INTERVAL = 3600000; // once an hour
var DELAY = 1000;       // delay between individual requests
var REPEAT = 5;         // number of times to request the time for determining latency

exports.createSlave = function (url) {
  var ws = new WebSocket(url);
  var slave = emitter(ws);
  var isFirst = true;
  var isDestroyed = false;
  var syncTimer = null;

  ws.onopen = function () {
    debug('connected');
    sync();
    syncTimer = setInterval(sync, INTERVAL);
  };

  slave.destroy = function () {
    isDestroyed = true;

    clearInterval(syncTimer);
    syncTimer = null;

    ws.close();

    debug('destroyed');
  };

  /**
   * Sync with the time of the master. Emits a 'change' message
   * @private
   */
  function sync() {
    // retrieve latency, then wait 1 sec
    function getLatencyAndWait() {
      var result = null;

      if (isDestroyed) {
        return Promise.resolve(result);
      }

      return getLatency(slave)
          .then(function (latency) { result = latency })  // store the retrieved latency
          .catch(function (err)    { console.log(err) })  // just log failed requests
          .then(function () { return util.wait(DELAY) })  // wait 1 sec
          .then(function () { return result});            // return the retrieved latency
    }

    return util
        .repeat(getLatencyAndWait, REPEAT)
        .then(function (all) {
          debug('latencies', all);

          // filter away failed requests
          var latencies = all.filter(function (latency) {
            return latency !== null;
          });

          // calculate the limit for outliers
          var limit = stat.median(latencies) + stat.std(latencies);

          // filter away outliers: all latencies largereq than the mean+std
          var filtered = latencies.filter(function (latency) {
            return latency < limit;
          });

          // return the mean latency
          return (filtered.length > 0) ? stat.mean(filtered) : null;
        })
        .then(function (latency) {
          if (isDestroyed) {
            return Promise.resolve(null);
          }
          else {
            return slave.request('time').then(function (timestamp) {
              var time = timestamp + latency;
              slave.emit('change', time);
              return time;
            });
          }
        })
        .catch(function (err) {
          slave.emit('error', err)
        });
  }

  /**
   * Request the time of the master and calculate the latency from the
   * roundtrip time
   * @param {{request: function}} emitter
   * @returns {Promise.<number | null>} returns the latency
   * @private
   */
  function getLatency(emitter) {
    var start = Date.now();

    return emitter.request('time')
        .then(function (timestamp) {
          var end = Date.now();
          var latency = (end - start) / 2;
          var time = timestamp + latency;

          // apply the first ever retrieved offset immediately.
          if (isFirst) {
            isFirst = false;
            emitter.emit('change', time);
          }

          return latency;
        })
  }

  return slave;
};


},{"../Promise":39,"../debug":40,"./WebSocket":42,"./socket-emitter":45,"./stat":46,"./util":47}],45:[function(require,module,exports){
// Turn a WebSocket in an event emitter.
var eventEmitter = require('event-emitter');
var Promise = require('./../Promise');
var debug = require('../debug')('hypertimer:socket');

var TIMEOUT = 60000; // ms
// TODO: make timeout a configuration setting

module.exports = function (socket) {
  var emitter = eventEmitter({
    socket: socket,
    send: send,
    request: request
  });

  /**
   * Send an event
   * @param {string} event
   * @param {*} data
   */
  function send (event, data) {
    var envelope = {
      event: event,
      data: data
    };
    debug('send', envelope);
    socket.send(JSON.stringify(envelope));
  }

  /**
   * Request an event, await a response
   * @param {string} event
   * @param {*} data
   * @return {Promise} Returns a promise which resolves with the reply
   */
  function request (event, data) {
    return new Promise(function (resolve, reject) {
      // put the data in an envelope with id
      var id = getId();
      var envelope = {
        event: event,
        id: id,
        data: data
      };

      // add the request to the list with requests in progress
      queue[id] = {
        resolve: resolve,
        reject: reject,
        timeout: setTimeout(function () {
          delete queue[id];
          reject(new Error('Timeout'));
        }, TIMEOUT)
      };

      debug('request', envelope);
      socket.send(JSON.stringify(envelope));
    }).catch(function (err) {console.log('ERROR', err)});
  }

  /**
   * Event handler, handles incoming messages
   * @param {Object} event
   */
  socket.onmessage = function (event) {
    var data = event.data;
    var envelope = JSON.parse(data);
    debug('receive', envelope);

    // match the request from the id in the response
    var request = queue[envelope.id];
    if (request) {
      // incoming response
      clearTimeout(request.timeout);
      delete queue[envelope.id];
      request.resolve(envelope.data);
    }
    else if ('id' in envelope) {
      // incoming request
      emitter.emit(envelope.event, envelope.data, function (reply) {
        var response = {
          id: envelope.id,
          data: reply
        };

        if (socket.readyState === socket.OPEN || socket.readyState === socket.CONNECTING) {
          debug('reply', response);
          socket.send(JSON.stringify(response));
        }
        else {
          debug('cancel reply', response, '(socket is closed)');
        }
      });
    }
    else {
      // regular incoming message
      emitter.emit(envelope.event, envelope.data);
    }
  };

  var queue = {};   // queue with requests in progress

  // get a unique id (simple counter)
  function getId () {
    return _id++;
  }
  var _id = 0;

  return emitter;
};

},{"../debug":40,"./../Promise":39,"event-emitter":37}],46:[function(require,module,exports){
// basic statistical functions

exports.compare = function (a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};

exports.add = function (a, b) {
  return a + b;
};

exports.sum = function (arr) {
  return arr.reduce(exports.add);
};

exports.mean = function (arr) {
  return exports.sum(arr) / arr.length;
};

exports.std = function (arr) {
  return Math.sqrt(exports.variance(arr));
};

exports.variance = function (arr) {
  if (arr.length < 2) return 0;

  var _mean = exports.mean(arr);
  return arr
          .map(function (x) {
            return Math.pow(x - _mean, 2)
          })
          .reduce(exports.add) / (arr.length - 1);
};

exports.median = function (arr) {
  if (arr.length < 2) return arr[0];

  var sorted = arr.slice().sort(exports.compare);
  if (sorted.length % 2 === 0) {
    // even
    return (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2;
  }
  else {
    // odd
    return arr[(arr.length - 1) / 2];
  }
};

},{}],47:[function(require,module,exports){
var Promise = require('../Promise');

/**
 * Resolve a promise after a delay
 * @param {number} delay    A delay in milliseconds
 * @returns {Promise} Resolves after given delay
 */
exports.wait = function(delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
};

/**
 * Repeat a given asynchronous function a number of times
 * @param {function} fn   A function returning a promise
 * @param {number} times
 * @return {Promise}
 */
exports.repeat = function (fn, times) {
  return new Promise(function (resolve, reject) {
    var count = 0;
    var results = [];

    function recurse() {
      if (count < times) {
        count++;
        fn().then(function (result) {
          results.push(result);
          recurse();
        })
      }
      else {
        resolve(results);
      }
    }

    recurse();
  });
};

/**
 * Repeat an asynchronous callback function whilst
 * @param {function} condition   A function returning true or false
 * @param {function} callback    A callback returning a Promise
 * @returns {Promise}
 */
exports.whilst = function (condition, callback) {
  return new Promise(function (resolve, reject) {
    function recurse() {
      if (condition()) {
        callback().then(function () {
          recurse()
        });
      }
      else {
        resolve();
      }
    }

    recurse();
  });
};

},{"../Promise":39}],48:[function(require,module,exports){

/* istanbul ignore else */
if (typeof Date.now === 'function') {
  /**
   * Helper function to get the current time
   * @return {number} Current time
   */
  exports.systemNow = function () {
    return Date.now();
  }
}
else {
  /**
   * Helper function to get the current time
   * @return {number} Current time
   */
  exports.systemNow = function () {
    return new Date().valueOf();
  }
}

/**
 * Shuffle an array
 *
 * + Jonas Raoni Soares Silva
 * @ http://jsfromhell.com/array/shuffle [v1.0]
 *
 * @param {Array} o   Array to be shuffled
 * @returns {Array}   Returns the shuffled array
 */
exports.shuffle = function (o){
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

},{}],49:[function(require,module,exports){
(function (process){
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = require('./common')(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

}).call(this,require('_process'))
},{"./common":50,"_process":1}],50:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":58}],51:[function(require,module,exports){
'use strict';

module.exports = require('./lib')

},{"./lib":56}],52:[function(require,module,exports){
'use strict';

var asap = require('asap/raw');

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('not a function');
  }
  this._37 = 0;
  this._12 = null;
  this._59 = [];
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._99 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
};
function handle(self, deferred) {
  while (self._37 === 3) {
    self = self._12;
  }
  if (self._37 === 0) {
    self._59.push(deferred);
    return;
  }
  asap(function() {
    var cb = self._37 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._37 === 1) {
        resolve(deferred.promise, self._12);
      } else {
        reject(deferred.promise, self._12);
      }
      return;
    }
    var ret = tryCallOne(cb, self._12);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._37 = 3;
      self._12 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._37 = 1;
  self._12 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._37 = 2;
  self._12 = newValue;
  finale(self);
}
function finale(self) {
  for (var i = 0; i < self._59.length; i++) {
    handle(self, self._59[i]);
  }
  self._59 = null;
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  })
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}

},{"asap/raw":9}],53:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this;
  self.then(null, function (err) {
    setTimeout(function () {
      throw err;
    }, 0);
  });
};

},{"./core.js":52}],54:[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js');

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._99);
  p._37 = 1;
  p._12 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._37 === 3) {
            val = val._12;
          }
          if (val._37 === 1) return res(i, val._12);
          if (val._37 === 2) reject(val._12);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

},{"./core.js":52}],55:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype['finally'] = function (f) {
  return this.then(function (value) {
    return Promise.resolve(f()).then(function () {
      return value;
    });
  }, function (err) {
    return Promise.resolve(f()).then(function () {
      throw err;
    });
  });
};

},{"./core.js":52}],56:[function(require,module,exports){
'use strict';

module.exports = require('./core.js');
require('./done.js');
require('./finally.js');
require('./es6-extensions.js');
require('./node-extensions.js');

},{"./core.js":52,"./done.js":53,"./es6-extensions.js":54,"./finally.js":55,"./node-extensions.js":57}],57:[function(require,module,exports){
'use strict';

// This file contains then/promise specific extensions that are only useful
// for node.js interop

var Promise = require('./core.js');
var asap = require('asap');

module.exports = Promise;

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  argumentCount = argumentCount || Infinity;
  return function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 0,
        argumentCount > 0 ? argumentCount : 0);
    return new Promise(function (resolve, reject) {
      args.push(function (err, res) {
        if (err) reject(err);
        else resolve(res);
      })
      var res = fn.apply(self, args);
      if (res &&
        (
          typeof res === 'object' ||
          typeof res === 'function'
        ) &&
        typeof res.then === 'function'
      ) {
        resolve(res);
      }
    })
  }
}
Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var callback =
      typeof args[args.length - 1] === 'function' ? args.pop() : null;
    var ctx = this;
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx);
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) {
          reject(ex);
        });
      } else {
        asap(function () {
          callback.call(ctx, ex);
        })
      }
    }
  }
}

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this;

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value);
    });
  }, function (err) {
    asap(function () {
      callback.call(ctx, err);
    });
  });
}

},{"./core.js":52,"asap":8}],58:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],59:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"./lib":64,"dup":51}],60:[function(require,module,exports){
'use strict';

var asap = require('asap/raw');

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('not a function');
  }
  this._45 = 0;
  this._81 = 0;
  this._65 = null;
  this._54 = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._10 = null;
Promise._97 = null;
Promise._61 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
};
function handle(self, deferred) {
  while (self._81 === 3) {
    self = self._65;
  }
  if (Promise._10) {
    Promise._10(self);
  }
  if (self._81 === 0) {
    if (self._45 === 0) {
      self._45 = 1;
      self._54 = deferred;
      return;
    }
    if (self._45 === 1) {
      self._45 = 2;
      self._54 = [self._54, deferred];
      return;
    }
    self._54.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function() {
    var cb = self._81 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._81 === 1) {
        resolve(deferred.promise, self._65);
      } else {
        reject(deferred.promise, self._65);
      }
      return;
    }
    var ret = tryCallOne(cb, self._65);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._81 = 3;
      self._65 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._81 = 1;
  self._65 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._81 = 2;
  self._65 = newValue;
  if (Promise._97) {
    Promise._97(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._45 === 1) {
    handle(self, self._54);
    self._54 = null;
  }
  if (self._45 === 2) {
    for (var i = 0; i < self._54.length; i++) {
      handle(self, self._54[i]);
    }
    self._54 = null;
  }
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  })
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}

},{"asap/raw":9}],61:[function(require,module,exports){
arguments[4][53][0].apply(exports,arguments)
},{"./core.js":60,"dup":53}],62:[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js');

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._61);
  p._81 = 1;
  p._65 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._81 === 3) {
            val = val._65;
          }
          if (val._81 === 1) return res(i, val._65);
          if (val._81 === 2) reject(val._65);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

},{"./core.js":60}],63:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"./core.js":60,"dup":55}],64:[function(require,module,exports){
'use strict';

module.exports = require('./core.js');
require('./done.js');
require('./finally.js');
require('./es6-extensions.js');
require('./node-extensions.js');
require('./synchronous.js');

},{"./core.js":60,"./done.js":61,"./es6-extensions.js":62,"./finally.js":63,"./node-extensions.js":65,"./synchronous.js":66}],65:[function(require,module,exports){
'use strict';

// This file contains then/promise specific extensions that are only useful
// for node.js interop

var Promise = require('./core.js');
var asap = require('asap');

module.exports = Promise;

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  if (
    typeof argumentCount === 'number' && argumentCount !== Infinity
  ) {
    return denodeifyWithCount(fn, argumentCount);
  } else {
    return denodeifyWithoutCount(fn);
  }
}

var callbackFn = (
  'function (err, res) {' +
  'if (err) { rj(err); } else { rs(res); }' +
  '}'
);
function denodeifyWithCount(fn, argumentCount) {
  var args = [];
  for (var i = 0; i < argumentCount; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'return new Promise(function (rs, rj) {',
    'var res = fn.call(',
    ['self'].concat(args).concat([callbackFn]).join(','),
    ');',
    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');
  return Function(['Promise', 'fn'], body)(Promise, fn);
}
function denodeifyWithoutCount(fn) {
  var fnLength = Math.max(fn.length - 1, 3);
  var args = [];
  for (var i = 0; i < fnLength; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'var args;',
    'var argLength = arguments.length;',
    'if (arguments.length > ' + fnLength + ') {',
    'args = new Array(arguments.length + 1);',
    'for (var i = 0; i < arguments.length; i++) {',
    'args[i] = arguments[i];',
    '}',
    '}',
    'return new Promise(function (rs, rj) {',
    'var cb = ' + callbackFn + ';',
    'var res;',
    'switch (argLength) {',
    args.concat(['extra']).map(function (_, index) {
      return (
        'case ' + (index) + ':' +
        'res = fn.call(' + ['self'].concat(args.slice(0, index)).concat('cb').join(',') + ');' +
        'break;'
      );
    }).join(''),
    'default:',
    'args[argLength] = cb;',
    'res = fn.apply(self, args);',
    '}',
    
    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');

  return Function(
    ['Promise', 'fn'],
    body
  )(Promise, fn);
}

Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var callback =
      typeof args[args.length - 1] === 'function' ? args.pop() : null;
    var ctx = this;
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx);
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) {
          reject(ex);
        });
      } else {
        asap(function () {
          callback.call(ctx, ex);
        })
      }
    }
  }
}

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this;

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value);
    });
  }, function (err) {
    asap(function () {
      callback.call(ctx, err);
    });
  });
}

},{"./core.js":60,"asap":8}],66:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.enableSynchronous = function () {
  Promise.prototype.isPending = function() {
    return this.getState() == 0;
  };

  Promise.prototype.isFulfilled = function() {
    return this.getState() == 1;
  };

  Promise.prototype.isRejected = function() {
    return this.getState() == 2;
  };

  Promise.prototype.getValue = function () {
    if (this._81 === 3) {
      return this._65.getValue();
    }

    if (!this.isFulfilled()) {
      throw new Error('Cannot get a value of an unfulfilled promise.');
    }

    return this._65;
  };

  Promise.prototype.getReason = function () {
    if (this._81 === 3) {
      return this._65.getReason();
    }

    if (!this.isRejected()) {
      throw new Error('Cannot get a rejection reason of a non-rejected promise.');
    }

    return this._65;
  };

  Promise.prototype.getState = function () {
    if (this._81 === 3) {
      return this._65.getState();
    }
    if (this._81 === -1 || this._81 === -2) {
      return 0;
    }

    return this._81;
  };
};

Promise.disableSynchronous = function() {
  Promise.prototype.isPending = undefined;
  Promise.prototype.isFulfilled = undefined;
  Promise.prototype.isRejected = undefined;
  Promise.prototype.getValue = undefined;
  Promise.prototype.getReason = undefined;
  Promise.prototype.getState = undefined;
};

},{"./core.js":60}],67:[function(require,module,exports){
(function (global){
'use strict';

var width = 256;// each RC4 output is 0 <= x < 256
var chunks = 6;// at least six RC4 outputs for each double
var digits = 52;// there are 52 significant digits in a double
var pool = [];// pool: entropy pool starts empty
var GLOBAL = typeof global === 'undefined' ? window : global;

//
// The following constants are related to IEEE 754 limits.
//
var startdenom = Math.pow(width, chunks),
    significance = Math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1;


var oldRandom = Math.random;

//
// seedrandom()
// This is the seedrandom function described above.
//
module.exports = function(seed, options) {
  if (options && options.global === true) {
    options.global = false;
    Math.random = module.exports(seed, options);
    options.global = true;
    return Math.random;
  }
  var use_entropy = (options && options.entropy) || false;
  var key = [];

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    use_entropy ? [seed, tostring(pool)] :
    0 in arguments ? seed : autoseed(), 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  return function() {         // Closure to return a random double:
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer Math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };
};

module.exports.resetGlobal = function () {
  Math.random = oldRandom;
};

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability discard an initial batch of values.
    // See http://www.rsa.com/rsalabs/node.asp?id=2009
  })(width);
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj)[0], prop;
  if (depth && typ == 'o') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 's' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto if available.
//
/** @param {Uint8Array=} seed */
function autoseed(seed) {
  try {
    GLOBAL.crypto.getRandomValues(seed = new Uint8Array(width));
    return tostring(seed);
  } catch (e) {
    return [+new Date, GLOBAL, GLOBAL.navigator && GLOBAL.navigator.plugins,
            GLOBAL.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call Math.random on its own again after
// initialization.
//
mixkey(Math.random(), pool);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],68:[function(require,module,exports){

exports = module.exports = function() {
	var ret = '', value;
	for (var i = 0; i < 32; i++) {
		value = exports.random() * 16 | 0;
		// Insert the hypens
		if (i > 4 && i < 21 && ! (i % 4)) {
			ret += '-';
		}
		// Add the next random character
		ret += (
			(i === 12) ? 4 : (
				(i === 16) ? (value & 3 | 8) : value
			)
		).toString(16);
	}
	return ret;
};

var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
exports.isUUID = function(uuid) {
	return uuidRegex.test(uuid);
};

exports.random = function() {
	return Math.random();
};


},{}],69:[function(require,module,exports){
'use strict';

module.exports = function() {
  throw new Error(
    'ws does not work in the browser. Browser clients must use the native ' +
      'WebSocket object'
  );
};

},{}]},{},[27])(27)
});
