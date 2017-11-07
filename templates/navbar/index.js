// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// import templates
var style = css('./style.css')

module.exports = function () {
  return html`
    <div id="navbar" class=${style}>
      <div id="logo">
        <img src="../../assets/logo.png" />
        <p>for CCS staff</p>
      </div>
      <div id="navbar-right">
        <div id="help">
          Help
        </div>
        <div class="button">
          Log in
        </div>
      </div>
    </div>
  `
}
