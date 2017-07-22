'use strict'
var test = require('tape')
var alicebooks = require('../index')
var fs = require('fs')
var path = require('path')
var iconv = require('iconv-lite')
var missi = require('mississippi')

test('var client = new Alicebooks', t => {
  var c = alicebooks()
  t.is(c.name, 'alice-books.com', 'c.name eq "alice-books.com"')
  t.is(c.failAfter, 7, 'c.failAfter === 7')
  t.is(c.charset, 'utf8', 'c.charset eq "utf8"')
  t.is(c.searchHome, 'http://alice-books.com/item/list/all', 'c.searchHome eq "http://alice-books.com/item/list/all"')
  t.end()
})

test('var qstr = client.createQuery(paarms)', t => {
  var c = alicebooks()
  var params = {
    category: 'mak',
    value: 'ケモノ絵描きの光速2'
  }
  t.test('var queryObj = client.transformQuery(params)', tt => {
    var o = c.transformQuery(params)
    t.deepEqual(o, {
      keyword: 'ケモノ絵描きの光速2'
    }, JSON.stringify(o))
    tt.end()
  })
  var qs = c.createQuery(params)
  t.ok(/keyword=%E3%82%B1%E3%83%A2%E3%83%8E%E7%B5%B5%E6%8F%8F%E3%81%8D%E3%81%AE%E5%85%89%E9%80%9F2/.test(qs), qs)
  t.end()
})

test('var stream = client.scraper()', t => {
  var c = alicebooks()
  var b = []
  var i = 0
  var list = [
    { urlOfTitle: 'http://alice-books.com/item/show/409-20',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'Spell Magic',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-19',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'TORIERO1+2',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-18',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'OVERKILL',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-17',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'Revenge Porn',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-16',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'Unlimited',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-15',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'ダンジョンメス',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-14',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'Slut Foxy',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-13',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'ドミナデエステ',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-10',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'ORGY',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-12',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'Chocolate2',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-11',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'メスケモカタログトランスフォーム',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-9',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'IDOL',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-8',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'Lovestal2',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-6',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'Re:Temptation',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-7',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'Furry-Girls',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' },
    { urlOfTitle: 'http://alice-books.com/item/show/409-5',
    srcOfThumbnail: 'http://alice-books.com/img/layout/adult_only_n.png',
    title: 'GoodDoggy',
    urlOfCircle: 'http://alice-books.com/item/list/all?circle_id=409',
    circle: 'ケモノ絵描きの光速2' }
  ]

  missi.pipe(
    fs.createReadStream(path.join(__dirname, 'kemono.html')),
    iconv.decodeStream(c.charset),
    c.scraper(),
    missi.through.obj((o, _, d) => {
      t.deepEqual(list[i], o, JSON.stringify(o))
      i += 1
      d()
    }),
    err => {
      t.notOk(err, 'no exits error')
      t.is(i, 16, 'items length 16')
      t.end()
    }
  )
})
