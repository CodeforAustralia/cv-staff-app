// require dependencies
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

// request messages from API
function getMessages (data, cb) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      var obj = JSON.parse(xmlHttp.responseText)
      cb(obj)
    }
  }

  xmlHttp.open('GET', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/client_obj.php?JAID=${data.JAID}`, true)
  xmlHttp.send(null)
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
