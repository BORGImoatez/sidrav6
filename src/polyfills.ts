/**
 * Polyfills pour l'application
 */

// Polyfill pour 'global' utilisé par certaines bibliothèques Node.js
// Fix for "global is not defined" error
(window as any).global = window;

// Fix for other Node.js environment variables that might be referenced
(window as any).process = {
  env: { DEBUG: undefined },
  nextTick: function(fn: Function) {
    setTimeout(fn, 0);
  }
};

// Fix for Buffer which might be used by some libraries
(window as any).Buffer = (window as any).Buffer || require('buffer').Buffer;
