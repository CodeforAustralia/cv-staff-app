// require dependencies
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

module.exports = function (string) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.open('GET', string, true)
  xmlHttp.withCredentials = true
  xmlHttp.setRequestHeader('Authorization', `Basic ${process.env.API}`)
  xmlHttp.setRequestHeader('Accept', 'application/json')
  xmlHttp.setRequestHeader('Content-Type', 'application/json')
  xmlHttp.send(null)

  return xmlHttp
}
