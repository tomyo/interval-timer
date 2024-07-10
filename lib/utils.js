/**
 *
 * @param {Boolean} condition
 * @param {String} message
 * @throws {Error} if `condition` is false with given `message` or "Assertion failed"
 */
export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

/**
 * @param {Function} fun
 * @param {Number} delay in milliseconds
 * @returns {Function} A debounced function that will run `fun` after it was called `delay` ago.
 */
export function debounce(fun, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fun(...args), delay);
  };
}

/**
 * @param {Function} fun
 * @param {Number} delay in milliseconds
 * @returns {Function} A throttled function that will run `fun` at most once every `delay` milliseconds.
 */
export function throttle(fun, delay) {
  let last = 0;
  return (...args) => {
    let now = new Date().getTime();
    if (now - last < delay) return;
    last = now;
    fun(...args);
  };
}
