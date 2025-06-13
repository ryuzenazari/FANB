/**
 * Wrapper untuk menangani async function di Express
 * Digunakan untuk menghindari try-catch di setiap controller
 * @param {Function} fn - Async function yang akan di-wrap
 * @returns {Function} Express middleware dengan error handling
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler; 