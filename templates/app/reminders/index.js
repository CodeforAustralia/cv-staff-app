// require dependencies
var html = require('choo/html')
var css = require('sheetify')
var moment = require('moment')

// import templates
var api = require('../../../lib/api')
var base = require('../base')
var style = css('./style.css')

// export module
module.exports = function (state, emit) {
  return base(reminders, 'Reminders')

  function reminders () {
    var newMessage = state.client.newMessage

    return html`
      <content class=${style} onload=${state.client.status ? null : queryAPI()}>
        ${displayMessages()}
        <div class="input">
          <input placeholder="Message ... " type="text" id="newMessage" value=${newMessage} oninput=${update} />
          <div onclick=${sendNewMessage}> + </div>
        </div>
      </content>`
  }

  function sendNewMessage () {
    api.sendMessage({JAID: state.client.user.JAID, to: state.client.user.locationNumber, from: state.client.user.phone, content: state.client.newMessage}, function () {
      queryAPI()
      emit('clearNewMessage')
    })
  }

  function update (e) {
    var text = e.target.value
    emit('updateNewMessage', {text: text})
  }

  // pull message data from the API
  function queryAPI () {
    api.getMessages({JAID: state.client.user.JAID}, function (data) {
      setTimeout(function () { document.getElementById('newMessage').scrollIntoView() }, 10)
      emit('updateContent', data)
    })
  }

  function displayMessages () {
    return state.client.messages.map(function (message, index) {
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
          <button id="OK" onclick=${sendResponse}>OK</button>
          <button id="Reschedule" onclick=${sendResponse}>Reschedule</button>
        </div>
      `
  }

  function sendResponse (e) {
    api.sendMessage({JAID: state.client.user.JAID, to: state.client.user.locationNumber, from: state.client.user.phone, content: e.target.id}, function () {
      queryAPI()
    })
  }

  function displayTime (message, index) {
    var myDate = moment(message.receivedOrSentDate)
    var today = moment()

    var newDayDisplay = true

    var timeToDisplay = ''
    var timeDisplayString = 'h:mm a'

    if (index !== 0) {
      var prevMsgDate = moment(state.client.messages[index - 1].receivedOrSentDate)

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
