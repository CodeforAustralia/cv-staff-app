// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../navbar/admin.js')
var hoverInfo = require('../hoverInfo')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      #content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin: auto;
        margin-bottom: 6rem;
        margin-top: 6rem;
        max-width: 1100px;
        #content-left {
          width: 55%;
          h3 { color: #000; }
          span {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
          }
          table {
            border: 1px #e5e5e5 solid;
            border-collapse: collapse;
            td {
              border-bottom: 1px #e5e5e5 solid;
              padding: 1rem;
              div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                #loadMessages {
                  color: #498fe1;
                  cursor: pointer;
                }
              }
            }
          }
        }
        #content-right {
          margin-top: 3rem;
          width: 45%;
          #messages {
            background-color: #e5e5e5;
          }
        }
      }
    }
  `

  var list = [{
    name: 'Blake Hemmings',
    phone: '0411 123 333',
    JAID: '12345678'
  }, {
    name: 'Vanessa Marshall',
    phone: '0411 123 333',
    JAID: '12345678'
  }, {
    name: 'Julian Forsyth',
    phone: '0411 123 333',
    JAID: '12345678'
  }]

  var displayMessages = state.ccs.ui.clientList.displayMessages

  return html`
    <div class=${style}>
      ${navbar(state.ccs.user.name, state.ccs.ui.manageUsers.newRequests.length)}
      <div id="content">
        <div id="content-left">
          <h3>Your client list</h3>
          <span>
            These are the clients you are currently assigned to in eJustice.
            ${hoverInfo('Does this list seem incomplete? Please update your client list in eJustice')}
          </span>
          ${printClientList()}
        </div>
        <div id="content-right">
          ${displayMessages ? showMessages() : null}
        </div>
      </div>
    </div>
  `

  function toggleMessageDisplay () {
    emit('toggleMessageDisplay')
  }

  function showMessages () {
    return html`
      <div id="messages">
        <h3>Message History</h3>
      </div>
    `
  }

  function printClientList () {
    return html`
      <table>
        ${list.map(function (el) {
          return html`
            <tr>
              <td><img src="../../../assets/blank-avatar.png" /></td>
              <td>
                <div>
                  <span>${el.name}</span>
                  <span id="loadMessages" onclick=${toggleMessageDisplay}>View message history</span>
                </div>
              </td>
              <td>
                <div>
                  <span>${el.phone}</span>
                  <span>JAID${el.JAID}</span>
                </div>
              </td>
            </tr>
          `
        })}
      </table>
    `
  }
}
