// require dependencies
var html = require('choo/html')
var css = require('sheetify')
var moment = require('moment')

// require modules
var navbar = require('../navbar/admin.js')
var hoverInfo = require('../hoverInfo')
var messageHistory = require('../../messageHistory')

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
                .loadMessages {
                  color: #498fe1;
                  cursor: pointer;
                }
              }
            }
          }
        }
        #content-right { width: 45%; }
        #messageContainer {
          background-color: #f8f8f8;
          max-height: 35rem;
          overflow: auto;
        }
      }
    }
  `

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
          <button class="blue-button" onclick=${search}>Add a client</button>
        </div>
        <div id="content-right">
          ${displayMessages !== null ? messageHistory('ccs', state, emit) : null}
        </div>
      </div>
    </div>
  `

  function search () {
    emit('clearState')
    emit('pushState', '/ccs/search')
  }

  function getMessages (e) {
    emit('getMessages', {client: e.target.id.slice(7)})
    setTimeout(function () {
      myDiv = document.getElementById('messageContainer')
      if (myDiv !== null) {
        myDiv.scrollTop = 99999999999
        emit('render')
      }
    }, 300)
  }

  function printClientList () {
    return html`
      <table>
        ${state.ccs.ui.clientList.clients.map(function (el, index) {
          return html`
            <tr>
              <td><img src="../../../assets/blank-avatar.png" /></td>
              <td>
                <div>
                  <span>${el.name}</span>
                  <span class="loadMessages" id="client-${index}" onclick=${getMessages}>View message history</span>
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
