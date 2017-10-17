// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      display: flex;
      flex-direction: row;
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

    select {
      border: none;
      border-radius: 10px;
      height: 2rem;
      margin: 0 1rem;
      -moz-border-radius: 6px;
      -webkit-border-radius: 6px;
    }
  `

  return html`
      <div class=${style}>
        <div></div>
        <div>
          ${generateMessageOptions()}
        </div>
      </div>
    `
    function generateMessageOptions () {
      return html`
        <div>
          <select name="appointmentType" onchange=${updatePage}>
            ${state.static.appointmentTypes.map(function (appointmentType) {
              return html`<option value=${appointmentType}>${appointmentType}</option>`
            })}
          </select>
          <select name="message">
            ${state.static.messageTypes.map(function (messageType) {
              return html`<option value=${messageType}>${messageType}</option>`
            })}
          </select>
        </div>
      `
    }

    function updatePage (e) {
      if (e.target.value === 'Supervision') {
        console.log('Change to supervision page')
      }
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
