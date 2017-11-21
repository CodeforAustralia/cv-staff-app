// require dependencies
var html = require('choo/html')
var css = require('sheetify')
var moment = require('moment')

var style = css('./style.css')

module.exports = function (user, state, emit) {
  if (user === 'client') {
    var messages = state.client.ui.reminders.messages
    var newMessage = state.client.ui.reminders.newMessage
    var JAID = state.client.JAID
    var fromPhone = state.client.phone
    var toPhone = state.client.locationNumber
  } else if (user === 'ccs') {
    var messages = state.ccs.ui.clientList.messages
    var newMessage = state.ccs.ui.clientList.newMessage
    var JAID = state.ccs.ui.clientList.clients[state.ccs.ui.clientList.displayMessages].JAID
    var fromPhone = state.ccs.user.dedicatedNumber
    var toPhone = state.ccs.ui.clientList.clients[state.ccs.ui.clientList.displayMessages].phone
  }

  return html`
    <div>
      <div id="messageContainer">
        ${messages.map(function (message, index) {
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
      <input placeholder="Message ... " type="text" id="newMessage" value=${newMessage} oninput=${update} />
      <button class="white-button" onclick=${sendMessage}>Send</button>
    </div>
  `

  function sendMessage (e, content) {
    emit('sendSMS', {messageData: {
      JAID: JAID,
      to: fromPhone,
      from: toPhone,
      content: content ? content : newMessage
    }, user: 'client'})
  }

  function update (e) {
    if (user === 'client') {
      emit('updateInput', {
        user: 'client',
        template: 'reminders',
        target: 'newMessage',
        text: e.target.value
      })
    }
  }

  // display possible responses to inbound message
  function displayResponse () {
    return html`
      <div>
        <button id="OK" onclick=${sendResponse}>OK</button>
        <button id="Reschedule" onclick=${sendResponse}>Reschedule</button>
      </div>
    `
  }

  function sendResponse (e) {
    sendMessage(e, e.target.id)
  }

  function displayTime (message, index) {
    var myDate = moment(message.receivedOrSentDate)
    var today = moment()

    var newDayDisplay = true

    var timeToDisplay = ''
    var timeDisplayString = 'h:mm a'

    if (index !== 0) {
      var prevMsgDate = moment(messages[index - 1].receivedOrSentDate)

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
