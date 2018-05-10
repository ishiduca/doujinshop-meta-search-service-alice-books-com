var missi = require('mississippi')
var trumpet = require('trumpet')

var ALICE_BOOKS_COM = 'http://alice-books.com'

module.exports = function scraper () {
  var ws = trumpet()
  var rs = missi.through.obj()
  var c = 0
  var isEnded = false

  ws.selectAll('.item_box', function (aNode) {
    c += 1
    var o = {}
    var tr = trumpet()
    tr.select('a', function (a) {
      a.getAttribute('href', function (href) {
        o.urlOfTitle = ALICE_BOOKS_COM + href
        tr.select('a>img', function (img) {
          img.getAttribute('src', function (src) {
            src = src.replace(/-\w(\.\w+)$/, rep)
            function rep (_, ext) { return '-h' + ext }
//            o.srcOfThumbnail = ALICE_BOOKS_COM + src
            o.srcOfThumbnail = src
            img.getAttribute('alt', function (alt) {
              o.title = alt
              tr.select('.circle_name a', function (a) {
                a.getAttribute('href', function (href) {
                  o.urlOfCircle = ALICE_BOOKS_COM + href
                  var b = []
                  missi.pipe(
                    a.createReadStream(),
                    missi.through(function (r, _, d) {
                      b.push(r); d()
                    }, function (d) {
                      var str = Buffer.isBuffer(b[0])
                        ? String(Buffer.concat(b))
                        : b.join('')
                      o.circle = str
                      d()
                    }),
                    function (err) {
                      if (err) rs.emit('error', err)
                      rs.write(o)
                      c -= 1
                      if (c === 0 && isEnded) rs.end()
                    }
                  )
                })
              })
            })
          })
        })
      })
    })
    aNode.createReadStream().pipe(tr)
  })

  ws.once('end', function () {
    if (c === 0) rs.end()
    else (isEnded = true)
  })

  return missi.duplex.obj(ws, rs)
}
