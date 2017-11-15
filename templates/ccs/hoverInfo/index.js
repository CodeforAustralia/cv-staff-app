// require dependencies
var html = require('choo/html')
var css = require('sheetify')

module.exports = function (hoverText) {
  var style = css`
    :host {
      margin: 0 0.5rem;
      img { height: 1rem; }
      #info {
        background-color: #fff;
        border: 2px #e0e0e0 solid;
        display: none;
        max-width: 300px;
        position: absolute;
      }
    }
  `

  return html`
    <div class="${style}">
      <img src="../../assets/information.png" onmouseover=${toggleDisplayInfo} onmouseout=${toggleDisplayInfo} />
      <div id="info">${hoverText}</div>
    </div>
  `

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
}
