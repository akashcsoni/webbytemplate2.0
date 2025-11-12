module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          minifyFontValues: true,
          minifySelectors: true,
          reduceIdents: false,
          zindex: false, // Keep z-index values
          reduceTransforms: true,
          convertValues: true,
          // More aggressive optimization
          colormin: true,
          discardDuplicates: true,
          discardEmpty: true,
          discardOverridden: true,
          mergeRules: true,
        }],
      },
    } : {}),
  },
}
