module.exports = {
  "plugins": [
    "transform-decorators-legacy",
    "transform-class-properties"
  ],
  "presets": [
    [
      "env", {
        "targets": process.env.BABEL_TARGET === 'node' ? {
          "node": ["7.8.0"]
        } : {
          "browsers": [
            "last 2 versions",
            "not ie <= 10"
          ],
          "uglify": process.env.NODE_ENV === 'production',
        },
        "loose": true,
        "modules": process.env.BABEL_TARGET === 'node' ? 'commonjs' : false,
        // "whitelist": [
        //   "transform-es2015-literals",
        //   "transform-es2015-template-literals"
        // ],
        "useBuiltIns": true
      }
    ]
  ]
}
