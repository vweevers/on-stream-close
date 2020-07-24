'use strict'

const test = require('tape')
const Readable = require('stream').Readable
const osc = require('.')

test('on close', function (t) {
  t.plan(2)

  const stream = new Readable({
    autoDestroy: true,
    read () {
      this.push(null)
    }
  })

  osc(stream, function (err) {
    t.ifError(err, 'no error')
  })

  osc.promises(stream).then(function () {
    t.pass('called')
  })

  stream.resume()
})

test('on error', function (t) {
  t.plan(2)

  const stream = new Readable({
    autoDestroy: true,
    read () {
      this.destroy(new Error('test'))
    }
  })

  osc(stream, function (err) {
    t.is(err.message, 'test')
  })

  osc.promises(stream).catch(function (err) {
    t.is(err.message, 'test')
  })

  stream.resume()
})
