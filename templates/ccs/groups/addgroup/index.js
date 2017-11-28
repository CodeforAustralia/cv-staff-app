// require dependencies
var html = require('choo/html')
var css = require('sheetify')
var moment = require('moment')

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
          #error {
            background-color: #d7d7d7;
            font-size: 0.8rem;
            margin-top: 1rem;
            padding: 1rem 0.5rem;
            text-align: center;
          }
        }
      }
    }
  `

  var name = state.ccs.ui.addGroup.name
  var loaded = state.ccs.ui.addGroup.loaded
  var region = state.ccs.ui.addGroup.region
  var regions = state.ccs.ui.addGroup.regions
  var location = state.ccs.ui.addGroup.location
  var locations = state.ccs.ui.addGroup.locations
  var type = state.ccs.ui.addGroup.type
  var error = state.ccs.ui.addGroup.error

  return html`
    <div class=${style}>
    ${loaded ? null : loadRegions()}
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
          <input type="text" id="name" value=${name} oninput=${updateInput} onfocus=${togglePrompt} onblur=${togglePrompt}/>
          ${displayPrompt()}
          <div id="location-select">
            <div>
              <label>Location</label>
              ${displayLocations()}
            </div>
            <div>
              <label>Region</label>
              ${displayRegions()}
            </div>
          </div>
          <label>Type of group</label>
          <div class="type-select">
            <input onchange=${updateInput} type="radio" name="type" id="communityWork" ${type === 'communityWork' ? 'checked' : null}>
            <label for="communityWork">Community work</label>
          </div>
          <div class="type-select">
            <input onchange=${updateInput} type="radio" name="type" id="other" ${type === 'other' ? 'checked' : null}>
            <label for="other">Other</label>
          </div>
          <div id="submit">
            <button class="blue-button" onclick=${validate}>Save</button>
            <a href="/ccs/groups">Cancel</a>
          </div>
          ${error ? displayError() : null}
        </div>
      </div>
    </div>
  `

  function validate () {
    var errorMessage = ''
    if (name === '') {
      errorMessage = 'Please enter a name for this group'
    } else if (location === '') {
      errorMessage = 'Please select a location'
    }

    emit('updateError', {template: 'addGroup', error: errorMessage})

    if (!errorMessage) {
      state.ccs.ui.groups.groups.push({
        name: name,
        createdDate: new moment().format('D MMMM YYYY'),
        createdBy: state.ccs.user.name,
        region: region,
        location: location,
        type: type === 'other' ? 'Other' : 'Community Work',
        clients: []
      })

      emit('pushState', '/ccs/groups')
    }
  }

  function displayError() {
    return html`
      <div id="error">
        ${error}
      </div>
    `
  }

  function displayLocations () {
    return locations !== [] ? html`
      <select id="location" onchange=${updateInput}>
        <option disabled ${location ? null : 'selected'}>
          ${region ? 'Location' : null}
        </option>
        ${locations.map(function (el) {
          return html`<option ${el.SiteName === location ? 'selected' : null}>${el.SiteName}</option>`
        })}
      </select>
    ` : null
  }

  function displayRegions () {
    return regions !== [] ? html`
      <select id="region" onchange=${updateInput}>
        <option disabled ${region ? null : 'selected'}>Region</option>
        ${regions.map(function (el) {
          return html`<option ${el.RegionName === region ? 'selected' : null}>${el.RegionName}</option>`
        })}
      </select>
    ` : null
  }

  function loadRegions () {
    emit('loadRegions', {template: 'addGroup', target: 'regions'})
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
      template: 'addGroup',
      target: id,
      text: value
    })
    if (id === 'region') {
      if (value) {
        emit('clearLocations', {template: 'addGroup'})
        emit('loadLocationsForRegion', {
          template: 'addGroup',
          target: 'locations',
          regionID: regions.filter(function (el) {
            return el.RegionName === state.ccs.ui.addGroup.region
          })[0].RegionID
        })
      } else {
        emit('clearLocations', {template: 'addGroup'})
      }
    }
  }

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
