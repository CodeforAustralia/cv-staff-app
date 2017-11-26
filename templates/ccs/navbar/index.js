// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// import templates
var style = css('./style.css')

module.exports = function () {
  return html`
    <div id="navbar" class=${style}>
      <a id="logo" href="/ccs">
        <img src="../../assets/logo.png" />
        <p>for CCS staff</p>
      </a>
      <div id="navbar-right">
        <div id="help">
          Help
        </div>
        <a href="/ccs/login">
          <button class="blue-button">
            Log in
          </button>
        </a>
      </div>
    </div>
  `

  function logIn () {
    emit('pushState', '/ccs/login')
  }
}
