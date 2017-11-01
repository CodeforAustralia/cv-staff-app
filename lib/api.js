// require dependencies
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

// request messages from API
function getLocations (cb) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      var obj = JSON.parse(xmlHttp.responseText)
      var locations = []
      obj.Locations.forEach(function (el) {
        locations.push(el.SiteName)
      })
      cb(locations.sort())
    }
  }

  xmlHttp.open('GET', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/location_obj.php`, true)
  xmlHttp.send(null)
}

module.exports = {
  getLocations
}
