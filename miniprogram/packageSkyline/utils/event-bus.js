const map = {}

function on(eventName, handler) {
  map[eventName] = map[eventName] || []
  map[eventName].push(handler)
}

function off(eventName, handler) {
  const handlerList = map[eventName]
  if (!handlerList || !handlerList.length) return

  const index = handlerList.indexOf(handler)
  if (index !== -1) handlerList.splice(index, 1)
}

function emit(eventName, ...args) {
  const handlerList = map[eventName]
  if (!handlerList || !handlerList.length) return

  for (let i = handlerList.length - 1; i >= 0; i--) {
    handlerList[i](...args)
  }
}

export default {
  on,
  off,
  emit,
}
