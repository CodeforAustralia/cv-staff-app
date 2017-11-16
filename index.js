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
    if (state.authenticated) {
      return view(state, emit)
    } else {
      emit('pushState', '/ccs')
      return loginView(state, emit)
    }
  }
}

var loginView = require('./templates/ccs/home')

// declare routes
app.route('/', require('./templates/app/home'))
app.route('/reminders', require('./templates/app/reminders'))
app.route('/cwhours', require('./templates/app/cwhours'))
app.route('/test', require('./templates/app/test'))
app.route('/ccs', require('./templates/ccs/home'))
app.route('/ccs/administrators', require('./templates/ccs/administrators'))
app.route('/ccs/dashboard', auth(require('./templates/ccs/dashboard')))
app.route('/ccs/admin/manageusers', auth(require('./templates/ccs/admin/manageusers')))
app.route('/ccs/admin/adduser', auth(require('./templates/ccs/admin/adduser')))
app.route('/ccs/admin/edituser', auth(require('./templates/ccs/admin/edituser')))
app.route('/ccs/setreminder', require('./templates/setreminder'))
app.route('/ccs/offendersearch', require('./templates/offendersearch'))

// start app
if (typeof window !== 'undefined') {
  document.body.appendChild(app.start())
}
