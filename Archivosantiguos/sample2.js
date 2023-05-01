
var moment = require('moment')

// our time precision
let timeUnit = 'minute'

let startTime = moment().startOf(timeUnit)
let sampleTime = moment(startTime)
let samples = []
for (var i = 0; i < 10; i++) {
	samples.push({x: moment(sampleTime), y: i})
	sampleTime.add(20, 'seconds')
}
let endTime = moment(sampleTime)

console.log('samples-->')
samples.forEach((value, key) => {
		console.log('[', key, '] ', value.x.format("YY-MM-DD hh:mm:ss"), value.y)
})

let datesResampled = samples.map(value => {
  let resampled =  value.x.startOf(timeUnit)
  return {x: resampled, y: value.y}
})

console.log('datesResampled-->')
datesResampled.forEach((value, key) => {
		console.log('[', key, '] ', value.x.format("YY-MM-DD hh:mm:ss"), value.y)
})

// create a map object with time key for lookup
let datesReduced = datesResampled.reduce((result, value, key) => {
  result[value.x.valueOf()] = value
  return result
}, {})

console.log('datesReduced-->')
for (const [key, value] of Object.entries(datesReduced)) {
		console.log('[', key, '] ', value.x.format("YY-MM-DD hh:mm:ss"), value.y)
}

let filled = []
while (startTime.isBefore(endTime)) {
	if (datesReduced[startTime.valueOf()])
		filled.push(datesReduced[startTime.valueOf()])
	else
		filled.push({x: moment(startTime), y: null })
	startTime.add(20, 'seconds')
}

console.log('filled-->')
filled.forEach((value, key) => {
		console.log('[', key, '] ', value.x.format("YY-MM-DD hh:mm:ss"), value.y)
})