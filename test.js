const test = require('tape')
const bygone = require('./index.js')

test(t => {
  console.log('testing bygone with primatives')
  let temp = bygone()
  t.equal(temp.get(), null, 'default state is null')

  console.log('testing #set, #get, #valueOf, and #getHistory')
  temp.set('zero')
  temp.set('one')
  temp.set('two')
  t.equal(temp.get(), 'two', 'get should return the latest sets value')
  t.equal(temp.valueOf(), 'two', 'get should return the latest sets value')
  t.deepEqual(temp.getHistory(), ['zero', 'one', 'two'], 'set should append values to history')

  console.log('testing #toHistoryString and #toSetName')
  let historyString = temp.toHistoryString()
  let expectedHistoryString = `value 0: "zero"
value 1: "one"
value 2: "two"`
  t.equal(historyString, expectedHistoryString)
  let expectedHistoryStringWithName = `temp 0: "zero"
temp 1: "one"
temp 2: "two"`
  temp.setName('temp')
  t.equal(temp.toHistoryString(), expectedHistoryStringWithName)

  console.log('testing #clearHistory')
  temp.clearHistory()
  t.equal(temp.get(), 'two', 'clearHistory should leaeve state intact')
  t.deepEqual(temp.getHistory(), ['two'], 'clearHistory should empty historyecept for latest state')

  console.log('testing #reset')
  temp.reset()
  t.equal(temp.get(), null, 'reset should leaeve state intact')
  t.deepEqual(temp.getHistory(), [], 'reset should empty history')

  console.log('testing with objects')
  temp.set({one: 'abc'})

  console.log('tesing proxy setters, getters and delete')
  t.equal(temp.one, 'abc', 'proxy getters should return states prop values')

  temp.one = 'xyz'
  t.equal(temp.one, 'xyz', 'proxy setter should update states prop values')

  delete temp.one
  t.deepEqual(temp, {}, 'proxy delete should remove states prop values')

  t.end()
})
