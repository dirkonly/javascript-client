import { stringSource, stringDestination, encodeUTF16toUTF8 } from './utfx';

export function UTF16ToUTF8(key) {
  let sd;

  encodeUTF16toUTF8(
    stringSource(key),
    sd = stringDestination()
  );

  return sd();
}

/*!
 * +----------------------------------------------------------------------------------+
 * | murmurHash3.js v3.0.0 (http://github.com/karanlyons/murmurHash3.js)              |
 * | A TypeScript/JavaScript implementation of MurmurHash3's hashing algorithms.      |
 * |----------------------------------------------------------------------------------|
 * | Copyright (c) 2012-2020 Karan Lyons. Freely distributable under the MIT license. |
 * +----------------------------------------------------------------------------------+
 */

export function x86Multiply(m, n) {
  //
  // Given two 32bit ints, returns the two multiplied together as a
  // 32bit int.
  //

  return ((m & 0xffff) * n) + ((((m >>> 16) * n) & 0xffff) << 16);
}


export function x86Rotl(m, n) {
  //
  // Given a 32bit int and an int representing a number of bit positions,
  // returns the 32bit int rotated left by that number of positions.
  //

  return (m << n) | (m >>> (32 - n));
}

export function x86Fmix(h) {
  //
  // Given a block, returns murmurHash3's final x86 mix of that block.
  //

  h ^= h >>> 16;
  h = x86Multiply(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = x86Multiply(h, 0xc2b2ae35);
  h ^= h >>> 16;

  return h;
}
