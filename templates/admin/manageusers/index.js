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
        table {
          border-collapse: collapse;
          border: 1px #e5e5e5 solid;
          th {
            background-color: #f8f8f8;
            border-top: 1px #e5e5e5 solid;
            border-bottom: 1px #e5e5e5 solid;
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
          #new {
            td {
              background-color: #f8f8f8;
              color: #616069;
            }
          }
          td {
            border-bottom: 1px #e5e5e5 solid;
            padding: 0.5rem 2rem;
            a, a:visited {
              color: #498fe1;
              text-decoration: none;
            }
          }
        }
      }
    }

    .button {
      align-self: flex-end;
      background-color: #498fe1;
      color: #fff;
      cursor: pointer;
      margin: 0.5rem;
      padding: 0.5rem 1.5rem;
      width: max-content;
    }

    .access-button {
      border-radius: 5px;
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
        <h1>Manage CCS users</h1>
        <div class="button">Add new user</div>
        ${generateTable()}
      </div>
    </div>
  `

  function generateTable() {
    var requests = state.ui.manageUsers.newRequests
    var users = state.ui.manageUsers.users

    return html`
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Location</th><th>Region</th><th>User role</th>
          </tr>
        </thead>
        <tbody>
          ${requests.map(function (el) {
            return html`<tr id="new"><td>${el.name}</td><td>${el.email}</td><td>${el.location}</td><td>${el.region}</td><td><div class="button access-button">Requested Access</div></td></tr>`
          })}
          ${users.map(function (el) {
            return html`<tr><td>${el.name}</td><td>${el.email}</td><td>${el.location}</td><td>${el.region}</td><td><div class="edit-button">Edit</div></td></tr>`
          })}
        </tbody>
      </table>
    `
  }
}
