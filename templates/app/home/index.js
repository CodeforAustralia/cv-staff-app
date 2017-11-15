// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// export module
module.exports = function () {
  var style = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin: auto;
      max-width: 700px;
    }

    :host > div {
      border: 1px #6f6e75 solid;
      border-radius: 0.5rem;
      margin: 0.5rem;
      padding: 1rem;
      text-align: center;
    }

    :host > div > a {
      color: #6f6e75;
      font-size: 2rem;
      text-decoration: none;
    }
  `

  return html`
    <container class=${style}>
      <div>
        <a href="/reminders">Reminders</a>
      </div>
      <div>
        <a href="/cwhours">Community Work Hours Countdown</a>
      </div>
      <div>
        <a href="/test">Test an SMS</a>
      </div>
    </container>
  `
}
