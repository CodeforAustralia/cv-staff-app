// require dependencies
var html = require('choo/html')
var css = require('sheetify')
var moment = require('moment')

// require modules
var navbar = require('../navbar/admin.js')
var hoverInfo = require('../hoverInfo')
var messageStyle = css('./messageStyle')

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
    name: 'Johnny Test',
    phone: '0411 123 333',
    JAID: 111
  }, {
    name: 'Jake Black',
    phone: '0411 123 333',
    JAID: 222
  }, {
    name: 'Sam Iam',
    phone: '0411 123 333',
    JAID: 333
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

  function getMessages (e) {
    emit('getMessages', e.target.id)
  }

  function showMessages () {
    return state.ccs.ui.clientList.messages.map(function (message, index) {
      return html`
      <div>
        <div class="${message.direction}">
          ${displayTime(message, index)}
          <div class="message">
            ${message.content}
            ${message.response ? displayResponse() : null}
          </div>
        </div>
      </div>`
    })
  }

  // display possible responses to inbound message
  function displayResponse () {
    return html`
      <div>
        <button id="OK">OK</button>
        <button id="Reschedule">Reschedule</button>
      </div>
    `
  }

  function fetchMessages () {
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
                  <span class="loadMessages" id="${el.JAID}" onclick=${getMessages}>View message history</span>
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

  function displayTime (message, index) {
    var myDate = moment(message.receivedOrSentDate)
    var today = moment()

    var newDayDisplay = true

    var timeToDisplay = ''
    var timeDisplayString = 'h:mm a'

    if (index !== 0) {
      var prevMsgDate = moment(state.ccs.ui.clientList.messages[index - 1].receivedOrSentDate)

      if (prevMsgDate.format() === myDate.format()) {
        newDayDisplay = false
      }
    }

    // if message was sent on a different day, display date in full
    if (newDayDisplay) {
      if (myDate.format() === today.format()) {
        timeToDisplay = 'Today, '
      } else {
        timeDisplayString = 'ddd D MMM, h:mm a'
      }

      return html`<p class="newDate">${timeToDisplay} ${moment(myDate).format(timeDisplayString)}</p>`
    } else {
      timeToDisplay = 'Sent '

      if (message.messageType === 'SMS') {
        timeToDisplay += 'via SMS at '
      }

      return html`<p>${timeToDisplay} ${moment(myDate).format(timeDisplayString)}</p>`
    }
  }
}
