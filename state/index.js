var ccsapi = require('../lib/ccsapi')
var api = require('../lib/api')
var crypto = require('crypto')

module.exports = function (state, emitter) {
  // run on app start
  initialise()

  function initialise () {
    // these will be deleted when refactoring setreminder template
    state.static = {
      appointmentTypes: ['Community Work', 'Program'],
      messageTypes: ['Reminder', 'Cancellation'],
      templates: {
        'Reminder': {
          'Community Work': 'You are required to attend work at ',
          'Program': 'You are required to attend an appointment at '
        },
        'Cancellation': {
          'Community Work': 'Your community work at ',
          'Program': 'Your appointment at '
        }
      },
      rescheduleText: 'Please text N if you need to reschedule.'
    }
    state.lightbox = false
    state.newRecipient = {
      name: '',
      phone: '',
      location: '',
      programs: []
    }
    state.region = {
      name: 'Grampians',
      locations: [{
        'name': 'Ballarat',
        'address': 'CCS 206 Mair Street, Ballarat Central',
        'staff': ['Loretta Moe', 'Elisha Brasier', 'Gema Houseknecht', 'Amiee Sedlacek', 'Boyd Greeson', 'Myles Tezeno', 'Magaly Aldana']
      }, {
        'name': 'Horsham',
        'address': 'CCS 21 McLachlan Street, Horsham',
        'staff': ['Jeromy Seawell', 'Anh Kelsch', 'Regine Roque']
      }],
      CWprograms: [{
          name: 'St Vincent De Paul Friday InHouse Program',
          address: '17 Goodyear Drive, Thomastown',
          info: 'Please bring your lunch with you.'
        }, {
          name: 'Woodwork',
          address: '206 Mair Street, Ballarat Central',
          info: 'Please bring your lunch with you. Enclosed shoes must be worn.'
        }, {
          name: 'Stitch Picking',
          address: '21 McLachlan Street, Horsham',
          info: 'Please bring your lunch with you.'
        }],
      offenders: [
        {
          name: 'Amin Min',
          phone: '0400 000 000',
          location: 'Ballarat',
          programs: ['St Vincent De Paul Friday InHouse Program', 'Woodwork']
        }, {
          name: 'Bob Marley',
          phone: '0411 111 111',
          location: 'Ballarat',
          programs: ['St Vincent De Paul Friday InHouse Program']
        }, {
          name: 'Craig Rees',
          phone: '0422 222 222',
          location: 'Ballarat',
          programs: ['St Vincent De Paul Friday InHouse Program', 'Woodwork']
        }, {
          name: 'Din Markly',
          phone: '0433 333 333',
          location: 'Ballarat',
          programs: ['Woodwork']
        }, {
          name: 'John Jones',
          phone: '0444 444 444',
          location: 'Horsham',
          programs: ['Stitch Picking']
        }, {
          name: 'Riley Soley',
          phone: '0455 555 555',
          location: 'Horsham',
          programs: []
        }
      ]
    }
    state.selected = {
      program: 'init',
      showRecipients: true
    }
    state.message = {
      address: '',
      additionalInfo: ''
    }
    state.loaded = false
    state.locations = null

    // This is where the real stuff starts
    state.ccs = {
      user: {
        name: 'Georgia Hansford',
        email: 'Georgia.hansford@justice.vic.gov.au',
        locationID: 4,
        regionID: 7,
        dedicatedNumber: '61400868219',
        role: 'Admin'
      },
      ui: {
        home: {
          loaded: false,
          givenName: '',
          lastName: '',
          email: '',
          location: '',
          error: ''
        },
        administrators: {
          loaded: false,
          sort: {
            table: {
              on: 'location',
              direction: 'asc'
            }
          },
          tableFields: ['administrator', 'location', 'region', 'email'],
          administrators: []
        },
        manageUsers: {
          loaded: false,
          pagination: {
            newRequests: 1,
            users: 1,
            pageLength: 10
          },
          sort: {
            newRequests: {
              on: 'name',
              direction: 'asc'
            },
            users: {
              on: 'name',
              direction: 'asc'
            }
          },
          tableFields: ['name', 'email', 'location', 'region', 'role', 'manage this account'],
          newRequests: [],
          users: []
        },
        addUser: {
          loaded: false,
          lightbox: false,
          givenName: '',
          lastName: '',
          email: '',
          region: '',
          location: '',
          role: 'User',
          error: '',
          requested: '',
          regions: '',
          locations: '',
          exists: false
        },
        editUser: {
          givenName: '',
          lastName: '',
          name: '',
          email: '',
          region: '',
          location: '',
          role: '',
          lightbox: false
        },
        logIn: {
          username: '',
          password: '',
          error: ''
        },
        clientList: {
          clients: [{
            name: 'Johnny Test',
            phone: '61411123333',
            JAID: 111
          }, {
            name: 'Jake Black',
            phone: '61411123333',
            JAID: 222
          }, {
            name: 'Sam Iam',
            phone: '61411123333',
            JAID: 333
          }],
          displayMessages: null,
          messages: [],
          newMessage: ''
        }
      }
    }

    state.client = {
      user: {
        phone: '61412757232',
        JAID: 111,
        locationNumber: '61400868219'
      },
      messages: [],
      newMessage: '',
      state: false,
      content: 'Hiya',
      to: '',
      from: '',
      testMessage: '',
      sent: false,
      ui: {
        cwhours: {
          active: 'countdown'
        },
        reminders: {
          messages: [],
          newMessage: '',
          loaded: false
        }
      }
    }

    state.authenticated = false
  }

// sends a new message
  emitter.on('sendSMS', function (data) {
    api.sendMessage(data.messageData, function (res) {
      if (data.user === 'client') {
        state.client.ui.reminders.newMessage = ''
        state.client.ui.reminders.loaded = false
        console.log(state.client.ui.reminders)
        emitter.emit('render')
      }
      else {
        state.ccs.ui[data.template].message = ''
        emitter.emit('getMessages', state.ccs.ui.clientList.displayMessages)
      }
    })
  })

// retrieves message history
  emitter.on('getMessages', function (data) {
    ccsapi.getMessages(function (res) {
      state.ccs.ui.clientList.messages = []
      var message
      for (message of res) {
        var newMessage = {
          content: message['MessageContents'],
          receivedOrSentDate: message['DateDelivered'],
          messageType: message['MessageType'],
          direction: message[`Outbound`] === '1' ? 'inbound' : 'outbound',
          response: message[`ResponseRequired`] === '1'
        }

        state.ccs.ui.clientList.messages.push(newMessage)
      }
      state.ccs.ui.clientList.displayMessages = parseInt(data)
      emitter.emit('render')
    }, state.ccs.ui.clientList.clients[parseInt(data)].JAID)
  })

// validates the user and logs in
  emitter.on('logIn', function () {
    // check user exists
    ccsapi.findUser(function (res) {
      if (res !== null && res[0].UserRole !== 'Offender') {
        ccsapi.findSalt(function (salt) {
          var passwordData = sha512(state.ccs.ui.logIn.password, salt)
          ccsapi.login(function (res) {
            if (res === '1') {
              state.authenticated = true
              window.localStorage.setItem('auth', new Date().getTime())
              emitter.emit('pushState', '/ccs/dashboard')
            } else {
              state.ccs.ui.logIn.error = 'That looks like it was the wrong password.'
              emitter.emit('render')
            }
          }, {Username: state.ccs.ui.logIn.username, Password: passwordData.passwordHash})
        }, {Username: state.ccs.ui.logIn.username})
        // compare hashes
        // log in or error
      } else {
        state.ccs.ui.logIn.error = `We couldn't find an account with this username.`
        emitter.emit('render')
      }
    }, state.ccs.ui.logIn.username)


  })

// changes the selected tab on a page
  emitter.on('updateActiveTab', function (data) {
    state.client.ui[data.template].active = data.value
    emitter.emit('render')
  })

// changes the page of a paginated table
  emitter.on('updatePage', function (data) {
    state.ccs.ui.manageUsers.pagination[data.target] = data.value
    emitter.emit('render')
  })

// adds a new user and authenticates them
  emitter.on('grantAccess', function (data) {
    ccsapi.newUser(function (res) {
      if (state.ccs.ui.addUser.requested) {
        state.ccs.ui.manageUsers.newRequests.splice(state.ccs.ui.addUser.requested, 1)
      }
    }, data)
  })

// checks if a user exists
  emitter.on('checkUser', function (data) {
    ccsapi.findUser(function (res) {
      if (res !== null) { state.ccs.ui.addUser.exists = true }
    }, data)
  })

// loads the adduser page for a new user
  emitter.on('loadAddNewUser', function () {
    state.ccs.ui.addUser = {
      loaded: false,
      lightbox: false,
      givenName: '',
      lastName: '',
      email: '',
      region: '',
      location: '',
      role: 'User',
      error: '',
      requested: false,
      regions: '',
      locations: ''
    }
    emitter.emit('pushState', '/ccs/admin/adduser')
  })

// loads the edituser page for an existing user
  emitter.on('loadEditUser', function (data) {
    var user = state.ccs.ui.manageUsers.users[data.index]
    state.ccs.ui.editUser.name = user.name
    state.ccs.ui.editUser.givenName = user.givenName
    state.ccs.ui.editUser.lastName = user.lastName
    state.ccs.ui.editUser.email = user.email
    state.ccs.ui.editUser.region = user.region
    state.ccs.ui.editUser.location = user.location
    state.ccs.ui.editUser.role = user.role
    emitter.emit('pushState', '/ccs/admin/edituser')
  })

// loads the adduser page for an existing request
  emitter.on('updateNewUser', function (data) {
    var user = state.ccs.ui.manageUsers.newRequests[data.index]
    state.ccs.ui.addUser.givenName = user.givenName
    state.ccs.ui.addUser.lastName = user.lastName
    state.ccs.ui.addUser.email = user.email
    state.ccs.ui.addUser.region = user.region
    state.ccs.ui.addUser.location = user.location
    state.ccs.ui.addUser.requested = data.index
    emitter.emit('pushState', '/ccs/admin/adduser')
  })

// changes the sort direction of a column in a table
  emitter.on('reverseSort', function(data) {
    state.ccs.ui[data.template].sort[data.table].direction = state.ccs.ui[data.template].sort[data.table].direction === 'asc' ? 'desc' : 'asc'
    emitter.emit('render')
  })

// changes the sort column in a table
  emitter.on('updateSort', function(data) {
    state.ccs.ui[data.template].sort[data.table].on = data.target
    state.ccs.ui[data.template].sort[data.table].direction = 'asc'
    emitter.emit('render')
  })

// updates the error assocatied with a template
  emitter.on('updateError', function (data) {
    state.ccs.ui[data.template].error = data.error;
    emitter.emit('render')
  })

// updates the value of a template's state from an input
  emitter.on('updateInput', function (data) {
    state[data.user].ui[data.template][data.target] = data.text
    emitter.emit('render')
  })

// loads the existing users and new requests for the manageusers template
  emitter.on('loadUsers', function () {
    ccsapi.getStaff(function (data) {
      state.ccs.ui.manageUsers.users = data
      ccsapi.getNewRequests(function (data) {
        state.ccs.ui.manageUsers.newRequests = data
        state.ccs.ui.manageUsers.loaded = true
        emitter.emit('render')
      }, {location: state.ccs.user.locationID})
    }, {location: state.ccs.user.locationID})
  })

// loads all the administrators
  emitter.on('loadAdministrators', function (data) {
    ccsapi.getAdministrators(function (data) {
      state.ccs.ui.administrators.administrators = data
      state.ccs.ui.administrators.loaded = true

      emitter.emit('render')
    })
  })

// loads all the locations
  emitter.on('loadLocations', function () {
    ccsapi.getLocations(function (data) {
      state.locations = data
      state.ccs.ui.home.loaded = true
      emitter.emit('render')
    })
  })

// loads the data for a user's region
  emitter.on('loadRegionData', function (template) {
    ccsapi.getRegionData(function (response) {
      state.ccs.ui[template].region = response.RegionName
      state.ccs.ui[template].locations = response.Locations
      state.ccs.ui[template].locations.sort(function (a, b) {
        return (a.SiteName > b.SiteName) - (a.SiteName < b.SiteName)
      })
      state.ccs.ui[template].loaded = true

      emitter.emit('render')
    }, state.ccs.user.regionID)
  })

// not used
  emitter.on('defaultSelected', function () {
    state.selected = {
     appointmentType: state.static.appointmentTypes[0],
     messageType: state.static.messageTypes[0],
     location: state.region.locations[0].name,
     program: state.region.CWprograms[0].name,
     showRecipients: true
    }

    state.message.address = state.region.CWprograms[0].address
    state.message.additionalInfo = state.region.CWprograms[0].info + '\n' + state.static.rescheduleText

    state.loaded = true

    setTimeout(function () { emitter.emit('render') }, 10)
  })

// not used
  emitter.on('updateSelected', function (data) {
    state.selected[data.id] = data.value

    if (data.id === 'appointmentType') {
      state.message.appointmentType = data.value
      if (['Supervision', 'Program'].includes(data.value)) {
        state.selected.program = null
        state.message.address = (state.region.locations.filter(function (obj) {
          return obj.name === state.selected.location
        }))[0].address
        state.message.additionalInfo = state.selected.messageType === 'Community Work' ? state.static.rescheduleText : ''
        state.message.appointmentType = data.value
      } else {
        var program = state.region.CWprograms[0]
        state.selected.program = program.name
        updateMessage(program)
      }
    }

    if (data.id === 'messageType') {
      if (['Missed Appointment', 'Cancellation'].includes(data.value)) {
        state.message.additionalInfo = ''
      }
    }

    if (data.id === 'location') {
      var program = (state.region.locations.filter(function (obj) {
          return obj.name === data.value
        }))[0]
        state.message.address = program.address
        state.message.additionalInfo = (program.info ? program.info + '\n' : '') + (state.selected.messageType === 'Community Work' ? state.static.rescheduleText : '')
    }

    if (data.id === 'program') {
      updateMessage(state.region.CWprograms.filter(function (obj) {
        return obj.name === data.value})[0])
    }

    emitter.emit('render')

    // hacky AF
    setTimeout(function() {emitter.emit('render')}, 10)

    function updateMessage (program) {
      state.message.address = program.address
      state.message.additionalInfo = program.info + '\n' + state.static.rescheduleText
    }
  })

  emitter.on('toggleLightbox', function (template) {
    state.lightbox = !state.lightbox
    state.ccs.ui[template].lightbox = !state.ccs.ui[template].lightbox
    emitter.emit('render')
  })

// not used
  emitter.on('toggleRecipientListDisplay', function () {
    state.selected.showRecipients = !state.selected.showRecipients
    emitter.emit('render')
  })

// not used
  emitter.on('updateMessage', function (data) {
    state.message[data.id] = data.text
  })

  // emitter.on('updateInput', function (data) {
  //   state.newRecipient[data.id] = data.text
  //   emitter.emit('render')
  // })

// not used
  emitter.on('submitNewRecipient', function (data) {
    state.newRecipient.location = state.selected.location
    state.newRecipient.programs = [state.selected.program]

    state.region.offenders.push(state.newRecipient)
    state.newRecipient = {
      name: '',
      phone: '',
      location: '',
      programs: []
    }

    emitter.emit('toggleLightbox')
  })

// declare bus handlers for app
  emitter.on('updateContent', function (data) {
    state.client.user.phone = data['Phones'][0]['PhoneNumber'].substr(1)

    state.client.ui.reminders.messages = []

    var message
    for (message of data['Messages']) {
      var newMessage = {
        content: message['MessageContents'],
        receivedOrSentDate: message['DateDelivered'],
        messageType: message['MessageType'],
        direction: message[`Outbound`] === '1' ? 'outbound' : 'inbound',
        response: message[`ResponseRequired`] === '1'
      }

      state.client.ui.reminders.messages.push(newMessage)
    }

    state.client.ui.reminders.loaded = true
    emitter.emit('render')
  })

  emitter.on('clearNewMessage', function () {
    state.client.newMessage = ''
  })

  emitter.on('updateNewMessage', function (data) {
    state.client.newMessage = data.text
  })

  // emitter.on('sendSMS', function () {
  //   state.client.sent = true
  //   emitter.emit('render')
  // })

  emitter.on('updateNewSMS', function (data) {
    state.client[data.id] = data.text
  })
}

var sha512 = function(password, salt) {
  var hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  var value = hash.digest('hex')
  return {
    salt: salt,
    passwordHash: value
  }
}
