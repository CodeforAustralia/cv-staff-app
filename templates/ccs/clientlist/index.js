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
  var message = state.ccs.ui.clientList.message

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
          ${displayMessages !== null ? showMessages() : null}
        </div>
      </div>
    </div>
  `

  function getMessages (e) {
    emit('getMessages', e.target.id.slice(7))
    setTimeout(function () {
      myDiv = document.getElementById('messageContainer')
      if (myDiv !== null) {
        myDiv.scrollTop = 99999999999
        emit('render')
      }
    }, 300)
  }

  function showMessages () {
    return html`
      <div>
        <div id="messageContainer">
          ${state.ccs.ui.clientList.messages.map(function (message, index) {
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
          })}
        </div>
        <input placeholder="Message ... " type="text" id="message" value=${message} oninput=${update} />
        <button class="white-button" onclick=${sendMessage}>Send</button>
      </div>
    `
  }

  function sendMessage () {
    var client = state.ccs.ui.clientList.clients[displayMessages]
    emit('sendSMS', {messageData: {
      JAID: client.JAID,
      to: client.phone,
      from: state.ccs.user.dedicatedNumber,
      content: message
    }, template: 'clientList'})
  }

  function update (e) {
    emit('updateInput', {template: 'clientList', target: 'message', text: e.target.value})
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
