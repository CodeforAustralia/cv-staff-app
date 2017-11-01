// notes:
// Help and Login divs don't do anything yet
// Placeholder images
// Administrator link doesn't do anything
// Form validation
// Display list of locations
// Request access button doesn't do anything

// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// import modules
var api = require('../../lib/api')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      font-family: Helvetica;
      line-height: 1.5;
      #navbar {
        background-color: #191934;
        color: #fff;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        #logo {
          display: flex;
          flex-direction: column;
          font-size: 0.65rem;
          justify-content: center;
          margin: 0.5rem 1rem;
          img {  height: 1rem;  }
          p {  margin: 0;  }
        }
        #navbar-right {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          #help {
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 0.5rem;
          }
        }
      }
      #content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        max-width: 1100px;
        margin: auto;
        #content-left {
          margin: 3rem 0 0 1rem;
          width: 50%;
          #features {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            .feature {
              font-size: 0.75rem;
              font-weight: bold;
              margin-right: 1rem;
              width: 33%;
              .placeholder {
                background-color: #d7d7d7;
                height: 5rem;
                width: 100%
              }
            }
          }
          #contact {
            font-size: 0.75rem;
            width: 60%;
            a, a:visited {
              color: #498fe1;
              font-weight: bold;
              text-decoration: none;
            }
          }
        }
        #content-right {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-left: 1rem;
          width: 50%;
          #create-account {
            border: 1px solid black;
            padding: 1rem 2rem;
            input {  width: 100%;  }
            p {
              font-size: 0.75rem;
              font-weight: bold;
              margin-bottom: 0.5rem;
            }
            select {  width: 100%;  }
            #name-input {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              div:first-child {  margin-right: 1rem;  }
              div {  width: 50%;  }
            }
            #multiple-locations {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              margin-top: 1rem;
              img {  height: 1rem;  }
              p {
                font-weight: normal;
                margin: 0 0 0 0.5rem;
              }
            }
            #button-container {
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              margin-top: 1rem;
            }
          }
        }
      }
    }

    .button {
      background-color: #498fe1;
      color: #fff;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0.5rem;
      padding: 0.5rem 1.5rem;
      width: max-content;
    }
  `

  return html`
    <div class=${style} onload=${state.ui.home.loaded ? null : emit('loadLocations')}>
      <div id="navbar">
        <div id="logo">
          <img src="../../assets/logo.png" />
          <p>for CCS staff</p>
        </div>
        <div id="navbar-right">
          <div id="help">
            Help
          </div>
          <div class="button">
            Log in
          </div>
        </div>
      </div>
      ${state.ui.home.loaded ? html`
        <div id="content">
          <div id="content-left">
            <h1>Communicate with your clients</h1>
            <p>Another line summarising the benefits of <strong>Orion for CCS staff.</strong></p>
            <div id="features">
              <div class="feature">
                <div class="placeholder"></div>
                <p>Easily schedule reminders for supervision appointments in advance.</p>
              </div>
              <div class="feature">
                <div class="placeholder"></div>
                <p>Set up community work reminders to be sent automatically.</p>
              </div>
              <div class="feature">
                <div class="placeholder"></div>
                <p>Communicate with clients via SMS or web app.</p>
              </div>
            </div>
            <h2>How can I get access?</h2>
            <p>
              If you have a:<br />
              - login to eJustice, and <br />
              - a justice.vic.gov.au email address <br />
              we can set you up with an account.
            </p>
            <p id="contact">You can also contact <a href="#">the administrator</a> for your office directly. They'll be the one who sets up your account.</p>
          </div>
          <div id="content-right">
            <h2>Get started - Create an account</h2>
            <div id="create-account">
              <div id="name-input">
                <div>
                  <p>Your given name</p>
                  <input type="text" />
                </div>
                <div>
                  <p>Your family name</p>
                  <input type="text" />
                </div>
              </div>
              <p>Your work email address</p>
              <input type="text" placeholder="Use your justice.vic.gov.au email address" />
              <p>Your office</p>
              ${printLocations()}
              <div id="multiple-locations">
                <img src="../../assets/information.png" />
                <p> If you work in more than one office in a region, just choose one.</p>
              </div>
              <div id="button-container">
                <div class="button">
                Request access
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : null}
    </div>
  `

  function printLocations() {
    if (state.ui.home.loaded) {
      return html`
        <select name="location">
          ${state.locations.map(function (el) {
            return html`
              <option value="${el}">${el}</option>
            `
          })}
        </select>
      `
    }
  }
}
