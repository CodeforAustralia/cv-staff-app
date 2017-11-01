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

    state.ui = {
      home: {
        loaded: false
      }
    }
  }

  emitter.on('loadLocations', function () {
    api.getLocations(function (data) {
      state.locations = data
      state.ui.home.loaded = true
    })

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


  emitter.on('toggleLightbox', function () {
    state.lightbox = !state.lightbox
    emitter.emit('render')
  })

  emitter.on('toggleRecipientListDisplay', function () {
    state.selected.showRecipients = !state.selected.showRecipients
    emitter.emit('render')
  })

  emitter.on('updateMessage', function (data) {
    state.message[data.id] = data.text
  })

  emitter.on('updateInput', function (data) {
    state.newRecipient[data.id] = data.text
    emitter.emit('render')
  })

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
