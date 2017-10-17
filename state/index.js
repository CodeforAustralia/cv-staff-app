module.exports = function (state, emitter) {
  // run on app start
  initialise()

  function initialise () {
    state.static = {
      appointmentTypes: ['Community Work', 'Supervision', 'Program'],
      messageTypes: ['Reminder', 'Reschedule', 'Missed Appointment', 'Cancellation']
    }
  }
}
