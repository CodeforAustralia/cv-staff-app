// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../navbar')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      #content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin: auto;
        max-width: 1100px;
        #content-top {
          margin: 6rem;
          width: 50%;
          p { margin-bottom: 0; }
        }
        #content-bottom {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          margin-left: 6rem;
          table {
            border-spacing: 0px;
            th {
              background-color: #f8f8f8;
              color: #616069;
              padding: 0.5rem 2rem;
              text-align: left;
              span {
                cursor: pointer;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                img {
                  height: 1rem;
                  margin: auto;
                  margin-left: 1rem;
                }
              }
            }
            td {
              padding: 0.5rem 2rem;
              a, a:visited {
                color: #498fe1;
                text-decoration: none;
              }
            }
          }
        }
      }
    }
  `

  return html`
    <div class=${style}>
      ${navbar()}
      <div id="content">
        <div id="content-top">
          <h1>Find your Orion administrator</h1>
          <p>Need help logging in? Forgot your password? Need to access files from another region? Contact the Orion administrator in the relevant location.</p>
        </div>
        <div id="content-bottom">
          ${displayTable()}
        </div>
      </div>
    </div>
  `

  function updateSortCategory (e) {
    if (e.target.id === state.ui.administrators.sort.on) {
      emit('reverseSort', {template: 'administrators'})
    } else {
      emit('updateSort', {template: 'administrators', target: e.target.id})
    }
  }

  function displayTable() {
    var sortedArray = state.ui.administrators.administrators
    var category = state.ui.administrators.sort.on
    var comparison

    sortedArray.sort(function (a, b) {
      a = a[category].toLowerCase()
      b = b[category].toLowerCase()
      comparison = (a > b) - (a < b)
      return (state.ui.administrators.sort.direction === 'asc' ? comparison : (-comparison))
    })

    return html`
      <table>
        <tr id="headings">
          ${state.ui.administrators.tableFields.map(function (el) {
            return html`
              <th>
                <span id="${el}" onclick=${updateSortCategory}>
                  ${el.charAt(0).toUpperCase() + el.slice(1)}
                  ${category === el ? html`<img src="../../assets/sort-${state.ui.administrators.sort.direction}.png" />` :
                                      html`<img src="../../assets/sort-arrows.png" />`}
                </span>
              </th>
            `
          })}
        </tr>
        ${sortedArray.map(function (el) {
          return html`
            <tr>
              <td>${el.administrator}</td><td>${el.office}</td><td>${el.region}</td><td><a href="mailto:${el.email}?subject=Orion%20Access%20Request">${el.email}</a></td>
            </tr>
          `
        })}
      </table>
    `
  }
}
