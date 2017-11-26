// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// import templates
var style = css('./style.css')

module.exports = function (username, numRequests) {

  return html`
    <div class=${style}>
      <div id="navbar">
        <div id="navbar-left">
          <a href="/ccs" id="logo">
            <img src="../../assets/logo.png" />
            <p>for CCS staff</p>
          </a>
          <div class="nav-path"><a href="/ccs/dashboard">Dashboard</a></div>
          <div class="nav-path"><a href="#">Reminders</a></div>
          <div class="nav-path"><a href="/ccs/clientlist">Clients</a></div>
        </div>
        <div id="navbar-right" onclick=${update}>
          <div id="dropdown">
            <div id="user">
              ${username}
              <img src="../../assets/sort-down-white.png" />
            </div>
            <div id="role">
              Admin
            </div>
          </div>
        </div>
      </div>
      <ul onmouseleave=${update}>
        <li><a href="#">Your profile</a></li>
        <li>
          <a href="/ccs/admin/manageusers">Manage users
            ${numRequests === 0 ? null : html`<span id="newRequests">${numRequests}</span>`}
          </a>
        </li>
        <li><a href="#">Templates</a></li>
        <li><a href="#">Help</a></li>
        <li><a href="#">Log out</a></li>
      </ul>
    </div>
  `

  function update() {
    var elList = document.querySelectorAll('li')
    var list = document.querySelector('ul')

    elList.forEach(function (el) {
      el.style.display = el.style.display === 'flex' ? 'none' : 'flex'
    })

    list.style.border = list.style.border === '' ? '1px #8a8b9a solid' : ''
  }
}
