// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../navbar')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      #content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin: auto;
        max-width: 1100px;
        input {
          margin: 1rem;
          width: 15%;
        }
        * {
          align-self: center;
        }
        #error {
          background-color: #d7d7d7;
          font-size: 0.8rem;
          margin-top: 1rem;
          padding: 1rem 0.5rem;
          text-align: center;
        }
      }
    }
  `

  var username = state.ccs.ui.logIn.username
  var password = state.ccs.ui.logIn.password
  var error = state.ccs.ui.logIn.error

  return html`
    <div class=${style}>
      ${navbar()}
      <div id="content">
        <h1>Log In</h1>
        <input type="text" id="username" value=${username} placeholder="username" oninput=${updateInput} required />
        <input type="password" id="password" value=${password} placeholder="password" oninput=${updateInput} required />
        <button class="blue-button" onclick=${logIn}>Submit</button>
        ${error ? displayError() : null}
      </div>
    </div>
  `
  function displayError() {
    return html`
      <div id="error">
        ${error}
      </div>
    `
  }

  function updateInput (e) {
    emit('updateInput', {user: 'ccs', template: 'logIn', target: e.target.id, text: e.target.value})
  }

  function logIn () {
    emit('logIn')
  }
}
