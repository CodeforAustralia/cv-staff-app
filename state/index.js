module.exports = function (state, emitter) {
  // run on app start
  initialise()

  function initialise () {
    state.static = {
      appointmentTypes: ['Community Work', 'Supervision', 'Program'],
      messageTypes: ['Reminder', 'Reschedule', 'Missed Appointment', 'Cancellation']
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
      locations: ['Ballarat', 'Horsham'],
      CWprograms: {
        'Ballarat': ['St Vincent De Paul Friday InHouse Program', 'Woodwork'],
        'Horsham': ['Stitch Picking']
      },
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
      program: 'init'
    }
  }

  emitter.on('defaultSelected', function () {
    state.selected = {
     appointmentType: state.static.appointmentTypes[0],
     messageType: state.static.messageTypes[0],
     location: state.region.locations[0],
     program: state.region.CWprograms[state.region.locations[0]][0],
     showRecipients: true
    }

    emitter.emit('render')
  })

  emitter.on('updateSelected', function (data) {
    state.selected[data.id] = data.value

    if ((data.id === 'appointmentType') && (['Supervision', 'Program'].includes(data.value))) {
      state.selected.program = null
    } else if (data.id === 'appointmentType') {
      state.selected.program = state.region.CWprograms[state.selected.location][0]
    }

    if ((data.id === 'location') && (state.selected.appointmentType === 'Community Work')) {
      state.selected.program = state.region.CWprograms[data.value][0]
    }
    emitter.emit('render')

    // hacky AF
    setTimeout(function() {emitter.emit('render')}, 10)
  })

  emitter.on('toggleLightbox', function () {
    state.lightbox = !state.lightbox
    emitter.emit('render')
  })

  emitter.on('toggleRecipientListDisplay', function () {
    state.selected.showRecipients = !state.selected.showRecipients
    emitter.emit('render')
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
