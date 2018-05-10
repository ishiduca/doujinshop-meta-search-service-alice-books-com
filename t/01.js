'use strict'
const test = require('tape')
const alicebooks = require('../index')
const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')
const missi = require('mississippi')

test('const client = new Alicebooks', t => {
  const c = alicebooks()
  t.is(c.name, 'alice-books.com', 'c.name eq "alice-books.com"')
  t.is(c.failAfter, 7, 'c.failAfter === 7')
  t.is(c.charset, 'utf8', 'c.charset eq "utf8"')
  t.is(c.searchHome, 'http://alice-books.com/item/list/all', 'c.searchHome eq "http://alice-books.com/item/list/all"')
  t.end()
})

test('const qstr = client.createQuery(paarms)', t => {
  const c = alicebooks()
  const params = {
    category: 'mak',
    value: 'ケモノ絵描きの光速2'
  }
  t.test('const queryObj = client.transformQuery(params)', tt => {
    const o = c.transformQuery(params)
    t.deepEqual(o, {
      keyword: 'ケモノ絵描きの光速2'
    }, JSON.stringify(o))
    tt.end()
  })
  const qs = c.createQuery(params)
  t.ok(/keyword=%E3%82%B1%E3%83%A2%E3%83%8E%E7%B5%B5%E6%8F%8F%E3%81%8D%E3%81%AE%E5%85%89%E9%80%9F2/.test(qs), qs)
  t.end()
})

test('const stream = client.scraper()', t => {
  const c = alicebooks()
  const b = []
  let i = 0 
  const list = require('./result-list').list
  missi.pipe(
    fs.createReadStream(path.join(__dirname, 'sindoll.html')),
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
