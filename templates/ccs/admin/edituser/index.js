// notes
// what does the cancel button do?
// need to pull locations and regions
// what's displayed over the information hover?
// need to add changes to database
// need to be able to delete user
// need to be able to do password reset

// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../../navbar/admin.js')
var hoverInfo = require('../../hoverInfo')

// export module
module.exports = function (state, emit) {
  var editUserState = state.ccs.ui.editUser
  var username = editUserState.username
  var givenName = editUserState.givenName
  var lastName = editUserState.lastName
  var email = editUserState.email
  var region = editUserState.region
  var location = editUserState.location
  var locations = editUserState.locations
  var role = editUserState.role

  var style = css`
    :host {
      #content {
        margin: auto;
        margin-top: 4rem;
        max-width: 1100px;
        #content-top {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          width: 70%;
        }
        #add-user {
          border: 2px #e0e0e0 solid;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          margin-bottom: 2rem;
          width: 70%;
          h3 {
            color: #000;
          }
          select {
            margin-right: 0;
            max-width: 100%;
          }
          #user-details {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding: 1.5rem;
            width: 50%;
            input, select {
              margin-bottom: 1rem;
            }
          }
          #account-settings {
            background-color: #f2f2f2;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1.5rem;
            width: 50%;
            #user-role {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              label {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
              }
              input, select {
                background-color: #fff;
                margin-bottom: 1rem;
                padding-left: 0.5rem;
              }
              #password { color: #616069; }
              #password-reset {
                margin: auto;
              }
            }
            #submit {
              align-self: center;
              font-weight: bold;
              margin: 1rem;
              padding: 1.5rem;
              * {
                margin: 0.5rem;
              }
            }
            #complete {
              display: none;
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
      img {
        height: 1rem;
      }
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
      span {
        color: #498fe1;
        cursor: pointer;
        text-decoration: none;
      }
    }
  `

  return html`
    <div class=${style} onload=${editUserState.loaded ? null : loadRegionData()}>
      ${navbar(state.ccs.user.name, state.ccs.ui.manageUsers.newRequests.length)}
      <section id="content">
        <section id="content-top">
          <button class="white-button" onclick=${back}>Back to user list</button>
          <h1>Edit ${name}'s user account</h1>
          <p>Create an account for Case Managers, Justice Officers, Community Work Officers, and any other CCS staff who need to send SMS/web reminders to clients.</p>
          <button style="align-self:flex-end" class="white-button" onclick=${toggleLightbox}>Disable this user</button>
          ${editUserState.lightbox ? html`<div class="lightbox">
                                                <div id="delete-prompt">
                                                  Are you sure you want to remove this person's access from Orion?
                                                  <div>
                                                    <button class="white-button" onclick=${toggleLightbox}>Cancel</button>
                                                    <button class="blue-button" onclick=${disableAccount}>Disable user</button>
                                                  </div>
                                                </div>
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
            <input id="region" disabled value="${region}">
            ${state.ccs.ui.editUser.locations !== '' ? displayLocations() : null}
          </div>
          <div id="account-settings">
            <div id="user-role">
              <h3>Manage account settings</h3>
              <label>User role ${hoverInfo('Actual copy here')}</label>
              <select id="role" onchange=${updateInput}>
                <option ${role === 'User' ? 'selected' : null}>User</option>
                <option ${role === 'Admin' ? 'selected' : null}>Admin</option>
              </select>
              <label id="password">Password</label>
              <input type="password" value="notarealpw" disabled />
              <button class="white-button" id="password-reset">
                <img src="../../assets/padlock.png" />
                Reset password
              </button>
            </div>
            <div id="submit">
              <span onclick=${back}>Cancel</span>
              <button class="blue-button">Save changes</button>
            </div>
            <div id="complete">
              <h3>${name}'s access granted</h3>
              <img src="../../assets/tick.png" />
            </div>
          </div>
        </section>
      </section>
    </div>
  `

  function loadRegionData () {
    emit('loadRegionData', 'editUser')
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

  function disableAccount () {
    emit('disableAccount')
  }

  function toggleLightbox () {
    emit('toggleLightbox', 'editUser')
  }

  function updateInput (e) {
    emit('updateInput', {user: 'ccs', template: 'editUser', target: e.target.id, text: e.target.value})
  }

  function toggleDisplayInfo (e) {
    var el = document.getElementById('info')

    if (el.style.display === 'flex') {
      el.style.display = 'none'
    } else {
      el.style.display = 'flex'
      el.style.top = e.clientY - 25 + 'px'
      el.style.left = e.clientX + 'px'
    }
  }

  function back () {
    emit('pushState', '/ccs/admin/manageusers')
  }
}
