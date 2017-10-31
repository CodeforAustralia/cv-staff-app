// notes:
// Help and Login divs don't do anything yet

// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      font-family: Helvetica;
      margin: auto;
      max-width: 900px;
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
    </div>
  `
}
