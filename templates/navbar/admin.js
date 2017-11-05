// require dependencies
var html = require('choo/html')
var css = require('sheetify')

module.exports = function (username, numRequests) {
  var style = css`
    :host {
      background-color: #191934;
      color: #fff;
      display: flex;
      flex-direction: row;
      font-family: Helvetica;
      justify-content: space-between;
      line-height: 1.5;
      #navbar-left {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        #logo {
          display: flex;
          flex-direction: column;
          font-size: 0.65rem;
          justify-content: center;
          margin: 0.5rem 1rem;
          img {  height: 1rem;  }
          p {  margin: 0;  }
        }
        .nav-path {
          cursor: pointer;
          margin: auto;
          margin-left: 3rem;
        }
      }
      #navbar-right {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 1.2;
        #user {
          margin-right: 1rem;
          img {
            height: 0.75rem;
            margin-left: 0.5rem;
          }
        }
        #role {
          color: #8a8b9a;
          font-size: 0.75rem;
        }
      }
    }

    ul > li {
      background-color: #fff;
      display: none;
      list-style: none;
    }

    ul {
      border-radius: 3px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      float: right;
      justify-content: flex-start;
      margin: 0;
      padding: 0;
      position: absolute;
      right: 3px;
      width: max-content;
      li {
        display: none;
        list-style: none;
        padding: 0.5rem 1rem;
        a, a:visited {
          color: #000;
          font-family: Helvetica;
          font-weight: bold;
          text-decoration: none;
          span {
            background-color: #e9e9e9;
            border-radius: 10px;
            color: #969696;
            padding: 0.25rem 0.5rem;
          }
        }
      }
      li:hover {
        background-color: #498fe1;
        a {
          color: #fff;
        }
      }
      li:first-child {
        padding-top: 1rem;
      }
      li:last-child {
        padding-bottom: 1rem;
        a {
          border-top: 1px #8a8b9a solid;
        }
      }
    }
  `

  return html`
    <div>
      <div class=${style}>
        <div id="navbar-left">
          <div id="logo">
            <img src="../../assets/logo.png" />
            <p>for CCS staff</p>
          </div>
          <div class="nav-path">Dashboard</div>
          <div class="nav-path">Reminders</div>
          <div class="nav-path">Clients</div>
        </div>
        <div id="navbar-right" class="sub-menu" onclick=${update}>
          <div id="user">
            ${username}
            <img src="../../assets/sort-down-white.png" />
          </div>
          <div id="role">
            Admin
          </div>
        </div>
      </div>
      <ul onmouseleave=${update}>
        <li><a href="#">Your profile</a></li>
        <li>
          <a href="/admin/manageusers">Manage users
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
