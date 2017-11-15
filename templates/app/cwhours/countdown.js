// require dependencies
var html = require('choo/html')
var css = require('sheetify')
var progressBar = require('progressbar.js')

// export module
module.exports = function (percentage) {
  var style = css`
    :host {
      width: 100%;
      #countdownBar {
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
    <div id="content" class=${style}>
      <div id="countdownBar"></div>
      ${runAnimate()}
    </div>
  `

  function runAnimate() {
    setTimeout(function () {
      var bar = new progressBar.Circle('#countdownBar', {
        color: '#00a1f1',
        trailColor: '#e5e5e5',
        strokeWidth: 3,
        trailWidth: 3,
        easing: 'easeInOut',
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
