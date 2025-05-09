const runOnUI = wx.worklet.runOnUI

export default Behavior({
  lifetimes: {
    created() {
      runOnUI(() => {
        'worklet'

        if (!globalThis.temp) globalThis.temp = {}
        if (!globalThis.eventBus) {
          const eventBus = {
            map: {},
            on(eventName, handler) {
              eventBus.map[eventName] = eventBus.map[eventName] || []
              eventBus.map[eventName].push(handler)
            },
            off(eventName, handler) {
              const handlerList = eventBus.map[eventName]
              if (!handlerList || !handlerList.length) return

              const index = handlerList.indexOf(handler)
              if (index !== -1) handlerList.splice(index, 1)
            },
            emit(eventName, args) {
              const handlerList = eventBus.map[eventName]
              if (!handlerList || !handlerList.length) return

              for (let i = handlerList.length - 1; i >= 0; i--) {
                handlerList[i](args)
              }
            },
          }
          globalThis.eventBus = eventBus
        }
      })()
    },
  },
})
