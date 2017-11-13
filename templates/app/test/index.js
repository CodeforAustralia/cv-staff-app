// require dependencies
var html = require('choo')
var css = require('sheetify')

// import templates
var api = require('../../../lib/testAPI')
var base = require('../base')

module.exports = function (state, emit) {
  return base(test, 'Test an SMS')

  function test () {
    var to = state.client.to
    var from = state.client.from
    var message = state.client.testMessage
    var sent = state.client.sent

    var style = css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }
      :host > input {
        margin: 0.25rem;
        width: 12rem;
        align-self: flex-start;
      }

      :host > input[type="textarea"] {
        height: 6rem;
      }

      :host > button {
        width: 6rem;
        margin: 0.5rem 0;
      }
    `
    return html`
      <div class=${style}>
      <input type="text" id="to" placeholder="to ..." value=${to} oninput=${update} />
      <input type="text" id="from" placeholder="from ..." value=${from} oninput=${update} />
      <textarea id="testMessage" placeholder="message ..." value=${message} cols="40" rows="5" oninput=${update}></textarea>
      ${sent ? html`<div>Sent!</div>` : html`<button onclick=${sendSMS}>Send</button>`}
    </div>`

    function sendSMS () {
      emit('sendSMS')
      api({to: state.client.to, from: state.client.from, newMessage: state.client.testMessage}, function () {
      })
    }

    function update (e) {
      var id = e.target.id
      var text = e.target.value

      emit('updateNewSMS', {id: id, text: text})
    }
  }
}
