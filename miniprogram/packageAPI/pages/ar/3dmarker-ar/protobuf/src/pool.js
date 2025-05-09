module.exports = pool

/**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */

/**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */

/**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */
function pool(alloc, slice, size) {
  const SIZE = size || 8192
  const MAX = SIZE >>> 1
  let slab = null
  let offset = SIZE
  return function pool_alloc(size) {
    if (size < 1 || size > MAX) return alloc(size)
    if (offset + size > SIZE) {
      slab = alloc(SIZE)
      offset = 0
    }
    const buf = slice.call(slab, offset, offset += size)
    if (offset & 7) // align to 32 bit
    { offset = (offset | 7) + 1 }
    return buf
  }
}
