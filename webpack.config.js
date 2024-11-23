module.exports = {
    resolve: {
      fallback: {
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        // Thêm các module khác nếu cần
      }
    },
    // Các cấu hình Webpack khác của bạn...
  };
  