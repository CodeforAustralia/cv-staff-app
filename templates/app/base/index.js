// require dependencies
var html = require('choo/html')

// import templates
var nav = require('../nav')

// base wrapper templates
module.exports = function (child, title) {
  return html`
    <container>
      ${nav(title)}
      ${child()}
    </container>
  `
}
