const {get, cloneDeep} = require('lodash/fp')

// A TERRIBLE SIN I KNOW
let oldLog = console.log.bind(console)
console.log = (...args) => {
  args = args.map(i => i.isValueHistory ? i.get() : i)
  return oldLog(...args)
}

let bygone = (name='value') => {
  let history = []
  let state = null
  return new Proxy({
    isValueHistory: true,
    get: () => state,
    getHistory: () => history,
    valueOf: () => state,
    setName: (value) => {name = value},
    set: (value) => { 
      state = value
      history.push(cloneDeep(value)) 
      return value
    },
    toHistoryString: (options={}) => {
      options.join = options.join || '\n'
      options.indent = options.indent || ''
      return options.indent + history
        .map((item, index) => {
          let pre = name + ' ' + index + ': ' 
          if(typeof item === 'object' && options.path){
            return pre + JSON.stringify(get(options.path, item))
          }
          return pre + JSON.stringify(item)
        })
        .join(options.join + options.indent)
    },
    clearHistory: () => {
      history = [cloneDeep(state)]
    },
    reset: () => {
      history = []
      state = null
    }
  },{
    set: (target, prop, value) => {
      let result = cloneDeep(state)
      result[prop] = value
      history.push(result)
      state[prop] = value
      return 
    },
    get: (target, prop, caller) => {
      if(prop === '_bygone_get_state') return state
      if(target[prop]) return target[prop]
      return target.get()[prop]
    },
    deleteProperty: (target, prop) => {
      let result = cloneDeep(target.get())
      delete result[prop] 
      history.push(result)
      delete state[prop]
    },
    ownKeys: (target) => {
      if(typeof state != 'object') return ['_bygone_get_state']
      return Reflect.ownKeys(target.get())
    }
  })
}

module.exports = bygone
