var xtend = require('xtend')
var inherits = require('inherits')
var backoff = require('backoff')
var hyperquest = require('hyperquest')
var Service = require('doujinshop-meta-search-service')

module.exports = Alicebooks
inherits(Alicebooks, Service)

function Alicebooks () {
  if (!(this instanceof Alicebooks)) return new Alicebooks()
  Service.call(this, 'alice-books.com', {
    charset: 'utf8',
    searchHome: 'http://alice-books.com/item/list/all'
  })
}

Alicebooks.prototype.transformQuery = function (_p) {
  var p = xtend(_p)
  var q = xtend({keyword: p.value})
  delete p.category
  delete p.value
  return xtend(q, p)
}

Alicebooks.prototype._request = function (qstr, requestOpt, onResponse) {
  var uri = this.searchHome + '?' + qstr
  var opt = xtend(requestOpt, {headers: {cookie: 'adult_cert=Yes%21+I%27m+an+adult%21'}})
  return backoff.call(hyperquest, uri, opt, onResponse)
}

Alicebooks.prototype.scraper = require('./lib/scraper')
