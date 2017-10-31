// notes:
// Help and Login divs don't do anything yet
// Placeholder images
// Administrator link doesn't do anything

// require dependencies
var html = require('choo/html')
var css = require('sheetify')

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
          font-size: 0.65rem;
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
          #login {
            background-color: #498fe1;
            color: #fff;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 0.5rem;
            padding: 0 1.5rem;
          }
        }
      }
      #content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        max-width: 1000px;
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
              text-decoration: none;
            }
          }
        }
        #content-right {
          width: 50%;
        }
      }
    }
  `
  return html`
    <div class=${style}>
      <div id="navbar">
        <div id="logo">
          <img src="../../assets/logo.png" />
          <p>for CCS staff</p>
        </div>
        <div id="navbar-right">
          <div id="help">
            Help
          </div>
          <div id="login">
            Log in
          </div>
        </div>
      </div>
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
        </div>
      </div>
    </div>
  `
}
