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
      name: 'John Jansen'
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
          on: 'office',
          direction: 'asc'
        },
        tableFields: ['administrator', 'office', 'region', 'email'],
        administrators: [{
          administrator: 'John Doe',
          office: 'Ararat',
          region: 'Grampians',
          email: 'John.Doe@justice.vic.gov.au'
        }, {
          administrator: 'Jane Smith',
          office: 'Bairnsdale',
          region: 'Gippsland',
          email: 'Jane.L.Smith@justice.vic.gov.au'
        }, {
          administrator: 'Jesse Miller',
          office: 'Ballarat',
          region: 'Grampians',
          email: 'Jesse.Miller@justice.vic.gov.au'
        }, {
          administrator: 'Mary Jo Black',
          office: 'Benalla',
          region: 'Hume',
          email: 'Mary.Jo.Black@justice.vic.gov.au'
        }]
      },
      manageUsers: {
        sort: {
          on: 'name',
          direction: 'asc'
        },
        tableFields: ['name', 'email', 'location', 'region', 'role', 'manage this account'],
        newRequests: [{
          name: 'Roffe Ventimiglia',
          email: 'Roffe.Ventimiglia@justice.vic.gov.au',
          location: 'Sunshine',
          region: 'North West Metro',
          role: ''
        }, {
          name: 'Sheamus Feldt',
          email: 'Sheamus.Feldt@justice.vic.gov.au',
          location: 'Sunshine',
          region: 'North West Metro',
          role: ''
        }],
        users: [{
          name: 'Asklepios Marchegiano',
          email: 'Asklepios.Marchegiano@justice.vic.gov.au',
          location: 'Sunshine',
          region: 'North West Metro',
          role: 'User'
        }, {
          name: 'Caius Fairburn',
          email: 'Caius.L.Fairburn@justice.vic.gov.au',
          location: 'Sunshine',
          region: 'North West Metro',
          role: 'User'
        }, {
          name: 'Ljubica Ellery',
          email: 'Ljubica.Ellery@justice.vic.gov.au',
          location: 'Sunshine',
          region: 'North West Metro',
          role: 'Admin'
        }, {
          name: 'Sivan Puig',
          email: 'Sivan.Puig@justice.vic.gov.au',
          location: 'Sunshine',
          region: 'North West Metro',
          role: 'User'
        }, {
          name: 'Viola Boels',
          email: 'Viola.Boels@justice.vic.gov.au',
          location: 'Sunshine',
          region: 'North West Metro',
          role: 'User'
        }]
      },
      addUser: {
        name: '',
        email: '',
        region: '',
        location: '',
        role: 'User',
        error: '',
        requested: ''
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

  emitter.on('grantAccess', function () {
    state.ui.manageUsers.users.push({
      name: state.ui.addUser.name,
      email: state.ui.addUser.email,
      region: state.ui.addUser.region,
      location: state.ui.addUser.location,
      role: state.ui.addUser.role
    })
    if (state.ui.addUser.requested) {
      state.ui.manageUsers.newRequests.splice(state.ui.addUser.requested, 1)
    }
    state.ui.addUser = {
      name: '',
      email: '',
      region: '',
      location: '',
      role: 'User',
      error: '',
      requested: ''
    }
  })

  emitter.on('addNewUser', function () {
    state.ui.addUser = {
      name: '',
      email: '',
      region: '',
      location: '',
      role: 'User',
      error: '',
      requested: false
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
    state.ui[data.template].sort.direction = state.ui[data.template].sort.direction === 'asc' ? 'desc' : 'asc'
    emitter.emit('render')
  })

  emitter.on('updateSort', function(data) {
    state.ui[data.template].sort.on = data.target
    state.ui[data.template].sort.direction = 'asc'
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

  emitter.on('loadLocations', function () {
    api.getLocations(function (data) {
      state.locations = data
      state.ui.home.loaded = true
    })

    // RACE CONDITION - without timeout, document renders before data is loaded. If having 403 errors, try increasing timeout time
    setTimeout(function () { emitter.emit('render') }, 0)
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

    console.log(state.selected)
    console.log(state.message)

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
