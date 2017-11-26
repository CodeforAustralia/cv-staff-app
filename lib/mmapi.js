// require dependencies
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

// import modules
var GETRequest = require('./getRequest.js')
var POSTRequest = require('./postRequest.js')

// request messages from API
function getMessages (cb, data) {
  var req = GETRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/client/${data.JAID}/messages`)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      var obj = JSON.parse(req.responseText)
      cb(obj)
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function sendMessage (data, cb) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
    cb()
    }
  }

  xmlHttp.open('GET', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/send_message.php?JAID=${data.JAID}&to=${data.to}&from=${data.from}&content=${data.content}&response=0`, true)
  xmlHttp.send(null)
}

module.exports = {
  getMessages,
  sendMessage
}
