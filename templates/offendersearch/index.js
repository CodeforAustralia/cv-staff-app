// require dependencies
var html = require('choo/html')
var css = require('sheetify')


module.exports = function (state, emit) {
  var style = css`
    :host {
      margin: auto;
      max-width: 900px;
      div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin: 0 1rem;
        div {
          color: #6f6e75;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          width: 25%;
        }
      }
    }
  `

  return html`
    <div class=${style}>
      <div>
        <div>
          <p>Search</p>
          <input type="text" />
        </div>
        <div>
          <p>Case Manager</p>
          <select name="case manager">
            <option value="Case Manager">Case Manager</option>
          </select>
        </div>
        <div>
          <p>Location</p>
          <select name="location">
            <option value="location" id="location">Location</option>
            ${state.region.locations.map(function (location) {
              return html`<option value="${location.name}">${location.name}</option>`
            })}
          </select>
        </div>
        <div>
          <p>Region</p>
          <select name="region" disabled>
            <option value="Region">${state.region.name}</option>
          </select>
        </div>
      </div>
    </div>
  `
}
