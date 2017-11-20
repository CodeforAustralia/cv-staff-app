// require dependencies
var html = require('choo/html')
var css = require('sheetify')
var moment = require('moment')

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
          .action {
            h2 { margin: 0.5rem }
            p { margin: 0 0.5rem; }
          }
        }
        #content-right {
          margin-top: 5rem;
          width: 45%;
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
                a, a:visited {
                  color: #498fe1;
                  text-decoration: none;
                }
              }
            }
          }
        }
      }
    }
  `

  var actions = [{
    heading: 'Send a reminder to a client now',
    text: 'Send a message to a client straight away',
    button: 'Send reminder'
  }, {
    heading: 'Schedule a reminder to be sent later',
    text: 'Write and set the time for a reminder to go out to a client automatically.',
    button: 'Schedule reminder'
  }, {
    heading: 'Send the same reminder to a group of clients',
    text: 'If you are managing community work or other program reminders use this option.',
    button: 'Send group reminders'
  }, {
    heading: 'Check on community work hours for a client',
    text: 'See how many hours a client has left for community work.',
    button: 'Check CW hours'
  }]

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

  return html`
    <div class=${style}>
      ${navbar(state.ccs.user.name, state.ccs.ui.manageUsers.newRequests.length)}
      <div id="content">
        <div id="content-left">
          ${printGreeting()}
          ${actions.map(function (el) {
            return printAction(el)
          })}
        </div>
        <div id="content-right">
          <h3>Your client list</h3>
          <span>
            These are the clients you are currently assigned to in eJustice.
            ${hoverInfo('Does this list seem incomplete? Please update your client list in eJustice')}
          </span>
          ${printClientList()}
        </div>
      </div>
    </div>
  `

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
                  <span><a href="#">View client's profile</a></span>
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

  function printAction (data) {
    return html`
      <div class="action">
        <h2>${data.heading}</h2>
        <p>${data.text}</p>
        <button class="blue-button">${data.button}</button>
      </div>
    `
  }

  function printGreeting () {
    var greeting = ''
    var currHour = moment().format('k')
    if (currHour >= 6 && currHour < 12) {
      greeting = 'Good morning'
    } else if (currHour >= 12 && currHour < 18) {
      greeting = 'Good afternoon'
    } else {
      greeting = 'Good evening'
    }

    return html`<h1>${`${greeting} <Insert actual username here>`}</h1>`
  }
}
