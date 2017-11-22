// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../navbar/admin.js')
var hoverInfo = require('../hoverInfo')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      #content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin: auto;
        margin-bottom: 6rem;
        margin-top: 6rem;
        max-width: 1100px;
        #searchBar {
          align-self: center;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          input {
            height: 1.5rem;
            margin: auto;
            width: 10rem;
          }
          select {
            margin-top: 0.75rem;
            width: 15rem;
          }
        }
      }
    }
  `

  var name = state.ccs.ui.search.name
  var JAID = state.ccs.ui.search.JAID
  var region = state.ccs.ui.search.region
  var regions = state.ccs.ui.search.regions
  var location = state.ccs.ui.search.location
  var locations = state.ccs.ui.search.locations
  var results = state.ccs.ui.search.results
  var loaded = state.ccs.ui.search.loaded
  var searchRegion = state.ccs.ui.search.searchRegion

  return html`
    <div class=${style}>
      ${navbar(state.ccs.user.name, state.ccs.ui.manageUsers.newRequests.length)}
      <div id="content">
        ${loaded ? null : loadRegions()}
        <button class="white-button" onclick=${back}>Back</button>
        <h3>Search clients</h3>
        <div id="searchBar">
          <input type="text" placeholder="Name" value=${name} id="name" oninput=${updateInput} />
          <input type="text" placeholder="JAID" value=${JAID} id="JAID" oninput=${updateInput} />
          ${displayRegions()}
          ${displayLocations()}
          <button class="blue-button" onclick=${findResults}>Search</button>
        </div>
        ${results !== [] ? printResults() : null}
      </div>
    </div>
  `

  function back () {
    emit('clearState')
    emit('pushState', '/ccs/clientlist')
  }

  function loadRegions () {
    emit('loadRegions', {template: 'search', target: 'regions'})
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

  function findResults () {
    state.ccs.ui.search.searchRegion = region
    state.ccs.ui.search.searchLocation = location
    state.ccs.ui.search.results = [{
      name: 'Johnny Test',
      phone: '61411123333',
      JAID: 111,
      location: 'Derrimut Community Work and Reparation Orders',
      region: 'North West Metropolitan'
    }, {
      name: 'Jake Black',
      phone: '61411123333',
      JAID: 222,
      location: 'South Morang Justice Service Centre',
      region: 'South East Metropolitan'
    }, {
      name: 'Sam Iam',
      phone: '61411123333',
      JAID: 333,
      location: 'Derrimut Community Work and Reparation Orders',
      region: 'North West Metropolitan'
    }, {
      name: 'Dana Bo-bana',
      phone: '61422777000',
      JAID: 444,
      location: 'Ravenhall Prison',
      region: 'North West Metropolitan'
    }]
    emit('render')
  }

  function printResults () {
    return html`
      <table>
        ${results.map(function (el, index) {
          return html`
            <tr>
              <td>${el.name}</td>
              <td>${el.JAID}</td>
              <td>${el.region}</td>
              <td>${el.location}</td>
              <td>${state.ccs.user.regionID !== parseInt(regions.filter(function (element) {
                return element.RegionName === el.region
              })[0].RegionID) ?
                html`
                  <button class="grey-button">
                    Add to my client list
                    ${hoverInfo(`You can't add someone in a different region`)}
                  </button>
                ` :
                state.ccs.ui.clientList.clients.filter(function (element) {
                  return element.JAID === el.JAID
                }).length === 0 ?
                html`
                  <button class="blue-button" onclick=${addToClientList} id="client-${index}">
                    Add to my client list
                  </button>
                ` :
                html`
                  <button class="white-button">
                    Remove from my client list
                  </button>
                `}
              </td>
            </tr>
          `
        })}
      </table>
    `
  }

  function addToClientList (e) {
    emit('addToClientList', results[parseInt(e.target.id.slice(7))])
  }

  function updateInput (e) {
    emit('updateInput', {
      user: 'ccs',
      template: 'search',
      target: e.target.id,
      text: e.target.value
    })
    if (e.target.id = 'region') {
      emit('loadLocationsForRegion', {
        template: 'search',
        target: 'locations',
        regionID: regions.filter(function (el) {
          return el.RegionName === state.ccs.ui.search.region
        })[0].RegionID
      })
    }
  }
}
