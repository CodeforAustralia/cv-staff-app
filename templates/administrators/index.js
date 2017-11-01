// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// require modules
var navbar = require('../navbar')

// export module
module.exports = function (state, emit) {
  var style = css`
    :host {
      font-family: Helvetica;
      line-height: 1.5;
      #content {
        margin: auto;
        max-width: 1100px;
        #content-top {
          display: flex;
          flex-direction: row;
          justify-content: center;
          #content-top-left {
            margin: 6rem 3rem 0 0;
            width: 50%;
            p { margin-bottom: 0; }
          }
          #content-top-right {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            width: 30%;
            #help {
              background-color: #f8f8f8;
              border: 1px #d7d7d7 solid;
              padding: 0.5rem 0.75rem;
              h3 {
                color: #000;
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }
  `

  return html`
    <div class=${style}>
      ${navbar()}
      <div id="content">
        <div id="content-top">
          <div id="content-top-left">
              <h1>Find your Orion administrator</h1>
              <p>Need help logging in? Forgot your password? Need to access files from another region? Contact the Orion administrator in the relevant location.</p>
          </div>
          <div id="content-top-right">
            <div id="help">
              <h3>Need help?</h3>
              <p>Your administrator in the Ballarat Office is John Jennings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}
