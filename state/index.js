var api = require('../lib/api')

module.exports = function (state, emitter) {
  // run on app start
  initialise()

  function initialise () {
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

    state.ui = {
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
        name: '',
        email: '',
        region: '',
        location: '',
        role: '',
        lightbox: false
      }
    }
  }

  emitter.on('increasePage', function (data) {
    state.ui.manageUsers.pagination[data.target] = data.value

    emitter.emit('render')
  })

  emitter.on('grantAccess', function (data) {
    api.newUser(function (res) {
      if (state.ui.addUser.requested) {
        state.ui.manageUsers.newRequests.splice(state.ui.addUser.requested, 1)
      }
    }, data)

  })

  emitter.on('checkUser', function (data) {
    api.findUser(function (res) {
      if (res !== null) { state.ui.addUser.exists = true }
    }, data)
  })

  emitter.on('addNewUser', function () {
    state.ui.addUser = {
      loaded: false,
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
    emitter.emit('pushState', '/admin/adduser')
  })

  emitter.on('editUser', function (data) {
    var user = state.ui.manageUsers.users[data.index]
    state.ui.editUser.name = user.name
    state.ui.editUser.email = user.email
    state.ui.editUser.region = user.region
    state.ui.editUser.location = user.location
    state.ui.editUser.role = user.role
    emitter.emit('pushState', '/admin/edituser')
  })

  emitter.on('updateNewUser', function (data) {
    var user = state.ui.manageUsers.newRequests[data.index]
    state.ui.addUser.name = user.name
    state.ui.addUser.email = user.email
    state.ui.addUser.region = user.region
    state.ui.addUser.location = user.location
    state.ui.addUser.requested = data.index
    emitter.emit('pushState', '/admin/adduser')
  })

  emitter.on('reverseSort', function(data) {
    state.ui[data.template].sort[data.table].direction = state.ui[data.template].sort[data.table].direction === 'asc' ? 'desc' : 'asc'
    emitter.emit('render')
  })

  emitter.on('updateSort', function(data) {
    state.ui[data.template].sort[data.table].on = data.target
    state.ui[data.template].sort[data.table].direction = 'asc'
    emitter.emit('render')
  })

  emitter.on('updateError', function (data) {
    state.ui[data.template].error = data.error;
    emitter.emit('render')
  })

  emitter.on('updateInput', function (data) {
    state.ui[data.template][data.target] = data.text
    emitter.emit('render')
  })

  emitter.on('loadUsers', function () {
    api.getStaff(function (data) {
      state.ui.manageUsers.users = data
      api.getNewRequests(function (data) {
        state.ui.manageUsers.newRequests = data
        state.ui.manageUsers.loaded = true
        emitter.emit('render')
      }, {location: state.user.locationID})
    }, {location: state.user.locationID})
  })

  emitter.on('loadAdministrators', function (data) {
    api.getAdministrators(function (data) {
      state.ui.administrators.administrators = data
      state.ui.administrators.loaded = true

      emitter.emit('render')
    })
  })

  emitter.on('loadLocations', function () {
    api.getLocations(function (data) {
      state.locations = data
      state.ui.home.loaded = true
    })

    // RACE CONDITION - without timeout, document renders before data is loaded. If having 403 errors, try increasing timeout time
    setTimeout(function () { emitter.emit('render') }, 0)
  })

  emitter.on('loadRegionData', function (template) {
    api.getRegionData(function (response) {
      state.ui[template].region = response.RegionName
      state.ui[template].locations = response.Locations
      state.ui[template].locations.sort(function (a, b) {
        return (a.SiteName > b.SiteName) - (a.SiteName < b.SiteName)
      })
      state.ui[template].loaded = true


      emitter.emit('render')
    }, state.user.regionID)
  })

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
    state.ui[template].lightbox = !state.ui[template].lightbox
    emitter.emit('render')
  })

  emitter.on('toggleRecipientListDisplay', function () {
    state.selected.showRecipients = !state.selected.showRecipients
    emitter.emit('render')
  })

  emitter.on('updateMessage', function (data) {
    state.message[data.id] = data.text
  })

  // emitter.on('updateInput', function (data) {
  //   state.newRecipient[data.id] = data.text
  //   emitter.emit('render')
  // })

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
