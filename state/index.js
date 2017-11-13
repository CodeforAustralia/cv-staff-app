var api = require('../lib/ccsapi')

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
    state.user = {
      name: 'Georgia Hansford',
      email: 'Georgia.hansford@justice.vic.gov.au',
      locationID: 4,
      regionID: 7,
      role: 'Admin'
    }

    // This is where the real stuff starts
    state.ccs = {
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
        }
      }
    }
  }

// changes the page of a paginated table
  emitter.on('updatePage', function (data) {
    state.ccs.ui.manageUsers.pagination[data.target] = data.value
    emitter.emit('render')
  })

// adds a new user and authenticates them
  emitter.on('grantAccess', function (data) {
    api.newUser(function (res) {
      if (state.ccs.ui.addUser.requested) {
        state.ccs.ui.manageUsers.newRequests.splice(state.ccs.ui.addUser.requested, 1)
      }
    }, data)
  })

// checks if a user exists
  emitter.on('checkUser', function (data) {
    api.findUser(function (res) {
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
    state.ccs.ui[data.template][data.target] = data.text
    emitter.emit('render')
  })

// loads the existing users and new requests for the manageusers template
  emitter.on('loadUsers', function () {
    api.getStaff(function (data) {
      state.ccs.ui.manageUsers.users = data
      api.getNewRequests(function (data) {
        state.ccs.ui.manageUsers.newRequests = data
        state.ccs.ui.manageUsers.loaded = true
        emitter.emit('render')
      }, {location: state.user.locationID})
    }, {location: state.user.locationID})
  })

// loads all the administrators
  emitter.on('loadAdministrators', function (data) {
    api.getAdministrators(function (data) {
      state.ccs.ui.administrators.administrators = data
      state.ccs.ui.administrators.loaded = true

      emitter.emit('render')
    })
  })

// loads all the locations
  emitter.on('loadLocations', function () {
    api.getLocations(function (data) {
      state.locations = data
      state.ccs.ui.home.loaded = true
      emitter.emit('render')
    })
  })

// loads the data for a user's region
  emitter.on('loadRegionData', function (template) {
    api.getRegionData(function (response) {
      state.ccs.ui[template].region = response.RegionName
      state.ccs.ui[template].locations = response.Locations
      state.ccs.ui[template].locations.sort(function (a, b) {
        return (a.SiteName > b.SiteName) - (a.SiteName < b.SiteName)
      })
      state.ccs.ui[template].loaded = true

      emitter.emit('render')
    }, state.user.regionID)
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
}
