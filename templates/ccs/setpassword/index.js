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

  var password1 = state.ccs.ui.setPassword.password1
  var password2 = state.ccs.ui.setPassword.password2
  var error = state.ccs.ui.setPassword.error

  return html`
    <div class=${style}>
      ${navbar(state.ccs.user.name, state.ccs.ui.manageUsers.newRequests.length)}
      <section id="content">
        <h1>Log In</h1>
        <label>Input your password</label>
        <input type="password" id="password1" value=${password1} oninput=${updateInput} required />
        <label>Confirm password</label>
        <input type="password" id="password2" value=${password2} oninput=${updateInput} required />
        <button class="blue-button" onclick=${setPassword}>Submit</button>
        ${error ? displayError() : null}
      </section>
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
    emit('updateInput', {user: 'ccs', template: 'setPassword', target: e.target.id, text: e.target.value})
  }

  function setPassword () {
    if (password1 !== password2) {
      emit('updateError', {template: 'setPassword', error: `These passwords don't match`})
    }
    // emit event here to set password
  }
}
