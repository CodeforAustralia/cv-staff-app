// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// import templates
var api = require('../../../lib/api')
var base = require('../base')
var messageHistory = require('../../messageHistory')

// export module
module.exports = function (state, emit) {
  return base(reminders, 'Reminders')

  function reminders () {
    var newMessage = state.client.newMessage
    var scrolled = false

    return html`
      <content>
        ${state.client.ui.reminders.loaded ? null : queryAPI()}
        ${messageHistory('client', state, emit)}
        ${scrolled ? null : scroll()}
      </content>`
  }

  function scroll () {
    setTimeout(function () {
      myDiv = document.getElementById('messageContainer')
      if (myDiv !== null) {
        window.scrollTo(0, myDiv.scrollHeight)
      }
      scrolled = true
    }, 200)
  }

  // pull message data from the API
  function queryAPI () {
    api.getMessages({JAID: state.client.user.JAID}, function (data) {
      emit('updateContent', data)
    })
  }
}
