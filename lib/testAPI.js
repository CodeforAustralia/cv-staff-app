// require dependencies
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

// send message from API
module.exports = function (data, cb) {
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function (data) {
    cb()
  }

  xmlHttp.open('GET', `https://cors.io/?https://samaradionne.com/brian2/showcase.php?to=${data.to}&from=${data.from}&content=${data.newMessage}`, true)
  xmlHttp.send(null)
}
