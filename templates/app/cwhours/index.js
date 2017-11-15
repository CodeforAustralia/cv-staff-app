// require dependencies
var html = require('choo/html')
var css = require('sheetify')
var progressBar = require('progressbar.js')

// export module
module.exports = function () {
  var style = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin: auto;
      max-width: 700px;
      h2 { text-align: center; }
      #container {
        height: 300px;
        margin: auto;
        width: 300px;
        .progressbar-text > span {
          display: flex;
          flex-direction: column;
          span { margin: auto; }
          #complete {
            font-size: 6rem;
            margin: -2rem 0 -1rem 0;
          }
          #remaining { color: #616069; }
        }
      }
    }
  `

  return html`
    <div class=${style}>
        <h2>Community Work Hours Remaining</h2>
        <div id="container"></div>
        ${runAnimate()}
    </div>
  `

  function runAnimate() {
    setTimeout(function () {
      var bar = new progressBar.Circle('#container', {
        color: '#00a1f1',
        trailColor: '#e5e5e5',
        strokeWidth: 3,
        trailWidth: 3,
        easing: 'linear',
        text: {
          value: html`
            <span>
              <span id="complete">75</span>
              <span>hours complete</span>
              <span id="remaining">25 hours to go</span>
            </span>
          `
        }
      })
      bar.animate(.75)
    }, 100)
  }
}
