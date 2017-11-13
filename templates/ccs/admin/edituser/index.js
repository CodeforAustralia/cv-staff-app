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

// export module
module.exports = function (state, emit) {
  var givenName = state.ui.editUser.givenName
  var lastName = state.ui.editUser.lastName
  var email = state.ui.editUser.email
  var region = state.ui.editUser.region
  var location = state.ui.editUser.location
  var role = state.ui.editUser.role

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
      #info {
        background-color: #fff;
        border: 2px #e0e0e0 solid;
        display: none;
        height: 20px;
        position: absolute;
        width: 200px;
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
    <div class=${style}>
      ${navbar(state.user.name, state.ui.manageUsers.newRequests.length)}
      <section id="content">
        <section id="content-top">
          <button class="white-button" onclick=${back}>Back to user list</button>
          <h1>Edit ${name}'s user account</h1>
          <p>Create an account for Case Managers, Justice Officers, Community Work Officers, and any other CCS staff who need to send SMS/web reminders to clients.</p>
          <button style="align-self:flex-end" class="white-button" onclick=${toggleLightbox}>Disable this user</button>
          ${state.ui.editUser.lightbox ? html`<div class="lightbox">
                                                <div id="delete-prompt">
                                                  Are you sure you want to remove this person's access from Orion?
                                                  <div>
                                                    <button class="white-button" onclick=${toggleLightbox}>Cancel</button>
                                                    <button class="blue-button">Disable user</button>
                                                  </div>
                                                </div>
                                              </div>` : null}
        </section>
        <section id="add-user">
          <div id="user-details">
            <h3>User's details</h3>
            <label>Given Name</label>
            <input type="text" value=${givenName} id="givenName" oninput=${updateInput} />
            <label>Last Name</label>
            <input type="text" value=${lastName} id="lastName" oninput=${updateInput} />
            <label>Email</label>
            <input type="text" value=${email} id="email" oninput=${updateInput} />
            <label>Region</label>
            <select id="region" onchange=${updateInput}>
              <option disabled ${region ? null : 'selected'}></option>
              <option ${region ? 'selected' : null}>North West Metro</option>
            </select>
            <label>Location</label>
            <select id="location" onchange=${updateInput}>
              <option disabled ${location ? null : 'selected'}></option>
              <option ${location ? 'selected' : null}>Sunshine</option>
            </select>
          </div>
          <div id="account-settings">
            <div id="user-role">
              <h3>Manage account settings</h3>
              <label>User role <img id="info-icon" src="../../assets/information.png" onmouseover=${toggleDisplayInfo} onmouseout=${toggleDisplayInfo} /></label>
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
              <button class="blue-button">Create account</button>
            </div>
            <div id="complete">
              <h3>${name}'s access granted</h3>
              <img src="../../assets/tick.png" />
            </div>
          </div>
        </section>
      </section>
      <div id="info">Insert actual copy here</div>
    </div>
  `

  function toggleLightbox () {
    emit('toggleLightbox', 'editUser')
  }

  function updateInput (e) {
    emit('updateInput', {template: 'editUser', target: e.target.id, text: e.target.value})
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
