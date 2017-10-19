//TODO
// fix if-else selected attribute nonsense

// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      display: flex;
      flex-direction: row;
      font-family: Helvetica;
      justify-content: center;
      margin: auto;
      max-width: 900px;
    }

    :host > div > div {
      margin: 0.5rem;
    }

    :host > div:first-child {
      width: 35%;
    }

    :host > div:nth-child(2) {
      width: 65%;
    }

    :host > div:nth-child(2) > div:first-child {
      background-color: #f4f4f4;
      padding: 0.5rem;
    }

    :host > div:nth-child(2) > div:first-child > select {
      background-color: #fff;
    }

    :host > div:first-child > div:first-child {
      padding: 3rem 0.5rem 1rem 0.5rem;
    }

    :host > div:first-child > div:first-child > div > select {
      width: 100%;
    }

    h4 {
      color: #6f6e75;
      font-size: 0.75rem;
      margin: 1rem 0;
    }

    select {
      border: none;
      border-radius: 10px;
      height: 2rem;
      margin-right: 2rem;
      max-width: 95%;
      -moz-border-radius: 6px;
      -webkit-border-radius: 6px;
    }

    #recipientList > div:first-child {
      background-color: #f4f4f4;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0.5rem;
    }

    button {
      background: none;
      border: 1px #6f6e75 solid;
      border-radius: 3px;
      box-shadow: none;
      height: 1.5rem;
    }

    .lightbox {
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      height: 100vh;
      justify-content: center;
      left: 0;
      position: fixed;
      top: 0;
      width: 100vw;
    }

    #addRecipientScreen {
      align-items: center;
      background: #f5f5f5;
      border-radius: 2px;
      color: #ff3b3f;
      display: flex;
      flex-direction: column;
      font-size: 20px;
      padding: 2rem;
    }

    #addRecipientScreen > input {
      margin-bottom: 1rem;
    }

    #addRecipientScreen > div {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    #addRecipientScreen > div > button {
      background: #fff;
      height: 2rem;
      margin: 0rem 0.5rem;
    }

    .recipient {
      border: 1px #f4f4f4 solid;
      border-radius: 3px;
      padding: 0.5rem;
    }

    .recipient > p {
      margin: 0.3rem;
    }

    .recipient > p:nth-child(2) {
      color: #6f6e75;
    }

    #addNewRecipient {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    #addNewRecipient > button {
      color: #6f6e75;
      margin: .5rem 1rem 0 0;
    }

    h3 {
      color: #6f6e75;
      margin: 1rem 0;
    }
  `

  return html`
      <div class=${style}>
        <div onload=${fillSelected}>
          ${generateAppointmentDetails()}
          ${generateRecipients()}
        </div>
        <div>
          ${generateMessageOptions()}
          ${generateMessage()}
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
      var location = state.selected.location ? state.selected.location : state.region.locations[0]

      return html`
        <div>
          <div id="location">
            <h4>Location</h4>
            <select name="location" id="location" onchange=${updatePage}>
              ${state.region.locations.map(function (location) {
                  if (location === state.selected.location)
                    return html`<option value=${location} selected>${location}</option>`
                  else
                    return html`<option value="${location}">${location}</option>`
              })}
            </select>
          </div>
          ${state.selected.program ? html`
            <div>
              <h4>Community Work Program</h4>
              <select name="program" id="program" onchange=${updatePage}>
                ${state.region.CWprograms[location].map(function (program) {
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
      var location = state.selected.location ? state.selected.location : state.region.locations[0]
      var program = state.selected.program !== 'init' ? state.selected.program : state.region.CWprograms[location][0].name

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
      var location = state.selected.location ? state.selected.location : state.region.locations[0]
      var selectedProgram = state.selected.program === 'init' ? state.region.CWprograms[location][0] : state.region.CWprograms[location].filter(function (obj) {
        return obj.name === state.selected.program
      })[0]

      return html`
        <div>
          <h3>Community Work Reminder</h3>
          ${state.static.templates[state.selected.messageType]}
          <h6>Work program</h6>
          <p>
            <select name="reminder program" id="program" onchange=${updatePage}>
            ${state.region.CWprograms[location].map(function (program) {
              if (program.name === state.selected.program)
                return html`<option value="${program.name}" selected>${program.name}</option>`
              else
                return html`<option value="${program.name}">${program.name}</option>`
            })}
            </select>
          </p>

          <h6>Location</h6>
          <p>${selectedProgram ? selectedProgram.address : null} <a href="#">Edit</a></p>

          on

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

          <h6>Additional Information</h6>
          ${selectedProgram ? selectedProgram.info : null} <br />
          ${state.static.rescheduleText} <a href="#">Edit</a>
        </div>
      `
    }

    // <div class=${style}>
    //   <div>
    //     <div>
    //       Location
    //       <select name="location">
    //         <option value="Ballarat">Ballarat</option>
    //         <option value="Horsham">Horsham</option>
    //         <option value="Ararat">Ararat</option>
    //       </select>
    //       Community Work Program
    //       <select name="program">
    //         <option value="St Vincent De Paul Friday">St Vincent De Paul Friday InHouse Program</option>
    //       </select>
    //     </div>
    //     <div>
    //       <div class="recipients">
    //         <div>Recipients</div>
    //         <button>+</button>
    //       </div>
    //       <div class="recipient">
    //         Amin Min
    //         04xx xxx xxx
    //       </div>
    //       <div class="recipient">
    //         Bob Marley
    //         04xx xxx xxx
    //       </div>
    //       <div class="recipient">
    //         Craig Rees
    //         04xx xxx xxx
    //       </div>
    //     </div>
    //   </div>
    //   <div>
    //     <div>
    //       <select name="appointment">
    //         <option value="Community Work">Community Work</option>
    //         <option value="Supervision">Supervision</option>
    //       </select>
    //       <select name="message">
    //         <option value="Reminder">Reminder</option>
    //       </select>
    //     </div>
    //     <div>
    //       <h3>Community Work Reminder</h3>
    //       You are required to attend work at
    //       <h6>Work program</h6>
    //       <p>
    //         <select name="reminder program">
    //           <option value="St Vincent De Paul Friday InHouse Program">St Vincent De Paul Friday InHouse Program</option>
    //         </select>
    //       </p>
    //
    //       <h6>Location</h6>
    //       <p>17 Goodyear Drive, Thomastown <a href="#">Edit</a></p>
    //
    //       on
    //
    //       <div id="reminderdate">
    //         <div>
    //           Date
    //           <select name="day">
    //             <option value="Friday 14 Sept">Friday 14 Sept</option>
    //             <option value="Friday 21 Sept">Friday 21 Sept</option>
    //           </select>
    //         </div>
    //         <div>
    //           Start time
    //           <select name="start time">
    //             <option value="9.30am">9.30am</option>
    //             <option value="10.00am">10.00am</option>
    //           </select>
    //         </div>
    //         <div>
    //           End time
    //           <select name="end time">
    //             <option value="3.00pm">3.00pm</option>
    //             <option value="3.30pm">3.30pm</option>
    //           </select>
    //         </div>
    //       </div>
    //
    //       <h6>Additional Information</h6>
    //       Please bring your lunch with you.
    //       Enclosed shoes must be worn.
    //       Please text N if you need to reschedule. <a href="#">Edit</a>
    //     </div>
    //
    //     <div>
    //       <button>Schedule SMS</button>
    //     </div>
    //
    //     <div>
    //       <h6>This is the SMS you will send</h6>
    //       <div id="preview">
    //         You are required to attend work at St Vincent De Paul Friday InHouse Program at <a href="#">17 Goodyear Drive, Thomastown</a> on Friday, 14 September at 9.30am until 3.00pm.
    //         Please bring your lunch with you.
    //         Enclosed shoes must be worn.
    //         Please text N if you need to reschedule.
    //       </div>
    //     </div>
    //   </div>
    // </div>
}
