// require dependencies
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

// request messages from API
function getLocations (cb, data) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      var arr = JSON.parse(xmlHttp.responseText)
      arr.sort(function (a, b) {
        return (a.SiteName > b.SiteName) - (a.SiteName < b.SiteName)
      })
      cb(arr)
    } else if (xmlHttp.status !== 200) {
      // do something
    }
  }

  xmlHttp.open('GET', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/location${data ? `/region/${data}` : ''}`, true)
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

  xmlHttp.open('GET', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/staff/type/Admin`, true)
  xmlHttp.withCredentials = true
  xmlHttp.setRequestHeader('Authorization', 'Basic cm9vdDpwYXNz')
  xmlHttp.setRequestHeader('Accept', 'application/json')
  xmlHttp.setRequestHeader('Content-Type', 'application/json')
  xmlHttp.send(null)
}

function getStaff (cb, data) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      var obj = JSON.parse(xmlHttp.responseText)
      var arr = []
      obj.forEach(function (el) {
        arr.push({
          name: `${el.FirstName} ${el.LastName}`,
          email: el.email,
          location: el.SiteName,
          region: el.RegionName,
          role: el.UserRole
        })
      })
      cb(arr)
    } else if (xmlHttp.status !== 200) {
      // do something
    }
  }

  xmlHttp.open('GET', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/staff/location/${data.location}`, true)
  xmlHttp.withCredentials = true
  xmlHttp.setRequestHeader('Authorization', 'Basic cm9vdDpwYXNz')
  xmlHttp.setRequestHeader('Accept', 'application/json')
  xmlHttp.setRequestHeader('Content-Type', 'application/json')
  xmlHttp.send(null)
}

function getRegions (cb) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      var arr = JSON.parse(xmlHttp.responseText)
      arr.sort(function (a, b) {
        return (a.RegionName > b.RegionName) - (a.RegionName < b.RegionName)
      })
      cb(arr)
    } else if (xmlHttp.status !== 200) {
      // do something
    }
  }

  xmlHttp.open('GET', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/region`, true)
  xmlHttp.withCredentials = true
  xmlHttp.setRequestHeader('Authorization', 'Basic cm9vdDpwYXNz')
  xmlHttp.setRequestHeader('Accept', 'application/json')
  xmlHttp.setRequestHeader('Content-Type', 'application/json')
  xmlHttp.send(null)
}

function getNewRequests (cb, data) {
  var xmlHttp = new XMLHttpRequest()

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      var obj = JSON.parse(xmlHttp.responseText)
      var arr = []
      obj.forEach(function (el) {
        arr.push({
          name: `${el.FirstName} ${el.LastName}`,
          email: el.email,
          location: el.SiteName,
          region: el.RegionName,
          role: ''
        })
      })
      cb(arr)
    } else if (xmlHttp.status !== 200) {
      // do something
    }
  }

  xmlHttp.open('GET', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/staff/location/${data.location}/authenticate`, true)
  xmlHttp.withCredentials = true
  xmlHttp.setRequestHeader('Authorization', 'Basic cm9vdDpwYXNz')
  xmlHttp.setRequestHeader('Accept', 'application/json')
  xmlHttp.setRequestHeader('Content-Type', 'application/json')
  xmlHttp.send(null)
}

function newAccessRequest (cb, data) {
  var xmlHttp = new XMLHttpRequest()

  var params = {
    UserName: data.email,
    Password: 'initpasswd',
    Role: 'Staff',
    Location: data.location,
    FirstName: data.givenName,
    LastName: data.lastName,
    Authentication: 0}

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      var obj = JSON.parse(xmlHttp.responseText)
      cb(obj)
    } else if (xmlHttp.status !== 200) {
      // do something
    }
  }

  xmlHttp.open('POST', `http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/user/new`, true)
  xmlHttp.withCredentials = true
  xmlHttp.setRequestHeader('Authorization', 'Basic cm9vdDpwYXNz')
  xmlHttp.setRequestHeader('Accept', 'application/json')
  xmlHttp.setRequestHeader('Content-Type', 'application/json')
  xmlHttp.send(JSON.stringify(params))
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
  getStaff,
  getRegions,
  getNewRequests,
  newAccessRequest,
  findUser
}
