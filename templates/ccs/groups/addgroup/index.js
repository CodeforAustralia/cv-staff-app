// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../../navbar/admin.js')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      #content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 1100px;
        margin: auto;
        margin-top: 4rem;
        #content-top {
          p { margin: 0.5rem 0; }
        }
        #content-bottom {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          max-width: 550px;
          h3 { color: #000; }
          label { margin: 0.25rem 0; }
          #name-prompt {
            display: flex;
            flex-direction: column;
            h6 { margin: 0.25rem 0 0 0.25rem; }
          }
          #location-select, .type-select {
            display: flex;
            flex-direction: row;
            div {
              display: flex;
              flex-direction: column;
              width: 50%;
            }
            > label { margin: -0.25rem 0 0.75rem 1rem; }
          }
          #submit {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            * {
              align-self: center;
              margin: 0 1rem 0 0;
            }
            a, a:visited {
              color: #498fe1;
              text-decoration: none;
            }
          }
        }
      }
    }
  `

  return html`
    <div class=${style}>
      ${navbar(state.ccs.user.name, state.ccs.ui.manageUsers.newRequests.length)}
      <div id="content">
        <div id="content-top">
          <h2>Create a group</h2>
          <p>Send the same message to a group of clients.</p>
          <p>Schedule messages to be sent out regularly.</p>
        </div>
        <div id="content-bottom">
          <h3>Group details</h3>
          <label>Group name</label>
          <input type="text" id="name" onfocus=${togglePrompt} onblur=${togglePrompt}/>
          ${displayPrompt()}
          <div id="location-select">
            <div>
              <label>Location</label>
              <select id="location">
                <option>Sunshine</option>
              </select>
            </div>
            <div>
              <label>Region</label>
              <select id="region">
                <option>North West Metropolitan</option>
              </select>
            </div>
          </div>
          <label>Type of group</label>
          <div class="type-select">
            <input type="radio" name="type" id="communityWork" checked>
            <label for="communityWork">Community work</label>
          </div>
          <div class="type-select">
            <input type="radio" name="type" id="other">
            <label for="other">Other</label>
          </div>
          <div id="submit">
            <button class="blue-button">Save</button>
            <a href="/ccs/groups">Cancel</a>
          </div>
        </div>
      </div>
    </div>
  `

  function togglePrompt () {
    emit('toggleDisplayPrompt', {template: 'addGroup'})
  }

  function displayPrompt () {
    if (state.ccs.ui.addGroup.displayPrompt) {
      return html`
        <span id="name-prompt">
          <h6>Give this group a name that will make it easy for you and others to find.</h6>
          <h6>Only CCS staff will see the name you give this group.</h6>
        </span>
      `
    } else {
      return html`
        <span style="height:2.5rem;width:100%;"></span>
      `
    }
  }
}
