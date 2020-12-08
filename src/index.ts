type onSetCallbackType = {
  propertyName: string
  callback: Function
}

type onSetAnyCallbackType = Function

export default class Mousetrap<T extends Object> {
  onSetCallbacks: Array<onSetCallbackType> = []
  onSetAnyCallbacks: Array<onSetAnyCallbackType> = []
  proxy: any

  constructor(private object: T) {}

  onSet(propertyName: string, callback: Function) {
    this.onSetCallbacks.push({ propertyName, callback })
  }

  onSetAny(callback: onSetAnyCallbackType) {
    this.onSetAnyCallbacks.push(callback)
  }

  setup() {
    const that = this
    this.proxy = new Proxy<T>(this.object, {
      set(
        target: any,
        property: string | number | symbol,
        value: any,
        receiver: any
      ): boolean {
        if (that.onSetAnyCallbacks.length) {
          Object.entries(that.onSetAnyCallbacks).forEach(
            ([index, callback]) => {
              callback()
            }
          )
        }
        if (that.onSetCallbacks.length) {
          Object.entries(that.onSetCallbacks).forEach(
            ([index, onSetCallback]) => {
              if (property === onSetCallback.propertyName) {
                onSetCallback.callback()
              }
            }
          )
        }
        return true
      },
    })
    return this.proxy as T
  }
}
