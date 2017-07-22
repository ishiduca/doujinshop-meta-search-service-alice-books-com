var alicebooks = require('../')
var alice = alicebooks()
var s = alice.createStream()

s.once('data', o => console.log(o))
s.on('error', err => console.error(err))
s.on('end', () => console.log('!! end'))

s.end({
  category: 'mak',
  value: 'ケモノ絵描きの光速2'
})
