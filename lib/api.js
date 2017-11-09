// require dependencies
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

// request messages from API
function getLocations (cb) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      var obj = JSON.parse(xmlHttp.responseText)
      var locations = []
      obj.forEach(function (el) {
        locations.push(el.SiteName)
      })
      cb(locations.sort())
    } else if (xmlHttp.status !== 200) {
      // do something
    }
  }

  xmlHttp.open('GET', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/location`, true)
  xmlHttp.withCredentials = true
  xmlHttp.setRequestHeader('Authorization', 'Basic cm9vdDpwYXNz')
  xmlHttp.setRequestHeader('Accept', 'application/json')
  xmlHttp.setRequestHeader('Content-Type', 'application/json')
  xmlHttp.send(null)
}

function getAdministrators (cb) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      var obj = JSON.parse(xmlHttp.responseText)
      var administrators = []
      obj.forEach(function (el) {
        administrators.push({
          administrator: `${el.FirstName} ${el.LastName}`,
          location: el.SiteName,
          region: el.RegionName,
          email: el.Username
        })
      })
      cb(administrators)
    } else if (xmlHttp.status !== 200) {
      // do something
    }
  }

  xmlHttp.open('GET', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/user/type/admin`, true)
  xmlHttp.withCredentials = true
  xmlHttp.setRequestHeader('Authorization', 'Basic cm9vdDpwYXNz')
  xmlHttp.setRequestHeader('Accept', 'application/json')
  xmlHttp.setRequestHeader('Content-Type', 'application/json')
  xmlHttp.send(null)
}

function findUser (cb, data) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      var obj = JSON.parse(xmlHttp.responseText)
      cb(obj)
    } else if (xmlHttp.status !== 200) {
      // do something
    }
  }

  xmlHttp.open('GET', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/user/${data.email}`, true)
  xmlHttp.withCredentials = true
  xmlHttp.setRequestHeader('Authorization', 'Basic cm9vdDpwYXNz')
  xmlHttp.setRequestHeader('Accept', 'application/json')
  xmlHttp.setRequestHeader('Content-Type', 'application/json')
  xmlHttp.send(null)
}

module.exports = {
  getLocations,
  getAdministrators,
  findUser
}
