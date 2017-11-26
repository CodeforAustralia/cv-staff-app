// import modules
var GETRequest = require('./getRequest.js')
var POSTRequest = require('./postRequest.js')

// request messages from API
function getLocations (cb, data) {
  var req = GETRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/location${data ? `/region/${data}` : ''}`)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      var arr = JSON.parse(req.responseText)

      arr.sort(function (a, b) {
        return (a.SiteName > b.SiteName) - (a.SiteName < b.SiteName)
      })
      cb(arr)
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function getAdministrators (cb) {
  var req = GETRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/staff/type/Admin`)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      var obj = JSON.parse(req.responseText)
      var administrators = []
      obj.forEach(function (el) {
        administrators.push({
          administrator: `${el.FirstName} ${el.LastName}`,
          location: el.SiteName,
          region: el.RegionName,
          email: el.email
        })
      })
      cb(administrators)
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function getStaff (cb, data) {
  var req = GETRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/staff/location/${data.location}`)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      var obj = JSON.parse(req.responseText)
      var arr = []
      obj.forEach(function (el) {
        arr.push({
          username: el.Username,
          name: `${el.FirstName} ${el.LastName}`,
          givenName: el.FirstName,
          lastName: el.LastName,
          email: el.email,
          location: el.SiteName,
          region: el.RegionName,
          role: el.UserRole
        })
      })
      cb(arr)
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function getRegions (cb) {
  var req = GETRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/region`)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      var arr = JSON.parse(req.responseText)
      cb(arr)
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function getRegionData (cb, data) {
  var req = GETRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/region/${data}`)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      var arr = JSON.parse(req.responseText)
      cb(arr[0])
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function getNewRequests (cb, data) {
  var req = GETRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/staff/location/${data.location}/authenticate`)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      var obj = JSON.parse(req.responseText)
      var arr = []
      obj.forEach(function (el) {
        arr.push({
          username: el.Username,
          name: `${el.FirstName} ${el.LastName}`,
          givenName: el.FirstName,
          lastName: el.LastName,
          email: el.email,
          location: el.SiteName,
          region: el.RegionName,
          role: ''
        })
      })
      cb(arr)
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function newUser (cb, data) {
  var req = POSTRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/user/new`, data)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      var obj = JSON.parse(req.responseText)
      cb(obj)
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function findUser (cb, data) {
  var req = GETRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/user/${data.Username}`)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      var obj = JSON.parse(req.responseText)
      cb(obj)
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function deleteAccessRequest (cb, data) {
  var req = POSTRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/staff/delete`, data)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      cb()
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function grantAccess (cb, data) {
  var req = POSTRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/staff/authenticate`, data)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      cb()
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function disableAccount (cb, data) {
  var req = POSTRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/staff/authenticate`, data)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      cb()
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function findSalt (cb, data) {
  var req = GETRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/user/salt/${data.Username}`)

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      cb(req.responseText)
    } else if (req.status !== 200) {
      // do something
    }
  }
}

function login (cb, data) {
  var req = POSTRequest(`http://ec2-54-66-246-123.ap-southeast-2.compute.amazonaws.com/brian/src/public/user/login`, data)

  xmlHttp.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      cb(req.responseText)
    } else if (req.status !== 200) {
      // do something
    }
  }
}

module.exports = {
  getLocations,
  getAdministrators,
  getStaff,
  getRegions,
  getRegionData,
  getNewRequests,
  newUser,
  findUser,
  deleteAccessRequest,
  grantAccess,
  disableAccount,
  findSalt,
  login
}
