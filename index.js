// require dependencies
var choo = require('choo')
var reload = require('choo-reload')
var css = require('sheetify')

// initialise app
var app = choo()

app.use(reload())

// declare state
app.use(require('./state'))

// import stylesheets
css('./assets/normalize.css')
css('./assets/style.css')

const auth = function (view) {
  return function (state, emit) {
    if (window.localStorage.getItem('auth') !== null) {
      var now = new Date().getTime()
      if (now - window.localStorage.getItem('auth') < 24*60*60*1000) {
        return view(state, emit)
      } else {
        window.localStorage.removeItem('auth')
        emit('pushState', '/ccs/login')
        return loginView(state, emit)
      }
    } else {
      emit('pushState', '/ccs/login')
      return loginView(state, emit)
    }
  }
}

var loginView = require('./templates/ccs/login')

// declare routes
app.route('/', require('./templates/app/home'))
app.route('/reminders', require('./templates/app/reminders'))
app.route('/cwhours', require('./templates/app/cwhours'))
app.route('/test', require('./templates/app/test'))
app.route('/ccs', require('./templates/ccs/home'))
app.route('/ccs/administrators', require('./templates/ccs/administrators'))
app.route('/ccs/dashboard', auth(require('./templates/ccs/dashboard')))
app.route('/ccs/clientlist', auth(require('./templates/ccs/clientlist')))
app.route('/ccs/search', auth(require('./templates/ccs/search')))
app.route('/ccs/groups', auth(require('./templates/ccs/groups')))
app.route('/ccs/login', require('./templates/ccs/login'))
app.route('/ccs/setpassword', require('./templates/ccs/setpassword'))
app.route('/ccs/admin/manageusers', auth(require('./templates/ccs/admin/manageusers')))
app.route('/ccs/admin/adduser', auth(require('./templates/ccs/admin/adduser')))
app.route('/ccs/admin/edituser', auth(require('./templates/ccs/admin/edituser')))
app.route('/ccs/setreminder', require('./templates/setreminder'))
app.route('/ccs/offendersearch', require('./templates/offendersearch'))

// start app
if (typeof window !== 'undefined') {
  document.body.appendChild(app.start())
}
