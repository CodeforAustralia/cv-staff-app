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
        justify-content: flex-start;
        margin: auto;
        margin-top: 6rem;
        margin-bottom: 6rem;
        max-width: 1100px;
        div {
          table {
            align-self: center;
            border-collapse: collapse;
            border: 1px #e5e5e5 solid;
            font-size: 0.9rem;
            margin: 2rem 0;
            table-layout: fixed;
            width: 100%;
          }
          img {
            height: 1rem;
            margin: auto;
            margin-left: 1rem;
          }
          th {
            background-color: #f8f8f8;
            border-top: 1px #e5e5e5 solid;
            border-bottom: 1px #e5e5e5 solid;
            box-sizing: border-box;
            color: #616069;
            padding: 0.25rem 0.5rem;
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
          th:first-child { width: 150px; }
          th:nth-child(2) { width: 250px; }
          th:nth-child(3) { width: 215px; }
          th:nth-child(4) { width: 190px; }
          th:nth-child(5) { width: 75px; }
          th:nth-child(6) { width: 220px; }
          #new {
            td {
              background-color: #f8f8f8;
              color: #616069;
            }
          }
          td {
            border-bottom: 1px #e5e5e5 solid;
            padding: 0.25rem 0.5rem;
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
          p {
            text-align: center;
            span {
              cursor: pointer;
              padding: 0 0.5rem;
            }
          }
        }
      }
    }
  `
  var manageUsersState = state.ccs.ui.manageUsers
  var pageLength = manageUsersState.pagination.pageLength

  return html`
    <div class=${style} onload=${manageUsersState.loaded ? null : emit('loadUsers')}>
      ${navbar(state.ccs.user.name, manageUsersState.newRequests.length)}
      <div id="content">
        <h1>Manage CCS staff accounts</h1>
        <p>Case Managers, Justice Officers, Community Work Officers, and any other CCS staff who need to send SMS/web reminders to clients.</p>
        <button class="blue-button" style="align-self:flex-end" onclick=${addUser}>Add new user</button>
        ${manageUsersState.newRequests.length !== 0 ? generateNewRequestsTable() : null}
        ${generateUsersTable()}
      </div>
    </div>
  `

  function generateNewRequestsTable () {
    var category = manageUsersState.sort.newRequests.on
    var sortedNewRequests = manageUsersState.newRequests
    var newRequestsPage = manageUsersState.pagination.newRequests

    sortedNewRequests = sortedNewRequests.sort(function (a, b) {
      a = a[category].toLowerCase()
      b = b[category].toLowerCase()

      comparison = (a > b) - (a < b)
      return (manageUsersState.sort.newRequests.direction === 'asc' ? comparison : (-comparison))
    })

    return html`
      <div>
        <table>
          <thead>
            <tr>
              ${manageUsersState.tableFields.map(function (el, index) {
                if (index < (manageUsersState.tableFields.length - 1)) {
                  return html`
                    <th>
                      <span id="newRequests-${el}" onclick=${updateSortCategory}>
                        ${el.charAt(0).toUpperCase() + el.slice(1)}
                        ${category === el ? html`<img src="../../assets/sort-${manageUsersState.sort.newRequests.direction}.png" />` :
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
            ${sortedNewRequests.slice((newRequestsPage - 1) * pageLength, newRequestsPage * pageLength).map(function (el, index) {
              return html`
                <tr id="new">
                  <td><span>!</span>${el.name}</td>
                  <td>${el.email}</td>
                  <td>${el.location}</td>
                  <td>${el.region}</td>
                  <td></td>
                  <td class="manage-cell"><button class="blue-button" id="newUser-${index}" onclick=${newUser}>Requested Access</button></td>
                </tr>
              `
            })}
          </tbody>
        </table>
        ${paginate(sortedNewRequests, 'newRequests')}
      </div>
    `
  }

  function generateUsersTable() {
    var category = manageUsersState.sort.users.on
    var usersPage = manageUsersState.pagination.users

    var sortedUsers = manageUsersState.users.sort(function (a, b) {
      a = a[category].toLowerCase()
      b = b[category].toLowerCase()
      comparison = (a > b) - (a < b)
      return (manageUsersState.sort.users.direction === 'asc' ? comparison : (-comparison))
    })

    return html`
      <div>
        <table>
          <thead>
            <tr>
              ${manageUsersState.tableFields.map(function (el, index) {
                if (index < (manageUsersState.tableFields.length - 1)) {
                  return html`
                    <th>
                      <span id="users-${el}" onclick=${updateSortCategory}>
                        ${el.charAt(0).toUpperCase() + el.slice(1)}
                        ${category === el ? html`<img src="../../assets/sort-${manageUsersState.sort.users.direction}.png" />` :
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
            ${sortedUsers.slice((usersPage - 1) * pageLength, usersPage * pageLength).map(function (el, index) {
              return html`
                <tr>
                  <td>${`${el.givenName} ${el.lastName}`}</td>
                  <td>${el.email}</td>
                  <td>${el.location}</td>
                  <td>${el.region}</td>
                  <td>${el.role === 'Staff' ? 'User' : el.role}</td>
                  <td class="manage-cell"><button class="white-button" id="user-${index}" onclick=${loadEditUser}>Edit</button></td>
                </tr>
              `
            })}
          </tbody>
        </table>
        ${paginate(manageUsersState.users, 'users')}
      </div>
    `
  }

  function paginate (table, tableName) {
    return html`<p>
        ${table.map(function (el, index) {
          if (index % manageUsersState.pagination.pageLength === 0) {
            if ((index / manageUsersState.pagination.pageLength + 1) === manageUsersState.pagination[tableName]) {
              return html`<span style="text-decoration:underline" id="increase-${tableName}-${index / manageUsersState.pagination.pageLength + 1}" onclick=${updatePage}>${index / manageUsersState.pagination.pageLength + 1}</span>`
            } else {
              return html`<span id="increase-${tableName}-${index / manageUsersState.pagination.pageLength + 1}" onclick=${updatePage}>${index / manageUsersState.pagination.pageLength + 1}</span>`
            }
          }
        })}
      </p>
    `
  }

  function updatePage (e) {
    if (e.target.id.includes('increase-user')) {
      emit('updatePage', {target: 'users', value: parseInt(e.target.id.slice(15))})
    } else if (e.target.id.includes('increase-newRequest')) {
      emit('updatePage', {target: 'newRequests', value: parseInt(e.target.id.slice(21))})
    }
  }

  function loadEditUser (e) {
    index = e.target.id.slice(5)
    emit('loadEditUser', {index: index})
  }

  function newUser (e) {
    index = e.target.id.slice(8)
    emit('updateNewUser', {index: index})
  }

  function addUser () {
    emit('loadAddNewUser')
  }

  function updateSortCategory (e) {
    var table = e.target.id.split('-')[0]
    var id = e.target.id.split('-')[1]

    if (id === manageUsersState.sort[table].on) {
      emit('reverseSort', {template: 'manageUsers', table: table})
    } else {
      emit('updateSort', {template: 'manageUsers', table: table, target: id})
    }
  }
}
