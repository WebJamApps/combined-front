// this file will be used by default by babel@7 once it is released
module.exports = (api) => {

  api.cache(true);

  return {
    "plugins": [
      ["@babel/proposal-decorators", { "legacy": true }],
      ["@babel/proposal-class-properties", { "loose" : true }]
    ],
    "presets": [
      [
        "@babel/react"
      ],
      [
        "@babel/env", {
        "targets": process.env.BABEL_TARGET === 'node' ? {
          "node": process.env.IN_PROTRACTOR ? '6' : 'current'
        } : {
          "browsers": [
            "last 2 versions",
            "not ie <= 11"
          ]
        },
        "loose": true,
        "modules": process.env.BABEL_TARGET === 'node' ? 'commonjs' : false,
        "useBuiltIns": false
      }
      ]
    ]
  }
};
