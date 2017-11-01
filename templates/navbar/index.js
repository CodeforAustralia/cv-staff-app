// require dependencies
var html = require('choo/html')
var css = require('sheetify')

module.exports = function () {
  var style = css`
    :host {
      font-family: Helvetica;
      line-height: 1.5;
    }
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
  `

  return html`
    <div id="navbar" class=${style}>
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
  `
}
