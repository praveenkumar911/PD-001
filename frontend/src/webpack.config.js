const path = require('path');

module.exports = {
  // ... other webpack configuration options ...
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      timers: require.resolve('timers-browserify')
    }
  }
};
