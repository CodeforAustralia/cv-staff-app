// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../../navbar/admin.js')

// export module
module.exports = function (state, emit) {
  return html`
    <div>
      ${navbar(state.user.name)}
    </div>
  `
}
