// require dependencies
var html = require('choo/html')
var css = require('sheetify')
var progressBar = require('progressbar.js')

// require modules
var countdown = require('./countdown.js')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin: auto;
      max-width: 700px;
      h2 { text-align: center; }
      #nav {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-bottom: 1rem;
        .tab {
          background-color: #fff;
          border: none;
          border-radius: 0;
          border-bottom: 5px solid #00a1f1;
        }
        .tab:focus {
          outline: 0;
        }
        .inactive {
          border-bottom: 2px solid #616069;
        }
        .inactive:hover {
          color: #00a1f1;
          border-bottom: 2px solid #00a1f1;
        }
      }
    }
  `

  var active = state.client.ui.cwhours.active

  return html`
    <container class=${style}>
        <h2>Community Work Hours Remaining</h2>
        <div id="nav">
          <button onclick=${toggleTab} id="countdown" class="tab ${active === 'countdown' ? '' : 'inactive'}">Countdown</button>
          <button onclick=${toggleTab} id="sessions" class="tab ${active === 'sessions' ? '': 'inactive'}">Sessions Completed</button>
        </div>
        ${active === 'countdown' ? countdown(.43) : null}
    </container>
  `

  function toggleTab (e) {
    if (e.target.id !== active)
      emit('updateActiveTab', {template: 'cwhours', value: e.target.id})
  }
}
