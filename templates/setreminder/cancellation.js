// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// export module
module.exports = function (state, emit) {
  var location = state.selected.location ? state.selected.location : state.region.locations[0].name
  var selectedProgram = state.selected.program === 'init' ? state.region.CWprograms[0] : state.region.CWprograms.filter(function (obj) {
    return obj.name === state.selected.program
  })[0]
  var appointmentType = state.selected.appointmentType ? state.selected.appointmentType : state.static.appointmentTypes[0]
  var template = state.selected.appointmentType ? state.static.templates['Cancellation'][state.selected.appointmentType] : state.static.templates['Cancellation'][state.static.appointmentTypes[0]]
  return html`
    <div id="messageContent">
      <h3>${appointmentType} Reminder</h3>

      ${template}
      ${state.selected.program ? html`
        <div>
          <h4>Work program</h4>
          <p>
            <select name="reminder program" id="program" onchange=${updatePage}>
              ${state.region.CWprograms.map(function (program) {
                if (program.name === state.selected.program)
                  return html`<option value="${program.name}" selected>${program.name}</option>`
                else
                  return html`<option value="${program.name}">${program.name}</option>`
              })}
            </select>
          </p>
        </div>
      ` : null}

      <h4>Location</h4>
      <input type="text" id="address" value="${state.message.address}" oninput=${updateMessage} disabled />
      <span onclick=${editAddress}>Edit</span>

      <p>on</p>

      <div id="reminderdate">
        <div>
          Date
          <select name="day">
            <option value="Friday 14 Sept">Friday 14 Sept</option>
            <option value="Friday 21 Sept">Friday 21 Sept</option>
          </select>
        </div>
        <div>
          Start time
          <select name="start time">
            <option value="9.30am">9.30am</option>
            <option value="10.00am">10.00am</option>
          </select>
        </div>
        <div>
          End time
          <select name="end time">
            <option value="3.00pm">3.00pm</option>
            <option value="3.30pm">3.30pm</option>
          </select>
        </div>
      </div>

      <p> has been cancelled. Please do not attend until further notice.</p>

      <h4>Additional Information</h4>
      <textarea type="text" id="additionalInfo" oninput=${updateMessage} placeholder="${state.message.additionalInfo}" disabled>
        ${state.message.additionalInfo}
      </textarea>
      <span onclick=${editInfo}>Edit</span>

      <button>Schedule SMS</button>
    </div>
  `

  function editInfo () {
    document.querySelector('#additionalInfo').disabled = false
    document.querySelector('#additionalInfo').focus()
  }

  function editAddress () {
    document.querySelector('#address').disabled = false
    document.querySelector('#address').focus()
  }

  function updateMessage(e) {
    emit('updateMessage', {id: e.target.id, text: e.target.value})
  }

  function updatePage (e) {
    emit('updateSelected', {id: e.target.id, value: e.target.value})
  }
}
