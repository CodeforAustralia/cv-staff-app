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
      background-color: pink;
    }
  `

  return html`
  <div class="${style} modal">
    <h2>Add a new user</h2>
    <label>JAID</label>
    <input type="text" placeholder="JAID" />
    <button class="white-button" onclick=${toggleModal}>Back</button>
  </div>
  `

  function toggleModal () {
    emit('toggleModal', {template: 'search'})
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
}
