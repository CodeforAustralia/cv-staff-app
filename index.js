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

// declare routes
app.route('/setreminder', require('./templates/setreminder'))

// start app
document.body.appendChild(app.start())
