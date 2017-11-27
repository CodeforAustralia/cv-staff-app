// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../navbar/admin.js')

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
          #filter-bar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin: 3rem 0;
            #filter-bar-left {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              h3 {
                align-self: center;
                color: #000;
                margin: 0 1rem;
              }
              #filter {
                align-self: center;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin: 0 0.5rem;
                input[type="checkbox"] { margin: 0 0.5rem; }
                select { width: 100%; }
              }
              #filter:nth-child(2) { width: 15rem; }
              #filter:nth-child(3) { width: 15rem; }
            }
          }
          table {
            border: none;
            border-collapse: collapse;
            width: 100%;
            td {
              border-top: 2px #e0e0e0 solid;
              padding: 0.5rem;
              h3 {
                color: #498fe1;
                margin: 0;
              }
              p { margin: 0; }
              .num-clients { text-align: center; }
              .scheduled {
                display: flex;
                h6 { margin: 0; }
                img {
                  height: 0.75rem;
                  margin: auto;
                  margin-left: 0.5rem;
                }
              }
              a, a:visited {
                color: #498fe1;
                text-decoration: none;
              }
            }
            .disabled { background-color: #e0e9e9}
          }
        }
      }
    }
  `

  var region = state.ccs.ui.groups.region
  var regions = state.ccs.ui.groups.regions
  var location = state.ccs.ui.groups.location
  var locations = state.ccs.ui.groups.locations
  var loaded = state.ccs.ui.groups.loaded
  var groups = state.ccs.ui.groups.groups

  return html`
    <div class=${style}>
      ${loaded ? null : loadRegions()}
      ${navbar(state.ccs.user.name, state.ccs.ui.manageUsers.newRequests.length)}
      <div id="content">
        <div id="content-top">
          <h2>Groups</h2>
          <p>Send the same SMS reminder to a group of clients.</p>
          <p>You can also schedule the reminders to go out regularly. This is useful for community work reminders.</p>
        </div>
        <div id="content-bottom">
          <div id="filter-bar">
            <div id="filter-bar-left">
              <h3>Filter by</h3>
              <div id="filter">
                <label>Region</label>
                ${displayRegions()}
              </div>
              <div id="filter">
                <label>Location</label>
                ${displayLocations()}
              </div>
              <div id="filter">
                <label>Type</label>
                <div id="group-type">
                  <input type="checkbox" />Community Work Group
                  <input type="checkbox" />Other
                </div>
              </div>
            </div>
            <div id="filter-bar-right">
              <button class="blue-button">Create group</button>
            </div>
          </div>
          ${displayResults()}
        </div>
      </div>
    </div>
  `

  function displayResults () {
    var filteredGroups = groups
    if (region) {
      filteredGroups = groups.filter(function (el) {
        return el.region === region
      })
      if (location) {
        filteredGroups = filteredGroups.filter(function (el) {
          return el.location === location
        })
      }
    }

    return html`<table>
      ${filteredGroups.map(function (el) {
        return html`
          <tr class=${el.clients.length ? '' : "disabled"}>
            <td>
              <h3>${el.name}</h3>
              <p>Created ${el.createdDate}</p>
              <p>Created by ${el.createdBy}</p>
            </td>
            <td>
              <p>${el.location}</p>
              <p>${el.type}</p>
            </td>
            <td>
              <div class="num-clients">
                <h3>${el.clients.length}</h3>
                <p>Clients</p>
              </div>
            </td>
            <td>
              <button class="grey-button">Add client</button>
            </td>
            <td>
              <button class="green-button">View messages</button>
              <div class="scheduled">
                <h6>Message scheduled</h6>
                <img src="../../../assets/reload.png" />
              </div>
            </td>
            <td>
              <a href="#">Edit this group</a>
            </td>
          </tr>
        `
      })}
    </table>
    `
  }

  function loadRegions () {
    emit('loadRegions', {template: 'groups', target: 'regions'})
  }

  function displayRegions () {
    return regions !== [] ? html`
      <div>
        <select id="region" onchange=${updateInput}>
          <option disabled ${region ? null : 'selected'}>Region</option>
          ${regions.map(function (el) {
            return html`<option ${el.RegionName === region ? 'selected' : null}>${el.RegionName}</option>`
          })}
        </select>
      </div>` : null
  }

  function displayLocations () {
    return locations !== [] ? html`
      <div>
        <select id="location" onchange=${updateInput}>
          <option disabled ${location ? null : 'selected'}>
            ${region ? 'Location' : null}
          </option>
          ${locations.map(function (el) {
            return html`<option ${el.SiteName === location ? 'selected' : null}>${el.SiteName}</option>`
          })}
        </select>
      </div>` : null
  }

  function updateInput (e) {
    var value
    if (e.target.value === 'Region' || e.target.value === 'Location'){
      value = ''
    } else {
      value = e.target.value
    }

    emit('updateInput', {
      user: 'ccs',
      template: 'groups',
      target: e.target.id,
      text: value
    })
    if (e.target.id === 'region') {
      if (value) {
        emit('clearLocations', {template: 'groups'})
        emit('loadLocationsForRegion', {
          template: 'groups',
          target: 'locations',
          regionID: regions.filter(function (el) {
            return el.RegionName === state.ccs.ui.groups.region
          })[0].RegionID
        })
      } else {
        emit('clearLocations', {template: 'groups'})
      }
    }
  }
}
