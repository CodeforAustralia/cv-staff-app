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
          border-bottom: 2px #e0e0e0 solid;
          padding-bottom: 0.25rem;
          div {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            h3 {
              color: #000;
              margin: 0;
            }
            #name {
              width: 90%;
              input[type="text"] {
                font-size: 1.1rem;
                width: 100%;
              }
            }
            button { height: 2.5rem; }
            .group-detail {
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              margin: 0 0.5rem;
              .group-type {
                justify-content: flex-start;
                input[type="checkbox"] { margin-top: 0.5rem; }
                label { margin: 0 0.25rem 0.25rem 0.25rem; }
              }
              span:nth-child(3) {
                color: #616069;
              }
            }
            .group-detail:first-child, .group-detail:nth-child(2) { width: 15rem; }
          }
        }
        #content-middle {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: auto;
          padding: 2rem;
          width: 80%;
          #client-list {
            border: 2px #e0e0e0 solid;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 8rem;
            margin: auto;
            width: 100%;
            span { align-self: center; }
          }
          button { align-self: flex-end; }
        }
        #content-bottom {
          h3 {
            color: #000;
            margin: 0;
          }
          #search-bar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            #search-bar-left {
              margin: auto;
              margin-left: 0;
              input[type=text] { margin-right: 2rem; }
              * { width: 15rem; }
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
  var clientList = state.ccs.ui.editGroup.clientList
  var clients = state.ccs.ui.editGroup.clients
  var edit = state.ccs.ui.editGroup.edit
  var loaded = state.ccs.ui.editGroup.loaded
  var regions = state.ccs.ui.editGroup.regions
  var locations = state.ccs.ui.editGroup.locations

  return html`
    <div class=${style}>
      ${console.log(location)}
      ${(!loaded && edit) ? loadRegions() : null}
      ${navbar(state.ccs.user.name, state.ccs.ui.manageUsers.newRequests.length)}
      <div id="content">
        ${edit ? editableGroupData() : disabledGroupData()}
        <div id="content-middle">
          <label>Clients in this group</label>
          <div id="client-list">
            <span>There's no one in your group yet.</span>
            <span>Select some clients from the list below.</span>
          </div>
          <button class="blue-button disabled-button" disabled>Save changes</button>
        </div>
        <div id="content-bottom">
          <h3>Client list</h3>
          <div id="search-bar">
            <div id="search-bar-left">
              <input type="text" placeholder="Search" />
              <select>
                <option>North West Metropolitan</option>
              </select>
              <select>
                <option>All locations in this region</option>
              </select>
            </div>
            <button class="blue-button disabled-button">Add to group</button>
          </div>
          ${displayResults()}
        </div>
      </div>
    </div>
  `

  function loadRegions () {
    emit('loadRegions', {template: 'editGroup', target: 'regions'})
  }

  function displayRegions () {
    return regions !== [] ? html`
      <select id="region" onchange=${updateInput}>
        ${regions.map(function (el) {
          return html`<option ${el.RegionName === region ? 'selected' : null}>${el.RegionName}</option>`
        })}
      </select>
    ` : null
  }

  function updateInput (e) {
    var value
    var id = e.target.id
    if (e.target.value === 'Region' || e.target.value === 'Location'){
      value = ''
    } else {
      value = e.target.value
    }

    if (e.target.name === 'type') {
      value = e.target.id
      id = e.target.name
    }

    emit('updateInput', {
      user: 'ccs',
      template: 'editGroup',
      target: id,
      text: value
    })
    if (id === 'region') {
      if (value) {
        emit('clearLocations', {template: 'editGroup'})
        emit('loadLocationsForRegion', {
          template: 'editGroup',
          target: 'locations',
          regionID: regions.filter(function (el) {
            return el.RegionName === state.ccs.ui.addGroup.region
          })[0].RegionID
        })
      } else {
        emit('clearLocations', {template: 'editGroup'})
      }
    }
  }

  function displayLocations () {
    return locations !== [] ? html`
      <select id="location" onchange=${updateInput}>
        <option disabled selected>Location</option>
        ${locations.map(function (el, index) {
          return html`<option ${el.SiteName === location ? 'selected' : null}>${el.SiteName}</option>`
        })}
      </select>
    ` : null
  }

  function editableGroupData () {
    return html`
      <div id="content-top">
        <div id="group-banner">
          <span id="name">
            <label>Name</label>
            <input type="text" value=${name} />
          </span>
          <button class="white-button" onclick=${toggleEditing}>Edit</button>
        </div>
        <div>
          <div class="group-detail">
            <label>Location</label>
            ${displayLocations()}
          </div>
          <div class="group-detail">
            <label>Region</label>
            ${displayRegions()}
          </div>
          <div class="group-detail">
            <label>Type of group</label>
            <div class="group-type">
              ${console.log(type)}
              <input type="radio" id="communityWork" ${type === 'Community Work' ? 'checked' : null} name="type" />
              <label for="communityWork">Community Work</label>
            </div>
            <div class="group-type">
              <input type="radio" id="other" ${type === 'Other' ? 'checked' : null} name="type" />
              <label for="other">Other</label>
            </div>
          </div>
          <div class="group-detail">
            <label>Clients</label>
            <h3>${clientList.length}</h3>
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
    `
  }

  function toggleEditing () {
    emit('toggleEditing', {template: 'editGroup'})
  }

  function disabledGroupData () {
    return html`
      <div id="content-top">
        <div id="group-banner">
          <span id="name">
            <label>Name</label>
            <h3>${name}</h3>
          </span>
          <button class="white-button" onclick=${toggleEditing}>Edit</button>
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
            <div class="group-type">
              <input type="checkbox" checked disabled id="type" />
              <label for="type">${type}</label>
            </div>
          </div>
          <div class="group-detail">
            <label>Clients</label>
            <h3>${clientList.length}</h3>
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
    `
  }

  function displayResults () {
    return html`
      <table>
        <tr>
          <th><input type="checkbox" /></th>
          <th>Given name</th>
          <th>Family name</th>
          <th>JAID</th>
          <th>Mobile number</th>
          <th>Location</th>
          <th>Region</th>
          <th>Case Manager</th>
        </tr>
        ${clients.map(function (el) {
          return html`
            <tr>
              <td><input type="checkbox" /></td>
              <td>${el.givenName}</td>
              <td>${el.lastName}</td>
              <td>${el.JAID}</td>
              <td>${el.phone}</td>
              <td>${el.location}</td>
              <td>${el.region}</td>
              <td>${el.caseManager}</td>
            </tr>
          `
        })}
      </table>
    `
  }
}
