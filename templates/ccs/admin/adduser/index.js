// notes
// what's displayed over the information hover?

// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../../navbar/admin.js')
var hoverInfo = require('../../hoverInfo')
var api = require('../../../../lib/ccsapi.js')

// export module
module.exports = function (state, emit) {
  var addUserState = state.ccs.ui.addUser
  var username = addUserState.username
  var givenName = addUserState.givenName
  var lastName = addUserState.lastName
  var email = addUserState.email
  var region = addUserState.region
  var location = addUserState.location
  var locations = addUserState.locations
  var role = addUserState.role
  var error = addUserState.error
  var submit = addUserState.submit

  var style = css`
    :host {
      #content {
        margin: auto;
        margin-top: 4rem;
        max-width: 1100px;
        #content-top {
          width: 70%;
          #delete-prompt {
            align-items: center;
            background: #f5f5f5;
            border-radius: 2px;
            color: #000;
            display: flex;
            flex-direction: column;
            font-size: 20px;
            padding: 2rem;
            div {
              display: flex;
              flex-direction: row;
              justify-content: center;
            }
          }
        }
        #add-user {
          border: 2px #e0e0e0 solid;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          margin-bottom: 2rem;
          width: 70%;
          h3 { color: #000; }
          select {
            margin-right: 0;
            max-width: 100%;
          }
          #user-details {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-width: 50%;
            padding: 1.5rem;
            width: 50%;
            input, select {
              margin-bottom: 1rem;
            }
            div {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
            }
          }
          #account-settings {
            background-color: #f2f2f2;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-width: 50%;
            width: 50%;
            #user-role {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              padding: 1.5rem;
              label {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
              }
              select { background-color: #fff; }
            }
            #error {
              background-color: #d7d7d7;
              font-size: 1rem;
              margin: 0 2rem;
              padding: 1rem 0.5rem;
              text-align: center;
            }
            #submit {
              align-self: center;
              font-weight: bold;
              margin: 1rem;
              padding: 1.5rem;
              * {
                margin: 0.5rem;
              }
              span {
                color: #498fe1;
                cursor: pointer;
                text-decoration: none;
              }
            }
            #complete {
              flex-direction: row;
              justify-content: center;
              margin: 1.5rem;
              text-align: center;
              img {
                height: 1.5rem;
                margin: auto;
              }
            }
          }
        }
      }
    }
  `

  return html`
    <div class=${style} onload=${addUserState.loaded ? null : loadRegionData()}>
      ${navbar(state.ccs.user.name, state.ccs.ui.manageUsers.newRequests.length)}
      <section id="content">
        <section id="content-top">
          <button class="white-button" onclick=${back}>Back to user list</button>
          <h1>Add new user</h1>
          <p>Create an account for Case Managers, Justice Officers, Community Work Officers, and any other CCS staff who need to send SMS/web reminders to clients.</p>
          ${addUserState.requested ? html`
            <div>
              <button style="float:right" class="white-button" onclick=${toggleLightbox}>Delete this request</button>
              ${addUserState.lightbox ? html`
                <div class="lightbox">
                  <div id="delete-prompt">
                    Are you sure you want to delete this access request?
                    <div>
                      <button class="white-button" onclick=${toggleLightbox}>Cancel</button>
                      <button class="blue-button" onclick=${deleteAccessRequest}>Delete</button>
                    </div>
                  </div>
                </div>` : null}
            </div>` : null}
        </section>
        <section id="add-user">
          <div id="user-details">
            <h3>User's details</h3>
            <label>eJustice username</label>
            <input type="text" value=${username} id="username" oninput=${updateInput} />
            <label>Given Name</label>
            <input type="text" value=${givenName} id="givenName" oninput=${updateInput} />
            <label>Last Name</label>
            <input type="text" value=${lastName} id="lastName" oninput=${updateInput} />
            <label>Email</label>
            <input type="text" value=${email} id="email" oninput=${updateInput} />
            <label>Region</label>
            <input disabled value=${state.ccs.ui.addUser.region} />
            ${state.ccs.ui.addUser.locations !== '' ? displayLocations() : null}
          </div>
          <div id="account-settings">
            <div id="user-role">
              <h3>Manage account settings</h3>
              <label>User role ${hoverInfo('Actual copy here')}</label>
              <select id="role" onchange=${updateInput}>
                <option ${role === 'User' ? 'selected' : null}>User</option>
                <option ${role === 'Admin' ? 'selected' : null}>Admin</option>
              </select>
              <p>Most CCS staff who use Orion will be Users.</p>
            </div>
            ${error ? displayError() : null}
            ${submit ? displaySuccess() : html`
              <div id="submit">
                <span onclick=${back}>Cancel</span>
                <button class="blue-button" style="align-self:flex-end" onclick=${validateInput}>Create account</button>
              </div>`}
          </div>
        </section>
      </section>
    </div>
  `

  function displaySuccess () {
    return html`
      <div id="complete">
        <h3>${givenName}${lastName ? ` ${lastName}` : ''}'s access granted</h3>
        <img src="../../assets/tick.png" />
      </div>
    `
  }

  function deleteAccessRequest () {
    emit('deleteAccessRequest')
  }

  function displayLocations () {
    return locations ? html`
      <div>
        <label>Location</label>
        <select id="location" onchange=${updateInput}>
          <option disabled ${location ? null : 'selected'}></option>
          ${locations.map(function (el) {
            return html`<option ${el.SiteName === location ? 'selected' : null}>${el.SiteName}</option>`
          })}
        </select>
        <p>If the CCS staff member works at more than one office, just choose one.</p>
      </div>` : null
  }

  function loadRegionData () {
    emit('loadRegionData', {template: 'addUser'})
  }

  function displayError() {
    return html`
      <div id="error">
        ${error}
      </div>
    `
  }

  function validateInput () {
    var errorMessage = ''
    if (!givenName) {
      errorMessage = 'Please enter a given name'
    } else if (!email.endsWith('@justice.vic.gov.au')) {
      errorMessage = 'Please use a @justice.vic.gov.au email address'
    } else if (!region) {
      errorMessage = 'Please select a region'
    } else if (!location) {
      errorMessage = 'Please select a location'
    }

    if (errorMessage) {
      emit('updateError', {template: 'addUser', error: errorMessage})
    } else {
      emit('updateError', {template: 'addUser', error: ''})
      emit('createAccount')
    }
  }

  function updateInput (e) {
    emit('updateInput', {user: 'ccs', template: 'addUser', target: e.target.id, text: e.target.value})
  }

  function back () {
    emit('clearState')
    emit('pushState', '/ccs/admin/manageusers')
  }

  function toggleLightbox () {
    emit('toggleLightbox', 'addUser')
  }
}
