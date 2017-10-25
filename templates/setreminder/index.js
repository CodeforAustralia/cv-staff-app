//TODO
// fix if-else selected attribute nonsense

// require dependencies
var html = require('choo/html')
var css = require('sheetify')

var style = css('./style.css')
var reminder = require('./reminder.js')

// export module
module.exports = function (state, emit) {
  return html`
      <div class=${style}>
        ${state.loaded ? null : fillSelected()}
        <div>
          ${generateAppointmentDetails()}
          ${generateRecipients()}
        </div>
        <div>
          ${generateMessageOptions()}
          ${generateMessage()}
          ${generatePreview()}
        </div>
      </div>
    `
    function generateMessageOptions () {
      return html`
        <div>
          <select name="appointmentType" id="appointmentType" onchange=${updatePage}>
            ${state.static.appointmentTypes.map(function (appointmentType) {
              if (appointmentType === state.selected.appointmentType)
                return html`<option value=${appointmentType} selected>${appointmentType}</option>`
              else
                return html`<option value=${appointmentType}>${appointmentType}</option>`
            })}
          </select>
          <select name="messageType" id="messageType" onchange=${updatePage}>
            ${state.static.messageTypes.map(function (messageType) {
              if (messageType === state.selected.messageType)
                return html`<option value=${messageType} selected>${messageType}</option>`
              else
                return html`<option value=${messageType}>${messageType}</option>`
            })}
          </select>
        </div>
      `
    }

    function fillSelected () {
      emit('defaultSelected')
    }

    function updatePage (e) {
      emit('updateSelected', {id: e.target.id, value: e.target.value})
    }

    function generateAppointmentDetails () {
      var location = state.selected.location ? state.selected.location : state.region.locations[0].name

      return html`
        <div>
          <div id="location">
            <h4>Location</h4>
            <select name="location" id="location" onchange=${updatePage}>
              ${state.region.locations.map(function (location) {
                  if (location.name === state.selected.location)
                    return html`<option value=${location.name} selected>${location.name}</option>`
                  else
                    return html`<option value="${location.name}">${location.name}</option>`
              })}
            </select>
          </div>
          ${state.selected.program ? html`
            <div>
              <h4>Community Work Program</h4>
              <select name="program" id="program" onchange=${updatePage}>
                ${state.region.CWprograms.map(function (program) {
                  if (program.name === state.selected.program) {
                    return html`<option value="${program.name}" id="${program.name}" selected>${program.name}</option>`
                  } else
                    return html`<option value="${program.name}" id="${program.name}">${program.name}</option>`
                })}
              </select>
            </div>` : null}
        </div>
      `
    }

    function generateRecipients () {
      var location = state.selected.location ? state.selected.location : state.region.locations[0].name
      var program = state.selected.program !== 'init' ? state.selected.program : state.region.CWprograms[0].name

      return html`
        <div id="recipientList">
          <div>
            <div>Recipients</div>
            <button onclick=${toggleRecipientListDisplay}>
              ${state.selected.showRecipients ? '-' : '+'}
            </button>
          </div>

          ${state.selected.showRecipients ? html`<div>
            ${(state.region.offenders.filter(function (offender) {
              // look at this again
              return ((offender.location === location) && (((program) && (offender.programs.includes(program))) || !program))
            })).map(function (offender) {
              return html`
                <div class="recipient">
                  <p>${offender.name}</p>
                  <p>${offender.phone}</p>
                </div>
              `
            })}
            <div id="addNewRecipient">
              <button onclick=${toggleLightbox}>+</button>
              ${state.lightbox ? html`<div class="lightbox">${addRecipientScreen()}</div>` : null }
              <h4 onclick=${toggleLightbox}>Add another person to this group</h4>
            </div>` : null}

        </div>

      `
    }

    function toggleRecipientListDisplay () {
      emit('toggleRecipientListDisplay')
    }

    function addRecipientScreen () {
      var name = state.newRecipient.name
      var phone = state.newRecipient.phone

      return html`
        <div id="addRecipientScreen">
          <h3>Add to Group</h3>
          <input type="text" id="name" value=${name} oninput=${updateInput} placeholder="name" />
          <input type="text" id="phone" value=${phone} oninput=${updateInput} placeholder="phone" />
          <div>
            <button onclick=${submitNewRecipient}>Submit</button>
            <button onclick=${close}>Close</button>
          </div>
        </div>
      `
    }

    function submitNewRecipient () {
      emit('submitNewRecipient')
    }

    function updateInput (e) {
      emit('updateInput', {id: e.target.id, text: e.target.value})
    }

    function close () {
      emit('toggleLightbox')
    }

    function toggleLightbox () {
      emit('toggleLightbox')
    }

    function generateMessage() {
      return reminder(state, emit)
    }

    function generatePreview () {
      var template = state.selected.messageType ? state.static.templates[state.selected.messageType][state.selected.appointmentType] : state.static.templates[state.static.messageTypes[0]][state.static.appointmentTypes[0]]

      return html`
        <div>
          <h4>This is the SMS you will send</h4>
          <div id="preview">
            ${template}
            ${state.selected.program ? state.selected.program + ' ' : null}
            <a target="_blank" href="https://www.google.com.au/maps/place/${state.message.address.split(' ').join('+')}">${state.message.address}</a>
            on Friday, 14 September at 9.30am until 3.00pm.
            <br />
            ${state.message.additionalInfo}
          </div>
        </div>
      `
    }
}
