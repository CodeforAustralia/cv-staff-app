// require dependencies
var html = require('choo/html')
var css = require('sheetify')

// export module
module.exports = function (percentage) {
  var style = css`
    :host {
    }
  `

  var data = [{
    name: 'Woodwork',
    date: 'Wednesday 1st November 2017',
    startTime: '9:30am',
    endTime: '4:00pm',
    hours: 6.5
  }, {
    name: 'Woodwork',
    date: 'Wednesday 8th November 2017',
    startTime: '9:30am',
    endTime: '4:00pm',
    hours: 6.5
  }, {
    name: 'Kniting',
    date: 'Monday 13th November 2017',
    startTime: '10:00am',
    endTime: '3:'
  }]

  return html`
    <div id="content" class=${style}>
      <table>
    </div>
  `
}
