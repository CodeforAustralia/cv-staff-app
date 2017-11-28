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
        margin-top: 2rem;
        #content-top {
          div {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            button { height: 2.5rem; }
            .group-detail {
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              margin: 0 0.5rem;
              #group-type {
                input[type="checkbox"] { margin-top: 0.5rem; }
                label { margin: 0 0.25rem 0.25rem 0.25rem; }
              }
              span:nth-child(3) {
                color: #616069;
              }
            }
            .group-detail:first-child, .group-detail:nth-child(2) { width: 15rem; }
            .group-detail:nth-child(4) {
              h3 {
                color: #000;
                margin: 0;
                text-align: center;
              }
            }
          }
        }
      }
    }
  `

  var name = state.ccs.ui.editGroup.name
  var location = state.ccs.ui.editGroup.location
  var region = state.ccs.ui.editGroup.region
  var type = state.ccs.ui.editGroup.type
  var clients = state.ccs.ui.editGroup.clients
  var createdBy = state.ccs.ui.editGroup.createdBy
  var createdDate = state.ccs.ui.editGroup.createdDate
  var lastUpdatedBy = state.ccs.ui.editGroup.lastUpdatedBy
  var lastUpdatedDate = state.ccs.ui.editGroup.lastUpdatedDate

  return html`
    <div class=${style}>
      ${navbar(state.ccs.user.name, state.ccs.ui.manageUsers.newRequests.length)}
      <div id="content">
        <div id="content-top">
          <div id="group-banner">
            <span id="name">
              <label>Name</label>
              <h3>${name}</h3>
            </span>
            <button class="white-button">Edit</button>
          </div>
          <div>
            <div class="group-detail">
              <label>Location</label>
              <select disabled>
                <option>${location}</option>
              </select>
            </div>
            <div class="group-detail">
              <label>Region</label>
              <select disabled>
                <option>${region}</option>
              </select>
            </div>
            <div class="group-detail">
              <label>Type of group</label>
              <div id="group-type">
                <input type="checkbox" checked disabled id="type"/>
                <label for="type">${type}</label>
              </div>
            </div>
            <div class="group-detail">
              <label>Clients</label>
              <h3>${clients.length}</h3>
            </div>
            <div class="group-detail">
              <label>Created by</label>
              <span>${createdBy}</span>
              <span>${createdDate}</span>
            </div>
            <div class="group-detail">
              <label>Last updated by</label>
              <span>${lastUpdatedBy}</span>
              <span>${lastUpdatedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}
