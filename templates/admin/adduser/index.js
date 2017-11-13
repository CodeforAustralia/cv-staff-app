// notes
// what does the cancel button do?
// need to pull locations and regions
// what's displayed over the information hover?
// need to add user to database

// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../../navbar/admin.js')

// export module
module.exports = function (state, emit) {
  var name = state.ui.addUser.name
  var email = state.ui.addUser.email
  var region = state.ui.addUser.region
  var location = state.ui.addUser.location
  var role = state.ui.addUser.role
  var error = state.ui.addUser.error

  var style = css`
    :host {
      #content {
        margin: auto;
        margin-top: 4rem;
        max-width: 1100px;
        #content-top { width: 70%; }
        #add-user {
          border: 2px #e0e0e0 solid;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          width: 70%;
          h3 {
            color: #000;
          }
          #user-details {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
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
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 50%;
            #user-role {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              padding: 1.5rem;
              img {
                height: 1rem;
              }
              select {
                background-color: #fff;
              }
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
              a, a:visited {
                color: #498fe1;
                text-decoration: none;
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
    }
  `

  return html`
    <div class=${style} onload=${state.ui.addUser.loaded ? null : loadRegions()}>
      ${navbar(state.user.name, state.ui.manageUsers.newRequests.length)}
      <section id="content">
        <section id="content-top">
          <button class="white-button" onclick=${back}>Back to user list</button>
          <h1>Add new user</h1>
          <p>Create an account for Case Managers, Justice Officers, Community Work Officers, and any other CCS staff who need to send SMS/web reminders to clients.</p>
        </section>
        <section id="add-user">
          <div id="user-details">
            <h3>User's details</h3>
            <label>Name</label>
            <input type="text" value=${name} id="name" oninput=${updateInput} />
            <label>Email</label>
            <input type="text" value=${email} id="email" oninput=${updateInput} />
            <label>Region</label>
            ${state.ui.addUser.loaded ? displayRegions() : null}
            ${region ? displayLocations() : null}
          </div>
          <div id="account-settings">
            <div id="user-role">
              <h3>Manage account settings</h3>
              <label>User role <img id="info-icon" src="../../assets/information.png" onmouseover=${toggleDisplayInfo} onmouseout=${toggleDisplayInfo} /></label>
              <select id="role" onchange=${updateInput}>
                <option ${role === 'User' ? 'selected' : null}>User</option>
                <option ${role === 'Admin' ? 'selected' : null}>Admin</option>
              </select>
              <p>Most CCS staff who use Orion will be Users.</p>
            </div>
            ${error ? displayError() : null}
            <div id="submit">
              <a href="#">Cancel</a>
              <button class="blue-button" style="align-self:flex-end" onclick=${validateInput}>Create account</button>
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

  function displayLocations () {
    emit('loadLocationsForRegion', region)
    return state.ui.addUser.locations ? html`
      <div>
        <label>Location</label>
        <select id="location" onchange=${updateInput}>
          <option disabled ${location ? null : 'selected'}></option>
          ${state.ui.addUser.locations.map(function (el) {
            return html`<option ${el.SiteName === location ? 'selected' : null}>${el.SiteName}</option>`
          })}
        </select>
        <p>If the CCS staff member works at more than one office, just choose one.</p>
      </div>` : null

  }

  function displayRegions () {
    return html`
      <select id="region" onchange=${updateInput}>
        <option disabled ${region ? null : 'selected'}></option>
        ${state.ui.addUser.regions.map(function (el) {
          return html`<option ${el.RegionName === region ? 'selected' : null}>${el.RegionName}</option>`
        })}
      </select>
    `
  }

  function loadRegions () {
    emit('loadRegions', 'addUser')
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
    if (!name) {
      errorMessage = 'Please enter a name'
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
      var submit = document.getElementById('submit')
      var complete = document.getElementById('complete')
      submit.style.display = 'none'
      complete.style.display = 'flex'
      emit('grantAccess')
    }
  }

  function updateInput (e) {
    emit('updateInput', {template: 'addUser', target: e.target.id, text: e.target.value})
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
    emit('pushState', '/admin/manageusers')
  }
}
