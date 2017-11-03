// notes:
// sorted by first character of array
// go over styling
// will need pagination
// will all locations/regions be the same? need that sorting capability?
// question: what behaviour do numeric labels have when sorting?

// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../../navbar/admin.js')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      font-family: Helvetica;
      line-height: 1.5;
      #content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin: auto;
        margin-top: 6rem;
        max-width: 1100px;
        .button {
          align-self: flex-end;
          background-color: #498fe1;
          border-radius: 5px;
          color: #fff;
          cursor: pointer;
          margin: 0.5rem 0 0.5rem 0.5rem;
          padding: 0.5rem 1.5rem;
          width: max-content;
        }
        table {
          align-self: center;
          border-collapse: collapse;
          border: 1px #e5e5e5 solid;
          font-size: 0.9rem;
          width: 100%;
          img {
            height: 1rem;
            margin: auto;
            margin-left: 1rem;
          }
          th {
            background-color: #f8f8f8;
            border-top: 1px #e5e5e5 solid;
            border-bottom: 1px #e5e5e5 solid;
            color: #616069;
            padding: 0.25rem 1rem;
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
          #new {
            td {
              background-color: #f8f8f8;
              color: #616069;
            }
          }
          td {
            border-bottom: 1px #e5e5e5 solid;
            padding: 0.25rem 1rem;
            a, a:visited {
              color: #498fe1;
              text-decoration: none;
            }
            span {
              background-color: #ffa200;
              border-radius: 10px;
              color: #fff;
              margin-right: 0.5rem;
              padding: 0.25rem 0.5rem;
            }
          }
          .manage-cell {
            border-left: 1px #e5e5e5 solid;
            display: flex;
            flex-direction: row;
            justify-content: center;
          }
        }
      }
    }

    .edit-button {
      border: 2px #e0e0e0 solid;
      border-radius: 5px;
      color: #616069;
      cursor: pointer;
      margin: 0.5rem;
      padding: 0.5rem 1.5rem;
      width: max-content;
    }
  `

  return html`
    <div class=${style}>
      ${navbar(state.user.name, state.ui.manageUsers.newRequests.length)}
      <div id="content">
        <h1>Manage CCS staff accounts</h1>
        <p>Case Managers, Justice Officers, Community Work Officers, and any other CCS staff who need to send SMS/web reminders to clients.</p>
        <div class="button" onclick=${addUser}>Add new user</div>
        ${generateTable()}
      </div>
    </div>
  `

  function generateTable() {
    var category = state.ui.manageUsers.sort.on

    var sortedNewRequests = state.ui.manageUsers.newRequests

    sortedNewRequests = sortedNewRequests.sort(function (a, b) {
      comparison = (a[category] > b[category]) - (a[category] < b[category])
      return (state.ui.manageUsers.sort.direction === 'asc' ? comparison : (-comparison))
    })
    var sortedUsers = state.ui.manageUsers.users.sort(function (a, b) {
      comparison = (a[category] > b[category]) - (a[category] < b[category])
      return (state.ui.manageUsers.sort.direction === 'asc' ? comparison : (-comparison))
    })

    return html`
      <table>
        <thead>
          <tr>
            ${state.ui.manageUsers.tableFields.map(function (el, index) {
              if (index < (state.ui.manageUsers.tableFields.length - 1)) {
                return html`
                  <th>
                    <span id="${el}" onclick=${updateSortCategory}>
                      ${el.charAt(0).toUpperCase() + el.slice(1)}
                      ${category === el ? html`<img src="../../assets/sort-${state.ui.manageUsers.sort.direction}.png" />` :
                                        html`<img src="../../assets/sort-arrows.png" />`}
                    </span>
                  </th>
                `
              } else {
                return html`
                  <th>${el.charAt(0).toUpperCase() + el.slice(1)}</th>
                `
              }
            })}
          </tr>
        </thead>
        <tbody>
          ${sortedNewRequests.map(function (el, index) {
            return html`<tr id="new"><td><span>${index + 1}</span>${el.name}</td><td>${el.email}</td><td>${el.location}</td><td>${el.region}</td><td>${el.role}</td><td class="manage-cell"><div class="button">Requested Access</div></td></tr>`
          })}
          ${sortedUsers.map(function (el) {
            return html`<tr><td>${el.name}</td><td>${el.email}</td><td>${el.location}</td><td>${el.region}</td><td>${el.role.charAt(0).toUpperCase() + el.role.slice(1)}</td><td class="manage-cell"><div class="edit-button">Edit</div></td></tr>`
          })}
        </tbody>
      </table>
    `
  }

  function addUser () {
    emit('pushState', '/admin/adduser')
  }

  function updateSortCategory (e) {
    if (e.target.id === state.ui.manageUsers.sort.on) {
      emit('reverseSort', {template: 'manageUsers'})
    } else {
      emit('updateSort', {template: 'manageUsers', target: e.target.id})
    }
  }
}
